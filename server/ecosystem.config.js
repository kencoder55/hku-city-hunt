module.exports = {
  apps: [
    {
      name: 'carelab-city-hunt-server',
      script: './dist/main.js',
      autorestart: true,
      cron_restart: '0 19 * * *',
      max_memory_restart: '2G',
      instances: 1,
      exec_mode: 'cluster',
    },
  ],
};
