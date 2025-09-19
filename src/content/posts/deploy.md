---
title: 部署catg记录
date: 2025-09-19T03:19:33.366Z
tags: []
comments: true
draft: false
---

# 部署catg项目

首先是开发好该项目，前端继续使用原先的blog项目，部署在vercel服务器上。
其中大部分代码可以交给AI来实现，实现效果基本不错，没使用websocket，直接使用http请求来实现。其中遇到的问题是首次对话时由于未携带session_id导致消息列表直接被刷新的问题，解决过程中才发现是前后端参数的对应问题，由于对应的参数不同导致获取到的消息列表为空，于是页面上的消息就消失了，解决方案直接修改正确即可。
后端则是使用python的flask框架，部署在阿里云的服务器上。
遇到的问题是CORS源，解决方案是在项目中导入flask_cors，然后在app.py中添加如下代码：

```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app) # 这种方式默认接收所有源
```

此外由于vercel服务器的使用的是https协议，https协议认为http协议是不安全的，所以会报错，解决方案是在服务器上生成自前面证书，命令执行后一直回车即可。

```bash
# 生成私钥和证书（会生成 server.key 和 server.crt 两个文件）
openssl req -x509 -newkey rsa:4096 -nodes -out server.crt -keyout server.key -days 365
```

接着在py代码中添加

```python
if __name__ == '__main__':
    # 启用 HTTPS，指定证书和私钥路径
    app.run(
        host='0.0.0.0',
        port=5000,
        ssl_context=('server.crt', 'server.key')  # 对应生成的证书文件
    )
```

然而这种方式由于是自签名证书，https依然不认，只能由用户先访问后端的base url，然后浏览器会提示用户是否信任该证书，用户信任后即可正常访问。
😭😭😭
当前的主要部署方式是采用后台运行，毕竟只是后端内容，所以采用nohup命令来实现后台运行，命令如下：

```bash
nohup python3 app.py > flask.log 2>&1 &
```

实际过程中可以指定端口和ip地址，命令如下：

```bash
nohup python3 app.py -p 5000 -h 0.0.0.0 > flask.log 2>&1 &
```

虽然在代码中已经确定了端口可开放，并且阿里云服务器也对外暴露了，但服务器还有防火墙，需要防火墙开启该端口，由于服务器是ubuntu，使用ufw管理防火墙
查看5000端口 是否开启

```bash
ufw status | grep 5000
```

如果没有开启，需要开启该端口

```bash
ufw allow 5000
```

最后一个方案是在vercel服务器上运行项目，但估计不会有python环境，可能代码需要转js
