#!/usr/bin/env bash
# Initial AWS Lightsail setup for HKU City Hunt on Amazon Linux 2023.
# Installs Node, PM2, and Apache.
# Database is a separate step: ./setup/db_setup.sh
# TLS is a separate step: ./setup/certbot_setup.sh
#
# Usage (as ec2-user):
#   chmod +x lightsail_setup.sh
#   ./lightsail_setup.sh
#
# Optional env vars:
#   WEB_DOMAIN          Public web hostname
#   CMS_DOMAIN          CMS + API hostname

set -euo pipefail

APP_USER="${SUDO_USER:-${USER}}"
APP_HOME="$(getent passwd "$APP_USER" | cut -d: -f6)"
if [[ -z "$APP_HOME" || "$APP_HOME" == "/root" ]]; then
  APP_USER="ec2-user"
  APP_HOME="/home/ec2-user"
fi

WEB_DOMAIN=carelab-city-hunt.mosaicdigi.com
CMS_DOMAIN=carelab-city-hunt-cms.mosaicdigi.com
API_PORT=9711
WEB_PORT=3000
CMS_PORT=3001

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() {
  printf '\n==> %s\n' "$*"
}

require_root() {
  if [[ "$(id -u)" -ne 0 ]]; then
    echo "Re-running with sudo..."
    exec sudo --preserve-env=WEB_DOMAIN,CMS_DOMAIN \
      -u root "$0" "$@"
  fi
}

detect_amazon_linux() {
  if [[ ! -f /etc/os-release ]]; then
    echo "Cannot detect OS. This script targets Amazon Linux 2023."
    exit 1
  fi
  # shellcheck disable=SC1091
  . /etc/os-release
  if [[ "${ID:-}" != "amzn" || "${VERSION_ID:-}" != 2023* ]]; then
    echo "Warning: expected Amazon Linux 2023, found ${PRETTY_NAME:-unknown}."
  fi
}

install_base_packages() {
  log "Updating system and installing base packages"
  dnf update -y
  # AL2023 ships curl-minimal, which conflicts with the full curl package.
  dnf install -y wget git unzip tar gcc gcc-c++ make python3 httpd mod_ssl
}

install_node() {
  log "Installing Node.js 22 and global tools (yarn, pm2)"
  if dnf install -y nodejs22; then
    :
  elif dnf install -y nodejs20; then
    :
  else
    dnf install -y nodejs npm
  fi

  npm install -g yarn pm2

  echo "Node: $(node -v)"
  echo "npm:  $(npm -v)"
  echo "yarn: $(yarn -v)"
  echo "pm2:  $(pm2 -v)"
}

enable_services() {
  log "Enabling Apache"
  systemctl enable --now httpd

  # Allow Apache to reverse-proxy to Node (SELinux)
  if command -v getenforce >/dev/null 2>&1 && [[ "$(getenforce)" != "Disabled" ]]; then
    setsebool -P httpd_can_network_connect 1
  fi
}

create_app_dirs() {
  log "Creating application directories under ${APP_HOME}"
  mkdir -p \
    "${APP_HOME}/inbox" \
    "${APP_HOME}/server" \
    "${APP_HOME}/cms" \
    "${APP_HOME}/web"
  chown -R "${APP_USER}:${APP_USER}" \
    "${APP_HOME}/inbox" \
    "${APP_HOME}/server" \
    "${APP_HOME}/cms" \
    "${APP_HOME}/web"
}

write_vhost() {
  local dest="$1"
  local domain="$2"
  local content="$3"
  echo "$content" | sed "s/__DOMAIN__/${domain}/g" > "$dest"
}

install_apache_vhosts() {
  log "Writing Apache reverse-proxy vhosts"

  local web_src="${SCRIPT_DIR}/httpd/carelab-city-hunt-web.conf"
  local cms_src="${SCRIPT_DIR}/httpd/carelab-city-hunt-cms.conf"
  local web_dest="/etc/httpd/conf.d/carelab-city-hunt-web.conf"
  local cms_dest="/etc/httpd/conf.d/carelab-city-hunt-cms.conf"

  if [[ -f "$web_src" ]]; then
    sed -e "s/__WEB_DOMAIN__/${WEB_DOMAIN}/g" \
        -e "s/carelab-city-hunt.mosaicdigi.com/${WEB_DOMAIN}/g" \
        "$web_src" > "$web_dest"
  else
    write_vhost "$web_dest" "$WEB_DOMAIN" "$(cat <<'EOF'
<VirtualHost *:80>
    ServerName __DOMAIN__
    ServerAdmin webmaster@localhost
    ProxyPreserveHost On
    ProxyRequests Off
    RequestHeader set X-Forwarded-Proto "expr=%{REQUEST_SCHEME}"
    LimitRequestBody 52428800
    ProxyTimeout 600
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
    ErrorLog /var/log/httpd/carelab-city-hunt-web-error_log
    CustomLog /var/log/httpd/carelab-city-hunt-web-access_log combined
</VirtualHost>
EOF
)"
  fi

  if [[ -f "$cms_src" ]]; then
    sed -e "s/__CMS_DOMAIN__/${CMS_DOMAIN}/g" \
        -e "s/carelab-city-hunt-cms.mosaicdigi.com/${CMS_DOMAIN}/g" \
        "$cms_src" > "$cms_dest"
  else
    write_vhost "$cms_dest" "$CMS_DOMAIN" "$(cat <<'EOF'
