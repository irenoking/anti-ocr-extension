const mainCanvas = document.getElementById('mainCanvas');
const ctx = mainCanvas.getContext('2d', { willReadFrequently: true });
const pipelineContainer = document.getElementById('pipelineContainer');
const status = document.getElementById('status');
const configHint = document.getElementById('configHint');

const dropZone = document.getElementById('dropZone');
const dropHint = document.getElementById('dropHint');
const hiddenFileInput = document.getElementById('hiddenFileInput');

let originalImage = new Image();
let loadedPlugins = []; 

// ==========================================
// 🔧 Storage 适配层（Chrome Extension）
// ==========================================

async function getStorageData(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
            resolve(result[key]);
        });
    });
}

async function setStorageData(key, value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, resolve);
    });
}

// ==========================================
// 🧠 插件加载核心
// ==========================================

async function fetchPluginList() {
    try {
        const url = chrome.runtime.getURL("plugins/manifest.json");
        const res = await fetch(`${url}?t=${Date.now()}`);
        const list = await res.json();
        return list.map(f => chrome.runtime.getURL(`plugins/${f}`));
    } catch (e) {
        console.warn("manifest加载失败，降级为手动列表");
        return [];
    }
}

async function loadPlugins() {
    window.AntiOcrPlugins = [];

    const autoFiles = await fetchPluginList();

    for (const file of autoFiles) {
        try {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `${file}?t=${Date.now()}`;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        } catch (e) {
            console.error(`Failed to load plugin: ${file}`, e);
        }
    }

    await applySavedConfig();
    await applySavedOrder();
    renderPluginPanels();
}

// ==========================================
// 💾 配置持久化（Chrome Storage API）
// ==========================================

async function applySavedConfig() {
    const savedData = await getStorageData('ANTI_OCR_STUDIO_CONFIG');
    if (!savedData) return;
    
    try {
        const configMap = JSON.parse(savedData);
        if (window.AntiOcrPlugins) {
            window.AntiOcrPlugins.forEach(plugin => {
                if (configMap[plugin.name]) {
                    const savedParams = configMap[plugin.name];
                    for (const key in plugin.params) {
                        if (savedParams[key] !== undefined) {
                            plugin.params[key].value = savedParams[key];
                        }
                    }
                }
            });
        }
        configHint.innerText = "✨ 状态：已自动加载上次缓存的参数配置";
        configHint.style.color = "#00adb5";
    } catch (e) {
        configHint.innerText = "❌ 状态：缓存配置文件解析异常";
    }
}

async function saveConfigToLocalStorage() {
    const configMap = {};
    loadedPlugins.forEach(plugin => {
        configMap[plugin.name] = {};
        for (const [key, param] of Object.entries(plugin.params)) {
            configMap[plugin.name][key] = param.value;
        }
    });
    await setStorageData('ANTI_OCR_STUDIO_CONFIG', JSON.stringify(configMap));
    configHint.innerText = "💾 状态：检测到滑块变更，配置已自动实时归档";
    configHint.style.color = "#777";
}

async function savePluginOrder() {
    const order = window.AntiOcrPlugins.map(p => p.name);
    await setStorageData('ANTI_OCR_PLUGIN_ORDER', JSON.stringify(order));
}

async function applySavedOrder() {
    const saved = await getStorageData('ANTI_OCR_PLUGIN_ORDER');
    if (!saved) return;

    try {
        const order = JSON.parse(saved);
        window.AntiOcrPlugins.sort((a, b) => {
            return order.indexOf(a.name) - order.indexOf(b.name);
        });
    } catch (e) {
        console.warn("排序恢复失败");
    }
}

// ==========================================
// 🎨 UI 渲染
// ==========================================

function renderPluginPanels() {
    pipelineContainer.innerHTML = '';
    loadedPlugins = [];

    if (!window.AntiOcrPlugins) return;

    window.AntiOcrPlugins.forEach((plugin, index) => {
        loadedPlugins.push(plugin);

        const card = document.createElement('div');
        card.className = 'plugin-card';

        let paramsHtml = '';
        for (const [key, param] of Object.entries(plugin.params)) {
            paramsHtml += `
                <div class="param-row">
                    <div style="display:flex; justify-content:space-between;">
                        <span>${param.label}</span>
                        <span id="val_${index}_${key}">${param.value}</span>
                    </div>
                    <input type="range"
                        data-plugin-index="${index}"
                        data-param-key="${key}"
                        min="${param.min}" max="${param.max}" step="${param.step}"
                        value="${param.value}">
                </div>`;
        }

        card.innerHTML = `
            <div class="plugin-title" data-index="${index}" draggable="true">
                <span>${plugin.name}</span>
                <span style="cursor:grab;">☰</span>
            </div>
            ${paramsHtml}
        `;

        const header = card.querySelector(".plugin-title");
        header.addEventListener("dragstart", onDragStart);
        header.addEventListener("dragover", onDragOver);
        header.addEventListener("drop", onDrop);

        pipelineContainer.appendChild(card);

        // ✅ 改成事件委托，替代 oninput
        card.querySelectorAll("input[type='range']").forEach(input => {
            input.addEventListener("input", (e) => {
                const pluginIndex = parseInt(e.target.dataset.pluginIndex);
                const paramKey = e.target.dataset.paramKey;
                const value = e.target.value;
                
                loadedPlugins[pluginIndex].params[paramKey].value = parseFloat(value);
                document.getElementById(`val_${pluginIndex}_${paramKey}`).innerText = value;
                saveConfigToLocalStorage();
                if (originalImage.src) executePipeline();
            });

            input.addEventListener("mousedown", (e) => {
                e.stopPropagation();
            });
        });
    });
}


