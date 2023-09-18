# nvm / nrm

1. [nvm 安装教程](https://juejin.cn/book/7034689774719860739/section/7036006539592728591)

[安装地址](https://github.com/coreybutler/nvm-windows)

Nvm 路径 D:/nvm
Node 路径 D:/Node

| 指令                      | 功能         |
| ------------------------- | ------------ |
| `nvm install <version>`   | 安装版本     |
| `nvm uninstall <version>` | 卸载版本     |
| `nvm use <version>`       | 切换版本     |
| `nvm ls`                  | 查看版本列表 |
| `nvm install latest`      | 安装最新版本 |

清除 `npm` 缓存方法： `npm cache clean -f`

2. `nrm` 是一个可随时随地自由切换 `Npm镜像` 的管理工具，安装方式为： `npm i -g nrm`

`nrm` 指令如下

| 指令                   | 功能         |
| ---------------------- | ------------ |
| `nrm add <name> <url>` | 新增镜像     |
| `nrm del <name>`       | 删除镜像     |
| `nrm test <name>`      | 测试镜像     |
| `nrm use <name>`       | 切换镜像     |
| `nrm current`          | 查看镜像     |
| `nrm ls`               | 查看镜像列表 |

3. `nodeJs` 常用模块镜像设置

```javascript
npm config set electron_mirror https://npm.taobao.org/mirrors/electron/
npm config set phantomjs_cdnurl https://npm.taobao.org/mirrors/phantomjs/
npm config set puppeteer_download_host https://npm.taobao.org/mirrors/
npm config set python_mirror https://npm.taobao.org/mirrors/python/
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
npm config set sentrycli_cdnurl https://npm.taobao.org/mirrors/sentry-cli/
npm config set sharp_binary_host https://npm.taobao.org/mirrors/sharp/
npm config set sharp_dist_base_url https://npm.taobao.org/mirrors/sharp-libvips/
npm config set sharp_libvips_binary_host https://npm.taobao.org/mirrors/sharp-libvips/
npm config set sqlite3_binary_site https://npm.taobao.org/mirrors/sqlite3/
```
