# PM2 配置

## 配置

```javascript
// pm2.config.js
module.exports = {
  apps : [{
    name: "nodejs-column", // 启动进程名
    script: "./app.js", // 启动文件
    instances: 2, // 启动进程数
    exec_mode: 'cluster', // 多进程多实例
    env_development: {
      NODE_ENV: "development",
      watch: true, // 开发环境使用 true，其他必须设置为 false
    },
    env_testing: {
      NODE_ENV: "testing",
      watch: false, // 开发环境使用 true，其他必须设置为 false
    },
    env_production: {
      NODE_ENV: "production",
      watch: false, // 开发环境使用 true，其他必须设置为 false
    },
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    error_file: '~/data/err.log', // 错误日志文件，必须设置在项目外的目录，这里为了测试
    out_file: '~/data/info.log', //  流水日志，包括 console.log 日志，必须设置在项目外的目录，这里为了测试
    max_restarts: 10,
  }]
}
```

## 启动脚本

```javascript
$ pm2 start pm2.config.js --env development
$ pm2 start pm2.config.js --env testing
$ pm2 start pm2.config.js --env production
```

## 输出信息

| 字段 | 功能 | 参数 | 描述 |
| --- | --- | --- | --- |
| **id** | 服务ID | ~ | 自动以递增方式生成 |
| **name** | 服务名称 | ~ | 通过 `--name` 设置 |
| **mode** | 进程模式 | `fork/cluster` | 单个进程或多个进程 |
| **↺** | 重启次数 | ~ | 自动记录 |
| **status** | 进程在线 | `online/stopped` | 在线或停止 |
| **cpu** | cpu占用率 | ~ | 自动记录 |
| **memory** | 内存占用大小 | ~ | 自动记录 |

## 命令

| 命令 | 功能 |
| --- | --- |
| `pm2 restart <name/id/all>` | 重启进程 |
| `pm2 reload <name/id/all>` | 重载进程 |
| `pm2 stop <name/id/all>` | 停止进程 |
| `pm2 delete <name/id/all>` | 杀死进程 |
| `pm2 show <name/id>` | 查看进程信息 |
| `pm2 ls` | 查看进程列表 |
| `pm2 monit` | 查看面板信息 |
| `pm2 logs` | 查看进程日志信息 |