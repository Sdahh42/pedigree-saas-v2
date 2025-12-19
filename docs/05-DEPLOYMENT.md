# 🚀 Guide de Déploiement - PedigreeApp SaaS v2

## Vue d'ensemble

Ce guide détaille le déploiement de PedigreeApp sur un VPS Hostinger KVM4.

## Prérequis VPS

### Spécifications minimales (KVM4)
- **CPU**: 4 vCPU
- **RAM**: 8 GB
- **Stockage**: 100 GB NVMe SSD
- **OS**: Ubuntu 22.04 LTS
- **Bande passante**: Illimitée

### Accès requis
- Accès SSH root
- Nom de domaine configuré (ex: app.pedigreeapp.com)
- Accès au panel DNS

---

## Étape 1: Configuration initiale du serveur

### 1.1 Connexion et mise à jour

```bash
# Connexion SSH
ssh root@votre-ip-vps

# Mise à jour système
apt update && apt upgrade -y

# Installation des outils de base
apt install -y curl wget git unzip htop
```

### 1.2 Créer un utilisateur non-root

```bash
# Créer l'utilisateur
adduser pedigree

# Ajouter aux sudoers
usermod -aG sudo pedigree

# Configurer SSH pour l'utilisateur
mkdir -p /home/pedigree/.ssh
cp ~/.ssh/authorized_keys /home/pedigree/.ssh/
chown -R pedigree:pedigree /home/pedigree/.ssh
chmod 700 /home/pedigree/.ssh
chmod 600 /home/pedigree/.ssh/authorized_keys

# Se connecter en tant que pedigree
su - pedigree
```

### 1.3 Sécurisation SSH

```bash
sudo nano /etc/ssh/sshd_config
```

Modifier:
```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

```bash
sudo systemctl restart sshd
```

### 1.4 Firewall (UFW)

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

---

## Étape 2: Installation des dépendances

### 2.1 Node.js 20 LTS

```bash
# Installation via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Vérification
node --version  # v20.x.x
npm --version   # 10.x.x
```

### 2.2 PostgreSQL 16

```bash
# Ajouter le repo PostgreSQL
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update

# Installation
sudo apt install -y postgresql-16 postgresql-contrib-16

# Démarrage
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Vérification
sudo -u postgres psql -c "SELECT version();"
```

### 2.3 Redis 7

```bash
# Installation
sudo apt install -y redis-server

# Configuration
sudo nano /etc/redis/redis.conf
# Modifier: supervised systemd
# Modifier: maxmemory 256mb
# Modifier: maxmemory-policy allkeys-lru

# Démarrage
sudo systemctl restart redis
sudo systemctl enable redis

# Vérification
redis-cli ping  # PONG
```

### 2.4 Nginx

```bash
sudo apt install -y nginx

sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2.5 PM2 (Process Manager)

```bash
sudo npm install -g pm2

# Auto-start au boot
pm2 startup systemd -u pedigree --hp /home/pedigree
```

### 2.6 Certbot (SSL)

```bash
sudo apt install -y certbot python3-certbot-nginx
```

---

## Étape 3: Configuration de la base de données

### 3.1 Créer la base et l'utilisateur

```bash
sudo -u postgres psql
```

```sql
-- Créer l'utilisateur
CREATE USER pedigree_user WITH PASSWORD 'VotreMotDePasseSecurise123!';

-- Créer la base
CREATE DATABASE pedigree_db OWNER pedigree_user;

-- Permissions
GRANT ALL PRIVILEGES ON DATABASE pedigree_db TO pedigree_user;

-- Extensions
\c pedigree_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\q
```

### 3.2 Configurer l'accès local