// ==========================================
// 🎯 拖拽排序
// ==========================================

let dragFromIndex = null;

function onDragStart(e) {
    dragFromIndex = Number(e.currentTarget.dataset.index);
}

function onDragOver(e) {
    e.preventDefault();
}

function onDrop(e) {
    e.preventDefault();

    const toIndex = Number(e.currentTarget.dataset.index);
    if (dragFromIndex === null || dragFromIndex === toIndex) return;

    const arr = window.AntiOcrPlugins;
    const moved = arr.splice(dragFromIndex, 1)[0];
    arr.splice(toIndex, 0, moved);

    savePluginOrder();
    renderPluginPanels();
    if (originalImage.src) executePipeline();
}

// ==========================================
// 🔥 管道执行引擎
// ==========================================

function executePipeline() {
    if (!originalImage.src) return;
    const w = originalImage.width;
    const h = originalImage.height;
    mainCanvas.width = w;
    mainCanvas.height = h;
    ctx.drawImage(originalImage, 0, 0);
    loadedPlugins.forEach(plugin => {
        let currentImageData = ctx.getImageData(0, 0, w, h);
        let processedImageData = plugin.process(ctx, currentImageData, plugin.params);
        ctx.putImageData(processedImageData, 0, 0);
    });
}

// ==========================================
// 📥 图片加载器
// ==========================================

function loadImageFromFile(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => { 
            originalImage.src = event.target.result; 
        };
        reader.readAsDataURL(file);
    }
}

async function loadImageFromURL(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = (event) => {
            originalImage.src = event.target.result;
        };
        reader.readAsDataURL(blob);
    } catch (e) {
        console.warn("URL图片加载失败", e);
    }
}

function getQueryImage() {
    const params = new URLSearchParams(window.location.search);
    return params.get("img");
}

async function tryLoadFromURL() {
    const url = getQueryImage();
    if (!url) return;
    await loadImageFromURL(url);
}

// ==========================================
// 🖱️ 交互事件
// ==========================================

dropZone.addEventListener('click', (e) => {
    if (e.target === mainCanvas) return;
    hiddenFileInput.click();
});

hiddenFileInput.addEventListener('change', () => {
    if (hiddenFileInput.files.length > 0) {
        loadImageFromFile(hiddenFileInput.files[0]);
    }
});

document.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            console.log("成功截获剪贴板粘贴图片...");
            loadImageFromFile(file);
            break;
        }
    }
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#ff2e63';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#444';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#444';
    if (e.dataTransfer.files.length > 0) {
        loadImageFromFile(e.dataTransfer.files[0]);
    }
});

originalImage.onload = function() {
    dropHint.style.display = 'none';
    executePipeline();
};

// ==========================================
// 🎛️ 控制按钮
// ==========================================

document.getElementById('resetConfigBtn').addEventListener('click', async () => {
    if (confirm("确定要放弃当前的对抗调参配置，恢复出厂默认值吗？")) {
        await chrome.storage.local.remove(['ANTI_OCR_STUDIO_CONFIG', 'ANTI_OCR_PLUGIN_ORDER']);
        location.reload();
    }
});

document.getElementById('copyBtn').addEventListener('click', () => {
    if (!originalImage.src) return;
    mainCanvas.toBlob(async (blob) => {
        try {
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
            status.innerText = "✅ 最终防御组合图已成功复制！";
            setTimeout(() => status.innerText = "", 2500);
        } catch {
            status.innerText = "❌ 复制失败，请使用下方按钮下载";
        }
    });
});

document.getElementById('downloadBtn').addEventListener('click', () => {
    if (!originalImage.src) return;
    const link = document.createElement('a');
    link.download = `anti_ocr_studio_${Date.now()}.png`;
    link.href = mainCanvas.toDataURL();
    link.click();
});

document.querySelector('.workspace-controls').addEventListener('click', (e) => {
    e.stopPropagation();
});

document.querySelector('.workspace-controls').addEventListener('mousedown', (e) => {
    e.stopPropagation();
});

// ==========================================
// 🚀 启动
// ==========================================

(async function init() {
    await loadPlugins();
    await tryLoadFromURL();
})();