#!/usr/bin/env bash
# Issue Let's Encrypt certificates for CareLab City Hunt (Amazon Linux 2023 + Apache).
# Run after lightsail_setup.sh, with DNS A records already pointing at this instance.
#
# Usage:
#   chmod +x certbot_setup.sh
#   ./setup/certbot_setup.sh
#   CERTBOT_EMAIL=you@mosaicdigi.com ./setup/certbot_setup.sh
#
# Optional env vars:
#   WEB_DOMAIN      Default: carelab-city-hunt.mosaicdigi.com
#   CMS_DOMAIN      Default: carelab-city-hunt-cms.mosaicdigi.com
#   CERTBOT_EMAIL   Let's Encrypt account email

# stop if any command fails
set -euo pipefail

WEB_DOMAIN=carelab-city-hunt.mosaicdigi.com
CMS_DOMAIN=carelab-city-hunt-cms.mosaicdigi.com
CERTBOT_EMAIL=ken.l@mosaicdigi.com

log() {
  printf '\n==> %s\n' "$*"
}

require_root() {
  if [[ "$(id -u)" -ne 0 ]]; then
    echo "Re-running with sudo..."
    exec sudo --preserve-env=WEB_DOMAIN,CMS_DOMAIN,CERTBOT_EMAIL -u root "$0" "$@"
  fi
}

install_certbot() {
  log "Installing Certbot"
  dnf install -y certbot
  dnf install -y python3-certbot-apache || true
}

issue_certificates() {
  log "Issuing Let's Encrypt certificates"
  echo "DNS A records for ${WEB_DOMAIN} and ${CMS_DOMAIN} must point at this instance."
  echo "Apache vhosts must already exist (run lightsail_setup.sh first)."

  certbot --apache \
    --non-interactive \
    --agree-tos \
    --redirect \
    -m "$CERTBOT_EMAIL" \
    -d "$WEB_DOMAIN" \
    -d "$CMS_DOMAIN"
}

print_summary() {
  cat <<EOF

Let's Encrypt setup complete.

  Web  https://${WEB_DOMAIN}
  CMS  https://${CMS_DOMAIN}

Certbot enabled HTTPS and HTTP-to-HTTPS redirects on the Apache vhosts.

Useful commands
  sudo certbot certificates
  sudo systemctl status certbot-renew.timer
  sudo certbot renew --dry-run

EOF
}

main() {
  require_root "$@"
  install_certbot
  issue_certificates
  print_summary
}

main "$@"
