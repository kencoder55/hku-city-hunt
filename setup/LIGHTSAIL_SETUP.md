# AWS Lightsail setup (Amazon Linux 2023)

UAT for HKU City Hunt: NestJS API (`server`), Next.js CMS (`cms`), Next.js public site (`web`).

## Stack


| Component               | Role                        |
| ----------------------- | --------------------------- |
| AWS Lightsail           | Host (Amazon Linux 2023)    |
| Node.js 22              | Runtime for API and Next.js |
| PM2                     | Process manager             |
| Apache (`httpd`)        | Reverse proxy + TLS         |
| MariaDB                 | Database                    |
| Let's Encrypt (Certbot) | HTTPS certificates          |


## Recommended instance

- OS: Amazon Linux 2023
- Size: 2 GB RAM / 1 vCPU minimum (4 GB preferred for all three Node apps)
- SSH user: `ec2-user`

Open these ports in the Lightsail networking firewall:


| Port | Reason                    |
| ---- | ------------------------- |
| 22   | SSH                       |
| 80   | HTTP (Certbot + redirect) |
| 443  | HTTPS                     |


Do not expose 3306 or the Node ports (3000 / 3001 / 9711). Apache proxies to them on localhost.

## Architecture

```
https://carelab-city-hunt.mosaicdigi.com              Apache  ->  127.0.0.1:3000   web (PM2)
https://carelab-city-hunt-cms.mosaicdigi.com          Apache  ->  127.0.0.1:3001   cms (PM2)
https://carelab-city-hunt-cms.mosaicdigi.com/v1/...   Apache  ->  127.0.0.1:9711   server (PM2)
MariaDB                                              127.0.0.1:3306
```

Client API paths:

- Web: `https://carelab-city-hunt-cms.mosaicdigi.com/v1/api/web`
- CMS: `https://carelab-city-hunt-cms.mosaicdigi.com/v1/api/admin`

NestJS uses global prefix `api`. Apache strips `/v1` and forwards `/api/...` to the API process.

UAT hostnames:

- Web: `carelab-city-hunt.mosaicdigi.com`
- CMS + API: `carelab-city-hunt-cms.mosaicdigi.com`

Create DNS A records for both names pointing at the Lightsail static IP before running Certbot.

SSH helper scripts currently target `carelab.mosaicdigi.com`. Override with `UAT_HOST` when deploying to a different instance.

## 1. Create the instance

1. Lightsail console: create instance, Amazon Linux 2023, attach a static IP.
2. Download the SSH key (or reuse an existing key).
3. Confirm login:

```
ssh ec2-user@<STATIC_IP>
```



## 2. Run the initial setup script

From your laptop (repo root):

```
scp -r setup ec2-user@carelab.mosaicdigi.com:~/
ssh ec2-user@carelab.mosaicdigi.com
```

On the instance:

```
chmod +x ~/setup/lightsail_setup.sh ~/setup/db_setup.sh ~/setup/certbot_setup.sh

./setup/lightsail_setup.sh
```

The script installs Node, yarn, PM2, and Apache; creates `~/inbox`, `~/server`, `~/cms`, `~/web`; writes Apache vhosts; and writes a `~/server/.env` template.

Database and TLS are separate steps (`./setup/db_setup.sh`, `./setup/certbot_setup.sh`).

## 3. Apache vhosts

Templates live in `setup/httpd/`. The setup script copies them to `/etc/httpd/conf.d/`.

- `carelab-city-hunt-web.conf` — `carelab-city-hunt.mosaicdigi.com` to port 3000
- `carelab-city-hunt-cms.conf` — `carelab-city-hunt-cms.mosaicdigi.com` to port 3001, `/v1/` to port 9711

After editing:

```
sudo apachectl configtest
sudo systemctl reload httpd
```

SELinux must allow Apache to talk to Node (the setup script sets this):

```
sudo setsebool -P httpd_can_network_connect 1
```



## 4. Database

After `lightsail_setup.sh`:

```
./setup/db_setup.sh
```

The script installs MariaDB, then asks for the `cms` user password in the console (typed twice, hidden). It creates database `hku_city_hunt_db`, user `cms`@`localhost`, writes `~/.hku-city-hunt-db-password`, and fills `DATABASE_*` in `~/server/.env`.

Do not expose port 3306 in the Lightsail firewall.

Test login:

```
mysql -u cms -p hku_city_hunt_db
```

## 5. Let's Encrypt

After `lightsail_setup.sh` and after DNS A records resolve:

```
CERTBOT_EMAIL=ken.l@mosaicdigi.com ./setup/certbot_setup.sh
```

The script installs Certbot and runs:

```
sudo certbot --apache -d carelab-city-hunt.mosaicdigi.com -d carelab-city-hunt-cms.mosaicdigi.com
```

