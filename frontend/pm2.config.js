module.exports = {
  apps: [
    {
      name: 'nextjs',
      script: 'npm',
      args: 'run prod',
      max_memory_restart: '256M',
      env_production: {
        NODE_ENV: 'production'
      },
      time: true
    }
  ]
}
