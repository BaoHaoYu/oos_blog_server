# koa2博客服务

## 安装

按顺序执行如下命令

```bash
git clone https://github.com/BaoHaoYu/oos_blog_server.git
cd oos_blog_server
yarn
```

## 配置config.ts

```ts
export default {
  // 端口
  port: '9000',
  // blog静态目录
  blogPublic: '/opt/www/hexo-blog/public',
  // 域名
  region: '',
  // 阿里云accessKeyId
  accessKeyId: '',
  // 阿里云accessKeySecret
  accessKeySecret: '',
}
```

region
![](http://bhyblog.oss-cn-shenzhen.aliyuncs.com/hexo/chrome_qtiqWEFZDi.png)

accessKeyId和accessKeySecret
![](http://bhyblog.oss-cn-shenzhen.aliyuncs.com/hexo/chrome_vOVtY39Be9.png)

blogPublic为`hexo generate`生成静态文件的位置

## 通过pm2运行项目

```bash
pm2 start pm2.json
```