Certbot enables HTTPS and HTTP-to-HTTPS redirects. Renewals are handled by the certbot timer:

```
sudo certbot certificates
sudo systemctl status certbot-renew.timer
sudo certbot renew --dry-run
```



## 6. Application env files



### API (`~/server/.env` on the instance)

The setup scripts write a template. `db_setup.sh` fills `DATABASE_PASSWORD`. Fill in the remaining secrets before the first API start. Local reference: `server/env.example.md`.

UAT values that differ from laptop Docker:

```
BASE_URL=https://carelab-city-hunt-cms.mosaicdigi.com/v1
PORT=9711
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USERNAME=cms
DATABASE_PASSWORD=<from ~/.hku-city-hunt-db-password>
DATABASE_NAME=hku_city_hunt_db
FRONTEND_URL=https://carelab-city-hunt.mosaicdigi.com
WEB_URL=https://carelab-city-hunt.mosaicdigi.com
TZ=Asia/Hong_Kong
```

Do not commit production/UAT secrets. Deploy scripts do not overwrite `server/.env`.

### Web and CMS (laptop)

Update `web/.env.uat` and `cms/.env.uat` so `NEXT_PUBLIC_API_SERVER` matches the Lightsail CMS host:

```
NEXT_PUBLIC_API_SERVER=https://carelab-city-hunt-cms.mosaicdigi.com/v1/api/web
NEXT_PUBLIC_API_SERVER=https://carelab-city-hunt-cms.mosaicdigi.com/v1/api/admin
```

`NEXT_PUBLIC_*` is baked in at build time (`yarn build:uat`). Runtime on the server copies `.env.uat` to `.env.production` because `NODE_ENV=production`.

## 7. Deploy UAT

SSH key must already be loaded (`ssh-add`) or configured in `~/.ssh/config`. Override host if needed:

```
export UAT_HOST=<STATIC_IP>
```

From each app folder (or via the script path):

```
./server/scripts/deploy_uat.sh
./cms/scripts/deploy_uat.sh
./web/scripts/deploy_uat.sh
```

Each script builds locally, zips the artifact, uploads to `~/inbox`, unpacks into `~/server`, `~/cms`, or `~/web`, runs `yarn install`, then `pm2 startOrReload`.

CMS has no `yarn.lock` yet. Run `yarn` once in `cms/` on your laptop so the server install is reproducible.

## 8. First boot on the server

```
ssh ec2-user@$UAT_HOST

# API migrations
cd ~/server
yarn migration:run

pm2 status
pm2 logs
pm2 save
```

PM2 process names:


| App | Name                             | Port |
| --- | -------------------------------- | ---- |
| API | `carelab-city-hunt-server` | 9711 |
| Web | `carelab-city-hunt-web`    | 3000 |
| CMS | `carelab-city-hunt-cms`    | 3001 |




## 9. Useful commands

```
pm2 status
pm2 restart all
pm2 logs --lines 200
sudo systemctl status httpd
sudo systemctl status mariadb
sudo tail -f /var/log/httpd/carelab-city-hunt-web-error_log
sudo tail -f /var/log/httpd/carelab-city-hunt-cms-error_log
mysql -u cms -p hku_city_hunt_db
```

SSH shortcuts (same host as `UAT_HOST`):

```
./server/scripts/ssh_uat.sh
./cms/scripts/ssh_uat.sh
./web/scripts/ssh_uat.sh
```



## 10. Checklist


| Step                                       | Done |
| ------------------------------------------ | ---- |
| Lightsail Amazon Linux 2023 + static IP    |      |
| Firewall 22 / 80 / 443                     |      |
| `lightsail_setup.sh`                       |      |
| `db_setup.sh`                              |      |
| DNS A records for web and CMS              |      |
| `certbot_setup.sh`                         |      |
| `~/server/.env` secrets filled             |      |
| `web/.env.uat` and `cms/.env.uat` API URLs |      |
| `deploy_uat.sh` for server, cms, web       |      |
| `yarn migration:run` on server             |      |
| `pm2 save`                                 |      |




## Troubleshooting

**502 Bad Gateway**

- App not running: `pm2 status`
- Wrong port in vhost vs ecosystem config
- SELinux: `getsebool httpd_can_network_connect` should be `on`

**MariaDB login fails**

- Re-run `./setup/db_setup.sh` and enter the password twice.
- Confirm the service: `sudo systemctl status mariadb`

**Certbot failure**

- DNS not pointing at this IP yet
- Port 80 blocked in Lightsail networking
- Retry: `sudo ./setup/certbot_setup.sh`

`bcrypt` **install fails on API**

- Build tools missing. The setup script installs `gcc-c++` and `make`. Re-run `yarn install` in `~/server`.

**CMS/web serve stale API host**

- `NEXT_PUBLIC_API_SERVER` is compile-time. Change `.env.uat` and re-run `deploy_uat.sh`.

