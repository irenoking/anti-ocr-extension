# Anti-OCR Studio 隐私权政策 / Privacy Policy

**生效日期 / Effective date:** 2026-08-17  
**最后更新 / Last updated:** 2026-08-17

## 中文

Anti-OCR Studio（以下简称“本扩展”）重视您的隐私。本政策说明本扩展如何处理用户选择的图片、扩展设置以及相关权限。

### 1. 数据收集

本扩展不会收集、记录或向开发者控制的服务器传输任何个人信息、浏览历史、图片内容或使用数据。本扩展不包含广告、分析、追踪或遥测服务。

### 2. 图片处理

只有在您主动进行以下操作时，本扩展才会处理图片：

- 在网页图片的右键菜单中选择 Anti-OCR Studio；
- 从本地设备选择或拖入图片；
- 将剪贴板中的图片粘贴到扩展工作台。

图片处理通过浏览器中的 Canvas API 在您的设备本地完成。处理后的图片不会上传给开发者或任何由开发者控制的服务。

当您通过右键菜单选择网页图片时，浏览器会从该图片原本所在的网站或内容分发网络读取图片。该请求可能按照目标网站及浏览器自身的隐私政策携带常规网络请求信息，但本扩展不会将图片或相关请求数据发送给开发者。

### 3. 本地存储

本扩展使用 `chrome.storage.local` 在您的设备上保存：

- 图片处理参数；
- 内置处理模块的排列顺序。

这些设置不会同步或上传给开发者。您可以在扩展中恢复默认设置，也可以通过清除扩展数据或卸载本扩展删除这些设置。

### 4. 权限用途

本扩展使用以下 Chrome 权限：

- `contextMenus`：在网页图片的右键菜单中提供处理入口；
- `storage`：在本地保存处理参数和模块顺序；
- `tabs`：打开本扩展的图片处理工作台；
- 网站访问权限（`<all_urls>`）：仅在用户主动选择网页图片时读取该图片，以便在本地工作台中处理来自不同网站或图片托管域名的资源。

本扩展不会使用网站访问权限扫描网页、读取与所选图片无关的页面内容，或在后台收集浏览活动。

### 5. 数据共享、出售与第三方服务

本扩展不会出售、出租或共享用户数据，也不会将用户数据用于广告、信用评估或与本扩展单一用途无关的目的。本扩展不集成第三方分析或广告 SDK。

### 6. 数据安全与保留

由于本扩展不将图片或设置传输给开发者，因此开发者不会在服务器上保留这些数据。本地设置由 Chrome 的扩展存储机制管理。请仅处理您有权使用的图片，并注意处理结果仍可能包含原图中的敏感信息。

### 7. 儿童隐私

本扩展不会有意收集儿童或其他用户的个人信息。

### 8. 政策变更

如果本扩展的数据处理方式发生变化，本政策将同步更新，并修改页面顶部的“最后更新”日期。涉及数据收集或共享的重大变化将在发布新版本时明确披露。

### 9. 联系方式

如对本隐私权政策有疑问，请通过项目的 GitHub Issues 联系开发者：

<https://github.com/irenoking/anti-ocr-extension/issues>

## English

Anti-OCR Studio (the "Extension") respects your privacy. This policy explains how the Extension handles user-selected images, extension settings, and related permissions.

### 1. Data Collection

The Extension does not collect, log, or transmit personal information, browsing history, image content, or usage data to servers controlled by the developer. The Extension contains no advertising, analytics, tracking, or telemetry services.

### 2. Image Processing

The Extension processes an image only when you actively:

- select Anti-OCR Studio from an image's context menu;
- select or drag an image from your device; or
- paste an image from the clipboard into the Extension workspace.

Image processing is performed locally on your device through the browser's Canvas API. Processed images are not uploaded to the developer or to any service controlled by the developer.

When you select a web image through the context menu, your browser retrieves that image from its original website or content delivery network. This request may contain ordinary network request information as determined by the destination website and your browser. The Extension does not send the image or related request data to the developer.

### 3. Local Storage

The Extension uses `chrome.storage.local` to store the following information on your device:

- image-processing parameters; and
- the order of built-in processing modules.

These settings are not synchronized with or uploaded to the developer. You can remove them by resetting the Extension's settings, clearing its data, or uninstalling the Extension.

### 4. Use of Permissions

The Extension uses the following Chrome permissions:

- `contextMenus`: to provide an image-processing entry in the image context menu;
- `storage`: to save processing parameters and module order locally;
- `tabs`: to open the Extension's image-processing workspace; and
- host access (`<all_urls>`): only to retrieve an image that the user explicitly selects, so images hosted on different websites or image domains can be processed locally.

The Extension does not use host access to scan web pages, read page content unrelated to the selected image, or collect browsing activity in the background.

### 5. Data Sharing, Sale, and Third-Party Services

The Extension does not sell, rent, or share user data. It does not use user data for advertising, credit assessment, or purposes unrelated to its single purpose. The Extension does not integrate third-party analytics or advertising SDKs.

### 6. Data Security and Retention

Because the Extension does not transmit images or settings to the developer, the developer does not retain this data on a server. Local settings are managed by Chrome's extension storage system. You should process only images you are authorized to use and be aware that an output image may still contain sensitive information from the original.

### 7. Children's Privacy

The Extension does not knowingly collect personal information from children or other users.

### 8. Changes to This Policy

If the Extension's data practices change, this policy will be updated and the "Last updated" date above will be revised. Material changes involving data collection or sharing will be clearly disclosed with the relevant Extension update.

### 9. Contact

For questions about this Privacy Policy, contact the developer through the project's GitHub Issues page:

<https://github.com/irenoking/anti-ocr-extension/issues>
