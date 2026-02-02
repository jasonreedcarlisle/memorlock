module.exports = {
  apps: [
    {
      name: 'memorlock-production',
      script: './index.js',
      cwd: '/home/ubuntu/memaday-production',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/home/ubuntu/logs/memorlock-production-error.log',
      out_file: '/home/ubuntu/logs/memorlock-production-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M'
    },
    {
      name: 'memorlock-staging',
      script: './index.js',
      cwd: '/home/ubuntu/memaday-staging',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'staging',
        PORT: 3002
      },
      error_file: '/home/ubuntu/logs/memorlock-staging-error.log',
      out_file: '/home/ubuntu/logs/memorlock-staging-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M'
    }
  ]
};