```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

Ajouter:
```
local   pedigree_db     pedigree_user                   scram-sha-256
```

```bash
sudo systemctl restart postgresql
```

---

## Étape 4: Déploiement de l'application

### 4.1 Cloner le projet

```bash
cd /home/pedigree
git clone https://github.com/votre-repo/pedigree-saas-v2.git app
cd app
```

### 4.2 Configuration environnement

```bash
cp .env.example .env
nano .env
```

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://app.pedigreeapp.com

# Database
DATABASE_URL="postgresql://pedigree_user:VotreMotDePasseSecurise123!@localhost:5432/pedigree_db?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_URL=https://app.pedigreeapp.com
NEXTAUTH_SECRET=votre-secret-nextauth-genere-avec-openssl

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Stripe Price IDs
STRIPE_PRICE_PRO_MONTHLY=price_xxx
STRIPE_PRICE_PRO_YEARLY=price_xxx
STRIPE_PRICE_ELITE_MONTHLY=price_xxx
STRIPE_PRICE_ELITE_YEARLY=price_xxx

# Email (Resend)
RESEND_API_KEY=re_xxx
EMAIL_FROM=noreply@pedigreeapp.com

# Upload
UPLOADTHING_SECRET=sk_live_xxx
UPLOADTHING_APP_ID=xxx

# Sentry (optionnel)
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 4.3 Installation et build

```bash
# Installation des dépendances
npm ci --production=false

# Génération Prisma
npx prisma generate

# Migrations
npx prisma migrate deploy

# Build production
npm run build
```

### 4.4 Configuration PM2

Créer `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'pedigree-app',
      script: 'npm',
      args: 'start',
      cwd: '/home/pedigree/app',
      instances: 2, // Utiliser 2 instances pour le load balancing
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Logs
      error_file: '/home/pedigree/logs/pm2-error.log',
      out_file: '/home/pedigree/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Restart policy
      max_memory_restart: '1G',
      restart_delay: 5000,
      max_restarts: 10,
      // Monitoring
      monitoring: true
    }
  ]
};
```

```bash
# Créer le dossier logs
mkdir -p /home/pedigree/logs

# Démarrer l'application
pm2 start ecosystem.config.js

# Sauvegarder la config PM2
pm2 save
```

---

## Étape 5: Configuration Nginx

### 5.1 Configuration du site

```bash
sudo nano /etc/nginx/sites-available/pedigree
```

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;

# Upstream
upstream pedigree_app {
    server 127.0.0.1:3000;
    keepalive 64;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name app.pedigreeapp.com;
    return 301 https://$server_name$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.pedigreeapp.com;

    # SSL (sera configuré par Certbot)
    ssl_certificate /etc/letsencrypt/live/app.pedigreeapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.pedigreeapp.com/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # Client body size (pour uploads)
    client_max_body_size 10M;

    # Rate limiting pour l'API auth
    location /api/auth {
        limit_req zone=auth burst=5 nodelay;
        proxy_pass http://pedigree_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Rate limiting pour l'API générale
    location /api {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://pedigree_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files avec cache long
    location /_next/static {
        proxy_pass http://pedigree_app;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Images avec cache
    location /images {
        proxy_pass http://pedigree_app;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        add_header Cache-Control "public, max-age=86400";
    }

    # Toutes les autres requêtes
    location / {
        proxy_pass http://pedigree_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5.2 Activer le site

```bash
sudo ln -s /etc/nginx/sites-available/pedigree /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test de la configuration
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

### 5.3 Certificat SSL

```bash
# Obtenir le certificat (avant d'activer HTTPS dans nginx)
sudo certbot --nginx -d app.pedigreeapp.com

# Renouvellement automatique
sudo certbot renew --dry-run
```

---

## Étape 6: Backups automatisés

### 6.1 Script de backup

```bash
nano /home/pedigree/scripts/backup.sh
```

