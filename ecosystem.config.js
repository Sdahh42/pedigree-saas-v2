/**
 * Configuration PM2 pour le déploiement en production
 * Utilisé pour gérer le processus Node.js sur le VPS
 */

module.exports = {
  apps: [
    {
      name: 'pedigree-app',
      script: 'npm',
      args: 'start',
      cwd: '/home/pedigree/app',
      
      // Clustering pour utiliser plusieurs CPU
      instances: 2,
      exec_mode: 'cluster',
      
      // Variables d'environnement
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      
      // Logs
      error_file: '/home/pedigree/logs/pm2-error.log',
      out_file: '/home/pedigree/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Restart policy
      max_memory_restart: '1G',
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Watch (désactivé en production)
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.next'],
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};
