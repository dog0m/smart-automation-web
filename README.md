# 🤖 Smart Automation Web

一个基于 Vue 3 + TypeScript 的网页数据采集工具，提供友好的 Web 界面来配置和执行网页数据抓取任务。

## ✨ 功能特性

- 🔗 **网页URL输入** - 支持输入任意网页URL
- ⚙️ **可视化选择器配置** - 通过界面添加/删除CSS选择器
- 📊 **实时结果展示** - 采集结果即时展示
- 🚀 **双引擎支持** - 自动选择 Cheerio（静态）或 Puppeteer（动态）
- 💾 **结果导出** - 支持复制JSON格式结果

## 🛠️ 技术栈

### 前端
- **Vue 3** + TypeScript
- **Vite** - 快速构建工具
- **Element Plus** - UI 组件库
- **Axios** - HTTP 客户端

### 后端
- **Node.js** + Express + TypeScript
- **Cheerio** - 静态网页解析
- **Puppeteer** - 动态网页渲染
- **Axios** - HTTP 请求

## 📦 安装和运行

### 前置要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 1. 克隆项目
```bash
git clone https://github.com/你的用户名/smart-automation-web.git
cd smart-automation-web
```

### 2. 安装后端依赖
```bash
cd backend
npm install
```

### 3. 安装前端依赖
```bash
cd ../frontend
npm install
```

### 4. 启动后端服务
```bash
cd backend
npm run dev
```
后端将在 `http://localhost:3000` 启动

### 5. 启动前端开发服务器
```bash
cd frontend
npm run dev
```
前端将在 `http://localhost:5173` 启动

## 🎯 使用方法

1. **输入URL** - 在首页输入要采集的网页URL
2. **点击预览** - 预览网页基本信息（标题、描述）
3. **配置规则** - 添加CSS选择器来指定要采集的数据
   - `key`: 数据名称（如：title, price, description）
   - `selector`: CSS选择器（如：h1, .price, #description）
4. **开始采集** - 点击"开始采集"按钮
5. **查看结果** - 采集结果将以结构化方式展示
6. **复制结果** - 点击"复制结果"按钮获取JSON数据

### CSS选择器示例

| 数据 | 选择器 |
|------|--------|
| 页面标题 | `title` |
| 元描述 | `meta[name="description"]` |
| 所有链接 | `a` |
| 第一个H1 | `h1` |
| 类名元素 | `.class-name` |
| ID元素 | `#element-id` |

## 📡 API 文档

### POST /api/scrape
采集指定URL的网页数据

**请求体:**
```json
{
  "url": "https://example.com",
  "selectors": {
    "title": "h1",
    "description": ".description"
  }
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "data": {
      "title": "Example Domain",
      "description": "示例描述"
    }
  },
  "timestamp": "2026-05-17T15:30:00.000Z"
}
```

### GET /api/scrape/preview?url=...
预览网页基本信息

## 📁 项目结构

```
smart-automation-web/
├── frontend/          # Vue 3 前端
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── types/
│   │   ├── App.vue
│   │   └── main.ts
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Node.js 后端
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🔧 开发说明

### 后端开发
```bash
cd backend
npm run dev  # 使用 ts-node-dev 热重载
```

### 前端开发
```bash
cd frontend
npm run dev  # Vite 热重载
```

### 生产构建
```bash
# 后端
cd backend
npm run build
npm start

# 前端
cd frontend
npm run build
```

## ⚠️ 注意事项

1. **遵守 robots.txt** - 请遵守目标网站的 robots.txt 规则
2. **请求频率** - 避免过于频繁的请求，尊重服务器资源
3. **法律风险** - 确保采集行为符合当地法律法规
4. **Puppeteer** - 首次使用 Puppeteer 会自动下载 Chromium，可能需要一些时间

## 项目声明
## 项目名称(Project Name): Smart Automation Web
## 项目作者(Author): 孟飞
## 作者单位(Affiliation): 暨南大学网络空间安全学院(College of Cyber Security，Jinan University)



