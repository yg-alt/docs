# nginx 配置

## 配置

```nginx

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
  worker_connections  1024;
}


http {
  include       mime.types;
  default_type  application/octet-stream;

  #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
  #                  '$status $body_bytes_sent "$http_referer" '
  #                  '"$http_user_agent" "$http_x_forwarded_for"';

  #access_log  logs/access.log  main;

  sendfile        on;
  #tcp_nopush     on;

  #keepalive_timeout  0;
  keepalive_timeout  65;

  #gzip  on;

  server {
    listen       80;
    server_name  localhost;

    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    location / {
      root   html;
      index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
      root   html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
  }

  server {
    listen 8080;
    server_name localhost;
    location / {
      proxy_pass http://www.day10.cn;
    }
    # html设置history模式
    location / {
      index index.html index.htm;
      proxy_set_header Host $host;
      # history模式最重要就是这里
      try_files $uri $uri/ /index.html;
      # index.html文件不可以设置强缓存 设置协商缓存即可
      add_header Cache-Control 'no-cache, must-revalidate, proxy-revalidate, max-age=0';
    }

    # 接口反向代理
    location ^~ /api/ {
      # 跨域处理 设置头部域名
      add_header Access-Control-Allow-Origin *;
      # 跨域处理 设置头部方法
      add_header Access-Control-Allow-Methods 'GET,POST,DELETE,OPTIONS,HEAD';
      # 改写路径
      rewrite ^/api/(.*)$ /$1 break;
      # 反向代理
      proxy_pass http://static_env;
      proxy_set_header Host $http_host;
    }

    #配置WebSocket服务
    location /api {
      proxy_pass http://127.0.0.1:8082/api;
      proxy_http_version 1.1;
      proxy_connect_timeout 86400s;
      proxy_read_timeout 86400s;
      proxy_send_timeout 86400s;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;
    }

  }


  # another virtual host using mix of IP-, name-, and port-based configuration
  #
  #server {
  #    listen       8000;
  #    listen       somename:8080;
  #    server_name  somename  alias  another.alias;

  #    location / {
  #        root   html;
  #        index  index.html index.htm;
  #    }
  #}


  # HTTPS server
  #
  #server {
  #    listen       443 ssl;
  #    server_name  localhost;

  #    ssl_certificate      cert.pem;
  #    ssl_certificate_key  cert.key;

  #    ssl_session_cache    shared:SSL:1m;
  #    ssl_session_timeout  5m;

  #    ssl_ciphers  HIGH:!aNULL:!MD5;
  #    ssl_prefer_server_ciphers  on;

  #    location / {
  #        root   html;
  #        index  index.html index.htm;
  #    }
  #}

}
```

## nginx 常见指令

| 指令            | 功能                                  |
| --------------- | ------------------------------------- |
| nginx -s reopen | 重启 Nginx                            |
| nginx -s reload | 重新加载配置文件，优雅重启 推荐使用   |
| nginx -s stop   | 强制停止                              |
| nginx -s quit   | 安全退出                              |
| nginx -t        | 检测配置文件地址 以及检测配置是否正常 |
| nginx -v        | 显示版本信息并退出                    |
| killall nginx   | 杀死所有 nginx 进程                   |
