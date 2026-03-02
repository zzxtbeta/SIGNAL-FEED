# 🚨 后端连接问题 - 快速解决

## 问题
```
connect ECONNREFUSED 120.26.144.61:8080
```
后端服务器无法连接。

---

## ✅ 前端快速解决（1分钟）

### 步骤1：修改配置文件
打开 `quantum-engine/.env`，修改最后一行：

```bash
# 改成 true
VITE_USE_MOCK_DATA=true
```

### 步骤2：重启开发服务器
```bash
# 按 Ctrl+C 停止当前服务器
# 然后重新启动
npm run dev
```

### 步骤3：刷新浏览器
现在前端会使用Mock数据，可以正常开发和测试UI。

---

## 🔧 后端需要做什么

### 检查1：服务是否运行？
```bash
# SSH登录服务器
ssh user@120.26.144.61

# 检查8080端口
netstat -tlnp | grep 8080
```

### 检查2：如果服务没运行，启动它
```bash
cd /path/to/backend
uvicorn main:app --host 0.0.0.0 --port 8080
```

**重要**：必须是 `--host 0.0.0.0`，不能是 `127.0.0.1`

### 检查3：防火墙是否开放8080端口？
```bash
sudo ufw allow 8080/tcp
```

### 检查4：测试API是否正常
```bash
curl http://120.26.144.61:8080/papers?page=1&page_size=1
```

---

## 📋 详细排查文档

查看 `BACKEND_CONNECTION_ISSUE.md` 获取完整的排查步骤。

---

## ⏰ 后端修复后

### 前端恢复真实API
1. 修改 `.env` 文件：
   ```bash
   VITE_USE_MOCK_DATA=false
   ```

2. 重启开发服务器：
   ```bash
   npm run dev
   ```

3. 刷新浏览器，应该能看到真实数据

---

## 🎯 验证修复成功

在浏览器控制台应该看到：
```
✅ 📚 Papers fetched: {domainIds: [4, 31, 32], returned: 200, total: 210}
```

而不是：
```
❌ API Error 500: Internal Server Error
```