<VirtualHost *:80>
    ServerName __DOMAIN__
    ServerAdmin webmaster@localhost
    ProxyPreserveHost On
    ProxyRequests Off
    RequestHeader set X-Forwarded-Proto "expr=%{REQUEST_SCHEME}"
    LimitRequestBody 52428800
    ProxyTimeout 600
    ProxyPass /v1/ http://127.0.0.1:9711/
    ProxyPassReverse /v1/ http://127.0.0.1:9711/
    ProxyPass / http://127.0.0.1:3001/
    ProxyPassReverse / http://127.0.0.1:3001/
    ErrorLog /var/log/httpd/carelab-city-hunt-cms-error_log
    CustomLog /var/log/httpd/carelab-city-hunt-cms-access_log combined
</VirtualHost>
EOF
)"
  fi

  # Enable proxy modules if they are commented out
  if [[ -f /etc/httpd/conf.modules.d/00-proxy.conf ]]; then
    sed -i 's/^#LoadModule proxy_module/LoadModule proxy_module/' /etc/httpd/conf.modules.d/00-proxy.conf
    sed -i 's/^#LoadModule proxy_http_module/LoadModule proxy_http_module/' /etc/httpd/conf.modules.d/00-proxy.conf
  fi

  apachectl configtest
  systemctl reload httpd
}

write_server_env_template() {
  local env_file="${APP_HOME}/server/.env"
  if [[ -f "$env_file" ]]; then
    echo "Keeping existing ${env_file}"
    return
  fi

  log "Writing ${env_file} template"
  cat > "$env_file" <<EOF
BASE_URL=https://${CMS_DOMAIN}/v1
PORT=${API_PORT}
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USERNAME=cms
DATABASE_PASSWORD=change-me
DATABASE_NAME=hku_city_hunt_db
TOKEN_SECRET=change-me
TZ=Asia/Hong_Kong

FRONTEND_URL=https://${WEB_DOMAIN}
WEB_URL=https://${WEB_DOMAIN}

SENDGRID_HOST=smtp.sendgrid.net
SENDGRID_USERNAME=apikey
SENDGRID_PASSWORD=
SENDGRID_PORT=587
SENDGRID_FROM=no-reply@mosaicdigi.com

CLOUDFLARE_TURNSTILE_SITE_KEY=
CLOUDFLARE_TURNSTILE_SECRET_KEY=

SMS_SERVER_URL=
SMS_SERVER_TOKEN=
REDEEM_PASSWORD=
REVALIDATION_SECRET=change-me
EOF
  chown "${APP_USER}:${APP_USER}" "$env_file"
  chmod 600 "$env_file"
}

setup_pm2_startup() {
  log "Configuring PM2 to start on boot"
  env PATH="${PATH}:/usr/bin:/usr/local/bin" pm2 startup systemd -u "$APP_USER" --hp "$APP_HOME" || true
}

print_summary() {
  cat <<EOF

HKU City Hunt Lightsail setup complete.

Components
  Node      $(node -v)
  PM2       $(pm2 -v)
  Apache    httpd (reverse proxy)

Directories
  ${APP_HOME}/inbox
  ${APP_HOME}/server   NestJS API  :${API_PORT}
  ${APP_HOME}/cms      Next.js CMS :${CMS_PORT}
  ${APP_HOME}/web      Next.js web :${WEB_PORT}

Domains
  Web  http://${WEB_DOMAIN}  -> 127.0.0.1:${WEB_PORT}
  CMS  http://${CMS_DOMAIN}  -> 127.0.0.1:${CMS_PORT}
  API  http://${CMS_DOMAIN}/v1/api/... -> 127.0.0.1:${API_PORT}/api/...

Next steps
  1. Open Lightsail networking: TCP 22, 80, 443 (do not expose 3306).
  2. Run ./setup/db_setup.sh (prompts for the DB password)
  3. Point DNS A records for ${WEB_DOMAIN} and ${CMS_DOMAIN} at this instance.
  4. Run ./setup/certbot_setup.sh
  5. Edit ${APP_HOME}/server/.env (TOKEN_SECRET, mail, Turnstile, etc.).
  6. From your laptop run:
       ./server/scripts/deploy_uat.sh
       ./cms/scripts/deploy_uat.sh
       ./web/scripts/deploy_uat.sh
  7. On the server: cd ~/server && yarn migration:run
  8. pm2 status

EOF
}

main() {
  require_root "$@"
  detect_amazon_linux
  install_base_packages
  install_node
  enable_services
  create_app_dirs
  install_apache_vhosts
  write_server_env_template
  setup_pm2_startup
  print_summary
}

main "$@"
