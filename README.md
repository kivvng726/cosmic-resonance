# 寰宇回响 - 沉浸式星象互动占卜装置

> 当代码邂逅星空，传统文化焕发数字生命力。基于 LangGraph 多 Agent 系统的 AI 驱动占卜引擎，融合东西方占卜智慧。

## 🌟 项目简介

**寰宇回响**（Cosmic Resonance）是一个基于多模态交互的沉浸式星象互动占卜装置。项目采用前后端分离架构，前端提供 3D 星空交互体验，后端通过 **LangGraph 多 Agent 系统**实现智能占卜引擎，将西方占星学与中国传统命理学深度融合，为用户提供个性化的占卜解读。

### 🎯 核心创新

- **🤖 多 Agent 协作系统**：基于 LangGraph 构建的三个专业 Agent 协同工作
- **🌍 东西方智慧融合**：西方占星学 + 中国传统命理学（紫微斗数、八字、签文）
- **🧠 AI 驱动解读**：使用大语言模型生成温暖、个性化的占卜解读
- **🎨 沉浸式 3D 体验**：Three.js 构建的虚拟星空场景

---

## 🔮 多 Agent AI 占卜系统

本项目最核心的部分是 **AI 驱动的占卜引擎**，它采用 LangGraph 框架构建了一个多 Agent 协作系统，每个 Agent 都有明确的角色定位和专业能力。

### 系统架构

```
用户输入（出生日期 + 占卜问题）
    ↓
┌─────────────────────────────────────┐
│     LangGraph 工作流控制器          │
└─────────────────────────────────────┘
    ↓
┌──────────────┐    ┌──────────────┐
│ Agent 1:     │    │ Agent 2:     │
│ Astronomer  │    │ Sage         │
│ (天文学家)   │    │ (国学大师)    │
└──────────────┘    └──────────────┘
    ↓                    ↓
天文数据计算        传统文化计算
    ↓                    ↓
┌─────────────────────────────────────┐
│     Agent 3: Oracle (寰宇占卜师)     │
│     综合解读生成，融合东西方元素      │
└─────────────────────────────────────┘
    ↓
最终占卜解读（Markdown 格式）
```

### Agent 1: The Astronomer (天文学家) 🔭

**角色定位**：严谨的科学家，负责连接"宇宙"

**核心功能**：
- 📅 根据出生日期计算太阳星座、上升星座
- 🌙 计算当前月亮盈亏状态（Moon Phase）
- ⚡ 检测行星逆行状态（水星、金星、火星、木星、土星）
- 📊 生成 JSON 格式数据（供前端 3D 渲染使用）
- 📝 生成自然语言的星象描述

**输出示例**：
```json
{
  "retrograde": ["Mercury"],
  "moon_phase": "Waning Crescent",
  "sun_sign": "Leo",
  "rising_sign": "Scorpio",
  "visual_data": {
    "planets": [...],
    "aspects": [...]
  },
  "description": "当前水星逆行，月亮处于下弦月阶段..."
}
```

### Agent 2: The Sage (国学大师) 📜

**角色定位**：传统的智者，负责传承"文化遗产"

**核心功能**：
- 🎋 根据生辰计算八字属性（年柱、月柱、日柱、时柱）
- ⭐ 计算紫微主星（模拟紫微斗数）
- 🎴 抽取灵签（Fortune Stick），包含签文诗词和解签
- 🌿 提供五行建议和属性分析

**输出示例**：
```json
{
  "bazi": {
    "year": "甲子",
    "month": "乙丑",
    "day": "丙寅",
    "hour": "丁卯"
  },
  "ziwei_star": "紫微星",
  "fortune_stick": {
    "number": 42,
    "poem": "星河璀璨照前程，智慧如光破迷津",
    "interpretation": "此签主吉，预示...",
    "fortune_level": "上上签"
  },
  "five_elements_advice": "当前五行偏木，宜..."
}
```

### Agent 3: The Oracle (寰宇占卜师) 🔮

**角色定位**：极具同理心的沟通者，负责"人机连接"

**核心功能**：
- 🔗 读取 Astronomer 和 Sage 的输出数据
- 💭 结合用户的具体问题（事业/爱情/财运/健康等）
- 🧠 使用大语言模型（LLM）和思维链（CoT）技术
- ✨ 生成温暖、个性化、针对性的 Markdown 格式解读
- 🌉 自然融合东西方占卜元素

