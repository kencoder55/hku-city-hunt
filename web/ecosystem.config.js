module.exports = {
  apps: [
    {
      name: "carelab-city-hunt-web",
      script: "./node_modules/next/dist/bin/next",
      args: "start",
      autorestart: true,
      max_memory_restart: "2G",
      instances: 1,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
