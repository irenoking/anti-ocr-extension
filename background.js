// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "anti-ocr-process",
        title: "🧪 Anti-OCR 处理图片",
        contexts: ["image"]
    });
});

// 右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "anti-ocr-process") {
        const imageUrl = info.srcUrl;
        const targetUrl =
            chrome.runtime.getURL("workspace/index.html") +
            `?img=${encodeURIComponent(imageUrl)}`;

        chrome.tabs.create({ url: targetUrl });
    }
});
// 点击插件图标也打开工作台
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ 
        url: chrome.runtime.getURL("workspace/index.html") 
    });
});