**解读示例**：
```markdown
# 您的专属占卜解读

虽然目前水星逆行（西方占星），但您的紫微星盘显示"红鸾星动"（东方传统），这意味着...

## 针对您的问题：事业发展

结合当前星象和传统文化分析，建议您...
```

### 工作流执行流程

1. **初始化**：接收用户输入（出生日期、占卜问题）
2. **Astronomer 执行**：计算天文数据，生成星象描述
3. **Sage 执行**：计算传统文化数据，生成八字、紫微、签文
4. **Oracle 执行**：综合前两个 Agent 的输出，使用 LLM 生成最终解读
5. **返回结果**：包含天文数据、文化数据和 AI 解读的完整结果

---

## 🚀 核心功能

### 🌌 3D 星空操控
- 基于 Three.js 的 3D 虚拟星空场景
- 支持鼠标拖拽旋转、滚轮缩放
- 可点击星座查看详情信息
- 北斗七星、猎户座等星座展示

### 🔮 AI 智能占卜（多 Agent 系统）
- **真实的后端 API**：不再使用模拟数据
- **多 Agent 协作**：三个专业 Agent 协同工作
- **东西方融合**：西方占星 + 中国传统命理
- **AI 生成解读**：使用大语言模型生成个性化解读
- **完整数据输出**：天文数据、文化数据、AI 解读

### 🎤 多模态交互
- 语音输入功能（需浏览器授权）
- 文字输入支持
- 手势操控模拟
- 音效和语音播报

### ✨ 沉浸式体验
- 动态星空背景粒子系统
- 流畅的页面切换动画
- 玻璃质感 UI 设计
- 响应式布局适配

---

## 🛠️ 技术栈

### 前端技术
- **HTML5**: 语义化结构
- **CSS3**: 现代样式、动画、渐变效果
- **JavaScript (ES6+)**: 模块化交互逻辑
- **Three.js**: 3D 星空场景渲染
- **GSAP**: 高性能动画库
- **Web APIs**: 语音识别、语音合成、全屏等

### 后端技术（多 Agent 系统）
- **Python 3.8+**: 后端开发语言
- **FastAPI**: 现代、快速的 Web 框架
- **LangGraph**: 多 Agent 工作流框架
- **LangChain**: LLM 应用开发框架
- **LangChain OpenAI**: 大语言模型集成（支持 OpenAI 兼容 API）
- **Pydantic**: 数据验证和设置管理
- **Uvicorn**: ASGI 服务器

### AI 模型
- **月之暗面 (Moonshot AI)**: 默认使用的大语言模型
- **支持 OpenAI 兼容 API**: 可切换其他 LLM 服务

---

## 📁 项目结构

```
cosmic-resonance/
├── frontend/                    # 前端代码
│   ├── index.html              # 主页面
│   ├── css/
│   │   └── style.css           # 主样式文件
│   ├── js/
│   │   ├── app.js              # 主应用逻辑
│   │   ├── starfield.js        # 3D星空场景
│   │   ├── voice.js            # 语音功能
│   │   └── divination.js       # 占卜引擎（前端）
│   ├── assets/                 # 资源文件目录
│   └── sounds/                 # 音效文件目录
│
├── backend/                     # 后端代码（多 Agent 系统）
│   ├── app/
│   │   ├── main.py             # FastAPI 主应用
│   │   ├── agents/             # Agent 实现
│   │   │   ├── astronomer.py   # Agent 1: 天文学家
│   │   │   ├── sage.py         # Agent 2: 国学大师
│   │   │   └── oracle.py       # Agent 3: 寰宇占卜师
│   │   ├── graph/              # LangGraph 工作流
│   │   │   ├── state.py        # GraphState 定义
│   │   │   └── workflow.py     # 工作流配置
│   │   ├── utils/              # 工具函数
│   │   │   ├── astronomy.py     # 天文计算
│   │   │   ├── chinese_calendar.py  # 中国传统历法
│   │   │   └── prompts.py      # Prompt 模板
│   │   └── models/             # 数据模型
│   │       └── schemas.py      # Pydantic 模型
│   ├── requirements.txt        # Python 依赖
│   ├── start_server.py        # 启动脚本
│   └── README.md              # 后端文档
│
├── README.md                   # 项目主文档（本文件）
└── DEPLOYMENT_GUIDE.md         # 部署指南
```

---

## 🚀 快速开始

### 前置要求