```bash
#!/bin/bash
# ===========================================
# Script de backup PedigreeApp
# ===========================================

set -e

# Configuration
BACKUP_DIR="/home/pedigree/backups"
DB_NAME="pedigree_db"
DB_USER="pedigree_user"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Créer le dossier si nécessaire
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
echo "Backup de la base de données..."
PGPASSWORD="VotreMotDePasseSecurise123!" pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Backup des uploads (si stockés localement)
if [ -d "/home/pedigree/app/uploads" ]; then
    echo "Backup des uploads..."
    tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" -C /home/pedigree/app uploads
fi

# Supprimer les vieux backups
echo "Nettoyage des anciens backups..."
find $BACKUP_DIR -type f -mtime +$RETENTION_DAYS -delete

# Optionnel: Sync vers S3/Backblaze B2
# rclone sync $BACKUP_DIR remote:pedigree-backups

echo "Backup terminé: $DATE"
```

```bash
chmod +x /home/pedigree/scripts/backup.sh
```

### 6.2 Cron job

```bash
crontab -e
```

Ajouter:
```cron
# Backup quotidien à 3h du matin
0 3 * * * /home/pedigree/scripts/backup.sh >> /home/pedigree/logs/backup.log 2>&1
```

---

## Étape 7: Monitoring

### 7.1 PM2 Monitoring

```bash
# Voir le statut
pm2 status

# Logs en temps réel
pm2 logs

# Monitoring
pm2 monit
```

### 7.2 Script de health check

```bash
nano /home/pedigree/scripts/healthcheck.sh
```

```bash
#!/bin/bash
# Health check script

URL="https://app.pedigreeapp.com/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $RESPONSE -ne 200 ]; then
    echo "ALERT: Health check failed with status $RESPONSE"
    # Envoyer une alerte (email, Slack, etc.)
    # curl -X POST -H 'Content-type: application/json' --data '{"text":"PedigreeApp is down!"}' YOUR_SLACK_WEBHOOK
fi
```

```bash
chmod +x /home/pedigree/scripts/healthcheck.sh
```

Cron (toutes les 5 minutes):
```cron
*/5 * * * * /home/pedigree/scripts/healthcheck.sh >> /home/pedigree/logs/healthcheck.log 2>&1
```

---

## Étape 8: Mise à jour de l'application

### 8.1 Script de déploiement

```bash
nano /home/pedigree/scripts/deploy.sh
```

```bash
#!/bin/bash
# ===========================================
# Script de déploiement PedigreeApp
# ===========================================

set -e

APP_DIR="/home/pedigree/app"
cd $APP_DIR

echo "=== Déploiement PedigreeApp ==="

# 1. Pull des changements
echo "1. Pull des changements..."
git pull origin main

# 2. Installation des dépendances
echo "2. Installation des dépendances..."
npm ci --production=false

# 3. Migrations Prisma
echo "3. Migrations base de données..."
npx prisma migrate deploy

# 4. Build
echo "4. Build de l'application..."
npm run build

# 5. Restart PM2
echo "5. Redémarrage de l'application..."
pm2 reload pedigree-app

echo "=== Déploiement terminé ==="
```

```bash
chmod +x /home/pedigree/scripts/deploy.sh
```

---

## Checklist de déploiement

### Avant le déploiement
- [ ] Domaine configuré et DNS propagé
- [ ] Variables d'environnement prêtes
- [ ] Compte Stripe configuré avec webhooks
- [ ] Compte Resend configuré

### Après le déploiement
- [ ] SSL fonctionnel (https)
- [ ] Application accessible
- [ ] Inscription/Connexion fonctionnelle
- [ ] Paiement Stripe fonctionnel
- [ ] Emails envoyés correctement
- [ ] Backups configurés
- [ ] Monitoring actif

---

## Commandes utiles

```bash
# Logs application
pm2 logs pedigree-app

# Redémarrer l'application
pm2 restart pedigree-app

# Voir les connexions PostgreSQL
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity WHERE datname='pedigree_db';"

# Voir l'utilisation Redis
redis-cli INFO memory

# Tester la config Nginx
sudo nginx -t

# Renouveler SSL manuellement
sudo certbot renew

# Voir l'espace disque
df -h

# Voir l'utilisation mémoire
free -h
```
