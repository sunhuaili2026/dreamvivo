# DreamVivo 腾讯云部署指南

## 方案一：腾讯云轻量应用服务器 (推荐)

### 1. 购买服务器
- 进入 [腾讯云轻量应用服务器](https://console.cloud.tencent.com/lighthouse)
- 选择 Node.js 镜像或 Ubuntu 系统
- 配置：2核4G 起步

### 2. 连接服务器
```bash
ssh ubuntu@your-server-ip
```

### 3. 安装环境
```bash
# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
npm install -g pm2

# 安装 MongoDB (或使用 MongoDB Atlas)
# 参考: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
```

### 4. 部署后端
```bash
cd /var/www
git clone https://github.com/yourusername/dreamvivo.git
cd dreamvivo/backend
npm install

# 配置环境变量
nano .env
# 填入: KIMI_API_KEY, MONGODB_URI 等

# 启动服务
pm2 start src/index.js --name dreamvivo-api
pm2 save
pm2 startup
```

### 5. 部署前端
```bash
cd /var/www/dreamvivo/frontend
npm install
npm run build

# 使用 Nginx 托管
sudo apt install nginx
sudo nano /etc/nginx/sites-available/dreamvivo
```

Nginx 配置:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/dreamvivo/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/dreamvivo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. 配置 HTTPS (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 方案二：腾讯云云函数 SCF (Serverless)

### 1. 安装 Serverless Framework
```bash
npm install -g serverless
```

### 2. 配置腾讯云凭证
```bash
serverless credentials set --secretId YOUR_SECRET_ID --secretKey YOUR_SECRET_KEY
```

### 3. 部署
```bash
cd backend
serverless deploy
```

---

## 方案三：腾讯云 CloudBase (云开发)

### 1. 安装 CloudBase CLI
```bash
npm install -g @cloudbase/cli
```

### 2. 登录
```bash
tcb login
```

### 3. 部署
```bash
tcb deploy
```

---

## 环境变量配置

在腾讯云控制台设置以下环境变量：

```
KIMI_API_KEY=your-kimi-api-key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dreamvivo
JWT_SECRET=your-jwt-secret
```

---

## 域名配置

1. 在腾讯云购买域名
2. 添加 DNS 解析到服务器 IP
3. 配置 SSL 证书

---

## 监控与日志

- 使用腾讯云云监控
- 配置告警策略
- 查看日志：/var/log/nginx/ 和 pm2 logs
