# 后端连接问题排查

## 错误现象

```
connect ECONNREFUSED 120.26.144.61:8080
❌ API Error 500: Internal Server Error
```

## 问题分析

1. **连接被拒绝**：`ECONNREFUSED` 表示无法连接到后端服务器
2. **可能原因**：
   - 后端服务未启动
   - 端口8080未开放
   - 防火墙阻止连接
   - 服务器IP地址变更
   - 后端服务崩溃

## 后端排查步骤

### 1. 检查服务是否运行

```bash
# SSH登录到服务器
ssh user@120.26.144.61

# 检查端口8080是否在监听
netstat -tlnp | grep 8080
# 或
lsof -i :8080

# 检查进程
ps aux | grep python
ps aux | grep uvicorn
```

### 2. 检查服务日志

```bash
# 查看最近的错误日志
tail -f /path/to/your/app/logs/error.log

# 或者如果使用systemd
journalctl -u your-service-name -f

# 或者如果使用Docker
docker logs your-container-name
```

### 3. 尝试重启服务

```bash
# 如果使用systemd
sudo systemctl restart your-service-name
sudo systemctl status your-service-name

# 如果使用Docker
docker restart your-container-name

# 如果直接运行
# 先停止旧进程
pkill -f uvicorn
# 然后启动
cd /path/to/your/app
uvicorn main:app --host 0.0.0.0 --port 8080
```

### 4. 检查防火墙

```bash
# 检查防火墙状态
sudo ufw status

# 如果8080端口未开放，添加规则
sudo ufw allow 8080/tcp

# 或者使用iptables
sudo iptables -L -n | grep 8080
```

### 5. 测试本地连接

```bash
# 在服务器上测试
curl http://localhost:8080/papers?page=1&page_size=1

# 测试外部访问
curl http://120.26.144.61:8080/papers?page=1&page_size=1
```

### 6. 检查API配置

确认后端配置文件中的设置：

```python
# main.py 或 app.py
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",  # 必须是 0.0.0.0 才能外部访问
        port=8080,
        reload=True
    )
```

### 7. 检查CORS配置

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 开发环境可以用*，生产环境要指定域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 前端临时解决方案

在后端修复期间，前端可以使用Mock数据：

### 方法1：修改 .env 文件

```bash
# quantum-engine/.env
VITE_USE_MOCK_DATA=true
```

然后重启开发服务器：
```bash
npm run dev
```

### 方法2：直接修改代码（不推荐）

```typescript
// src/api/client.ts
export const useMock = true; // 强制使用Mock
```

## 后端快速启动指南

如果后端代码没问题，只是服务停止了：

```bash
# 1. 进入项目目录
cd /path/to/quantum-engine-backend

# 2. 激活虚拟环境（如果有）
source venv/bin/activate

# 3. 安装依赖（如果需要）
pip install -r requirements.txt

# 4. 启动服务
uvicorn main:app --host 0.0.0.0 --port 8080 --reload

# 或者使用后台运行
nohup uvicorn main:app --host 0.0.0.0 --port 8080 > app.log 2>&1 &
```

## 验证修复

修复后，测试以下端点：

```bash
# 1. 健康检查
curl http://120.26.144.61:8080/

# 2. 论文列表
curl -H "X-API-Key: xK7mP9nQ2wR5tY8uI1oL4aS6dF3gH0jK" \
  http://120.26.144.61:8080/papers?page=1&page_size=10

# 3. 领域列表
curl -H "X-API-Key: xK7mP9nQ2wR5tY8uI1oL4aS6dF3gH0jK" \
  http://120.26.144.61:8080/gold/domains?min_paper_count=0

# 4. 新版API测试（OR逻辑）
curl -H "X-API-Key: xK7mP9nQ2wR5tY8uI1oL4aS6dF3gH0jK" \
  "http://120.26.144.61:8080/papers?domain_ids=4,31,32&page_size=200"
```

## 常见问题

### Q1: 服务启动后立即崩溃
**A**: 检查日志，可能是：
- 数据库连接失败
- 端口被占用
- 依赖包版本冲突
- 配置文件错误

### Q2: 能本地访问但外部无法访问
**A**: 检查：
- host 是否设置为 `0.0.0.0`（不是 `127.0.0.1`）
- 防火墙是否开放端口
- 云服务器安全组是否开放端口

### Q3: API返回500错误
**A**: 查看后端日志，可能是：
- 数据库查询错误
- 代码逻辑错误
- 缺少必要的数据

### Q4: CORS错误
**A**: 确保后端配置了CORS中间件，允许前端域名访问

## 联系方式

如果以上方法都无法解决，请提供：
1. 后端服务日志（最近100行）
2. 服务器系统信息（`uname -a`）
3. Python版本（`python --version`）
4. 已安装的包（`pip list`）
5. 服务启动命令

## 紧急联系

- 后端负责人：[联系方式]
- 运维负责人：[联系方式]
