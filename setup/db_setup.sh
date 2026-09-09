#!/usr/bin/env bash
# Create the MariaDB database and app user for CareLab City Hunt.
# Run after lightsail_setup.sh. Prompts for the DB password on the console.
#
# Usage:
#   chmod +x db_setup.sh
#   ./setup/db_setup.sh
#
# Optional env vars:
#   DB_NAME   Default: hku_city_hunt_db
#   DB_USER   Default: cms

set -euo pipefail

APP_USER="${SUDO_USER:-${USER}}"
APP_HOME="$(getent passwd "$APP_USER" | cut -d: -f6)"
if [[ -z "$APP_HOME" || "$APP_HOME" == "/root" ]]; then
  APP_USER="ec2-user"
  APP_HOME="/home/ec2-user"
fi

DB_NAME="${DB_NAME:-hku_city_hunt_db}"
DB_USER="${DB_USER:-cms}"
PASSWORD_FILE="${APP_HOME}/.hku-city-hunt-db-password"
ENV_FILE="${APP_HOME}/server/.env"

log() {
  printf '\n==> %s\n' "$*"
}

require_root() {
  if [[ "$(id -u)" -ne 0 ]]; then
    echo "Re-running with sudo..."
    exec sudo --preserve-env=DB_NAME,DB_USER -u root "$0" "$@"
  fi
}

install_mariadb() {
  log "Installing and starting MariaDB"
  if ! dnf install -y mariadb105-server mariadb105; then
    dnf install -y mariadb-server mariadb
  fi
  systemctl enable --now mariadb
}

ask_password() {
  local confirm
  while true; do
    read -r -s -p "MariaDB password for user '${DB_USER}': " DB_PASSWORD </dev/tty
    echo
    if [[ -z "$DB_PASSWORD" ]]; then
      echo "Password cannot be empty."
      continue
    fi
    read -r -s -p "Confirm password: " confirm </dev/tty
    echo
    if [[ "$DB_PASSWORD" != "$confirm" ]]; then
      echo "Passwords do not match. Try again."
      continue
    fi
    break
  done
}

sql_escape() {
  printf '%s' "$1" | sed "s/'/''/g"
}

create_database() {
  local escaped
  escaped="$(sql_escape "$DB_PASSWORD")"

  log "Creating database ${DB_NAME} and user ${DB_USER}"
  mysql <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${escaped}';
ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${escaped}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SQL
}

write_password_file() {
  umask 077
  cat > "$PASSWORD_FILE" <<EOF
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
EOF
  chown "${APP_USER}:${APP_USER}" "$PASSWORD_FILE"
  chmod 600 "$PASSWORD_FILE"
  echo "Database credentials written to ${PASSWORD_FILE}"
}

update_server_env() {
  if [[ ! -f "$ENV_FILE" ]]; then
    echo "No ${ENV_FILE} yet. Copy DATABASE_* from ${PASSWORD_FILE} after lightsail_setup.sh."
    return
  fi

  DB_PASSWORD="$DB_PASSWORD" ENV_FILE="$ENV_FILE" DB_NAME="$DB_NAME" DB_USER="$DB_USER" python3 - <<'PY'
import os
from pathlib import Path

path = Path(os.environ["ENV_FILE"])
password = os.environ["DB_PASSWORD"]
db_name = os.environ["DB_NAME"]
db_user = os.environ["DB_USER"]
updates = {
    "DATABASE_HOST": "127.0.0.1",
    "DATABASE_PORT": "3306",
    "DATABASE_USERNAME": db_user,
    "DATABASE_PASSWORD": password,
    "DATABASE_NAME": db_name,
}
lines = path.read_text().splitlines()
seen = set()
out = []
for line in lines:
    key = line.split("=", 1)[0] if "=" in line else ""
    if key in updates:
        out.append(f"{key}={updates[key]}")
        seen.add(key)
    else:
        out.append(line)
for key, value in updates.items():
    if key not in seen:
        out.append(f"{key}={value}")
path.write_text("\n".join(out) + "\n")
PY
  chown "${APP_USER}:${APP_USER}" "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  echo "Updated ${ENV_FILE} database settings"
}

print_summary() {
  cat <<EOF

MariaDB setup complete.

  Database  ${DB_NAME}
  User      ${DB_USER}@localhost
  Host      127.0.0.1:3306

Password stored in ${PASSWORD_FILE}
Do not expose port 3306 in the Lightsail firewall.

Test login
  mysql -u ${DB_USER} -p ${DB_NAME}

EOF
}

main() {
  require_root "$@"
  install_mariadb
  ask_password
  create_database
  write_password_file
  update_server_env
  print_summary
}

main "$@"
