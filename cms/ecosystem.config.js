module.exports = {
  apps: [
    {
      name: "carelab-city-hunt-cms",
      script: "./node_modules/next/dist/bin/next",
      args: "start",
      autorestart: true,
      max_memory_restart: "1G",
      instances: 1,
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