- **Python 3.8+**（用于后端）
- **现代浏览器**（Chrome 80+, Firefox 75+, Safari 13+, Edge 80+）
- **月之暗面 API Key**（或 OpenAI 兼容的 API Key，可选）

### 1. 克隆项目

```bash
git clone https://github.com/kivvng726/cosmic-resonance.git
cd cosmic-resonance
```

### 2. 启动后端服务

```bash
# 进入后端目录
cd backend

# 安装依赖
pip install -r requirements.txt

# 配置环境变量（可选）
cp env.example .env
# 编辑 .env 文件，设置你的 API Key

# 启动服务
python start_server.py
```

后端服务将在 `http://localhost:8000` 启动。

### 3. 启动前端服务

```bash
# 在项目根目录
python -m http.server 8080
```

前端页面将在 `http://localhost:8080` 打开。

### 4. 访问应用

打开浏览器，访问：`http://localhost:8080`

---

## 📖 使用说明

### 操作流程

1. **欢迎页面**: 了解项目功能，点击"开始体验"
2. **星空操控**: 拖拽旋转星空，点击星座，启动占星术
3. **信息输入**: 输入生日和占卜问题，支持语音输入
4. **占卜过程**: 观看多 Agent 系统分析过程动画
   - 连接 NASA 数据库（Astronomer Agent）
   - 查询紫金山天文台（Sage Agent）
   - AI 智能分析（Oracle Agent）
   - 生成专属内容
5. **结果展示**: 查看完整的占卜解读
   - AI 生成的个性化解读（Markdown 格式）
   - 天文数据（星座、月相、行星逆行等）
   - 传统文化数据（八字、紫微、签文等）
   - 支持语音播报

### API 文档

后端服务启动后，访问：
- **API 文档**: http://localhost:8000/docs
- **健康检查**: http://localhost:8000/api/health

### 快捷键

- **空格键**: 切换音效开关
- **ESC键**: 退出全屏模式
- **数字键1-3**: 快速导航到对应页面

---

## 🎯 项目亮点

### 技术创新

- **🤖 多 Agent 架构**：基于 LangGraph 的专业 Agent 协作系统
- **🧠 AI 驱动**：使用大语言模型生成个性化解读
- **🌉 文化融合**：东西方占卜智慧的深度结合
- **📊 数据驱动**：真实的天文和文化数据计算

### 用户体验

- **🎨 沉浸式 3D 体验**：Three.js 构建的虚拟星空
- **💬 多模态交互**：语音、文字、手势多种输入方式
- **✨ 流畅动画**：GSAP 驱动的丝滑动画效果
- **📱 响应式设计**：适配各种设备尺寸

---

## 🔧 配置说明

### 后端环境变量

在 `backend/.env` 文件中配置：

```env
# LLM API 配置
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.moonshot.cn/v1
OPENAI_MODEL=moonshot-v1-8k

# API 服务器配置
API_HOST=0.0.0.0
API_PORT=8000
```

**注意**：
- 如果没有配置 API Key，Oracle Agent 会使用模拟输出
- 支持任何 OpenAI 兼容的 API（如 OpenAI、月之暗面、Ollama 等）

### 前端 API 配置

在 `index.html` 中配置后端 API 地址：

```javascript
window.API_BASE_URL = 'http://localhost:8000';  // 开发环境
// 或
window.API_BASE_URL = 'https://your-backend-url.com';  // 生产环境
```

---

## 📚 详细文档

- **后端文档**: [backend/README.md](backend/README.md)
- **部署指南**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **快速部署**: [DEPLOYMENT_QUICK_START.md](DEPLOYMENT_QUICK_START.md)
- **测试指南**: [TEST_GUIDE.md](TEST_GUIDE.md)

---

## 🌐 浏览器兼容性

### 推荐浏览器
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### 功能支持
- **3D渲染**: 需要 WebGL 支持
- **语音功能**: 需要用户授权
- **全屏模式**: 现代浏览器支持
- **音效播放**: 需要用户交互激活

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

本项目采用 MIT 许可证。

---

## 🙏 致谢

- **Three.js**: 3D 图形渲染
- **LangGraph**: 多 Agent 工作流框架
- **FastAPI**: 现代 Web 框架
- **月之暗面**: 大语言模型支持

---

**寰宇回响** - 让星空与代码共舞，让传统与科技融合，让 AI 与智慧相遇。

🌟 **探索更多**: 访问 [GitHub 仓库](https://github.com/kivvng726/cosmic-resonance) 了解更多
