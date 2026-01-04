# 月之暗面 (Moonshot AI) API 配置说明

## ✅ 配置已完成

月之暗面 API 已成功配置到项目中。

### 配置信息

- **API Key**: `sk-8o2rqoIlnYDrWd0amiXacpT4Vs0XGSzOIg4ZBMzJ2IxsDXSU`
- **Base URL**: `https://api.moonshot.cn/v1`
- **模型**: `moonshot-v1-8k`

### 配置文件位置

- `.env` 文件（已创建，包含上述配置）
- `env.example` 文件（示例文件，已更新）

## 使用方法

1. **确保已安装依赖**：
```bash
cd backend
pip install -r requirements.txt
```

2. **启动服务**：
```bash
python start_server.py
```

3. **测试 API**：
服务启动后，访问 http://localhost:8000/docs 查看 API 文档

## 模型说明

当前配置使用的是 `moonshot-v1-8k` 模型，这是月之暗面提供的 8K 上下文长度的模型。

如果需要使用其他模型，可以修改 `.env` 文件中的 `OPENAI_MODEL` 参数：
- `moonshot-v1-8k` - 8K 上下文
- `moonshot-v1-32k` - 32K 上下文
- `moonshot-v1-128k` - 128K 上下文

## 验证配置

启动服务后，如果看到以下日志，说明配置成功：
```
🌌 启动寰宇回响 AI 占卜引擎后端服务...
📡 服务地址: http://0.0.0.0:8000
```

当调用占卜 API 时，Oracle Agent 会使用月之暗面的 API 生成解读。

## 故障排查

如果遇到 API 调用错误：

1. **检查 API Key 是否正确**：确认 `.env` 文件中的 `OPENAI_API_KEY` 值正确
2. **检查网络连接**：确保可以访问 `https://api.moonshot.cn`
3. **检查账户余额**：确认月之暗面账户有足够的余额
4. **查看日志**：启动服务时查看控制台输出的错误信息

如果 API 不可用，系统会自动回退到模拟输出模式，不会影响服务运行。

