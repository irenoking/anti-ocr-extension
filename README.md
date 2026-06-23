# 🧪 Anti-OCR Studio

> 浏览器级图像对抗处理工具 - 右键图片即可进入像素级防御管道

**Anti-OCR Studio** 是一个纯前端的图像对抗处理工作台，以 Chrome 扩展形式运行。通过可视化的算法流叠加系统，让你轻松为图片添加多层防御处理，对抗 OCR 识别，同时保持人眼可读性。

## ✨ 核心特性

- 🖱️ **右键即用** - 在任何网页图片上右键选择"Anti-OCR 处理图片"
- 🔧 **可视化管道** - 拖拽调整算法顺序，实时预览处理效果
- 💾 **参数记忆** - 自动保存你的调参配置，下次打开直接使用
- 🔌 **插件化架构** - 支持动态加载自定义图像处理算法
- 🛡️ **纯前端运算** - 所有处理在本地完成，图片数据不上传任何服务器
- 📋 **多渠道输入** - 支持拖拽、粘贴、本地文件上传、URL加载

## 🎬 快速开始

### 安装

1. 克隆仓库
```bash
git clone https://github.com/your-username/anti-ocr-studio.git
cd anti-ocr-studio
```

2. 在 Chrome 中加载扩展
   - 打开 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目根目录

### 使用

#### 方式一：右键图片处理
1. 在任意网页的图片上右键
2. 选择 **🧪 Anti-OCR 处理图片**
3. 自动打开工作台并加载图片

#### 方式二：点击扩展图标
1. 点击浏览器工具栏的扩展图标
2. 拖拽图片到工作区 / 点击选择文件 / Ctrl+V 粘贴截图

## 🧩 插件系统

项目采用模块化插件架构，所有图像处理算法都是独立插件。

### 插件结构

```javascript
// plugins/example-noise.js
window.AntiOcrPlugins.push({
    name: "随机噪声",
    params: {
        intensity: { 
            label: "强度", 
            value: 50, 
            min: 0, 
            max: 100, 
            step: 1 
        }
    },
    process(ctx, imageData, params) {
        const data = imageData.data;
        const intensity = params.intensity.value;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * intensity;
            data[i] += noise;     // R
            data[i+1] += noise;   // G
            data[i+2] += noise;   // B
        }
        
        return imageData;
    }
});
```

### 添加自定义插件

1. 在 `plugins/` 目录创建新的 `.js` 文件
2. 按照上面的结构编写插件
3. 在 `plugins/manifest.json` 中注册：
```json
[
  "example-noise.js",
  "your-plugin.js"
]
```

## 🛠️ 技术栈

- **运行环境**: Chrome Extension Manifest V3
- **核心技术**: Canvas API + ImageData 像素操作
- **存储**: chrome.storage.local API
- **架构**: 零依赖纯原生 JavaScript

## 📁 项目结构

```
anti-ocr-studio/
├── manifest.json           # 扩展配置
├── background.js           # 右键菜单 & 图片传递
├── workspace/
│   ├── index.html         # 工作台主界面
│   ├── app.js             # 核心逻辑
│   └── style.css          # 样式
├── plugins/
│   ├── manifest.json      # 插件清单
│   └── *.js              # 各种算法插件
└── icons/
    └── icon*.png         # 扩展图标
```

## 🎯 典型应用场景

- 📸 保护截图文字隐私
- 🖼️ 图片水印对抗
- 🔒 敏感信息图像脱敏
- 🧪 图像对抗算法研究

## 🔐 隐私与安全

- ✅ 所有图像处理在本地浏览器完成
- ✅ 不上传任何数据到远程服务器
- ✅ 参数配置仅存储在本地 chrome.storage
- ✅ 开源代码，可自行审计

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献插件算法

如果你开发了新的图像对抗算法，欢迎提交到 `plugins/` 目录。

## 📄 许可证

MIT License

## 🙏 致谢

感谢所有为图像隐私保护技术做出贡献的开发者。

---

**⚠️ 免责声明**: 本工具仅供学习和研究使用，请勿用于非法用途。