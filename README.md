# Raythelp's Blog

一個現代化的個人部落格網站，具有深色主題、響應式設計和完整的部落格功能。

## 功能特色

- 🎨 **深色/淺色主題切換** - 支援主題切換功能
- 📱 **響應式設計** - 適配各種設備尺寸
- 🔍 **搜尋功能** - 即時搜尋文章內容
- 📂 **分類與標籤** - 文章分類和標籤系統
- 📝 **Markdown 支援** - 支援 Markdown 語法
- ⚡ **快速載入** - 輕量級設計，快速載入

## 專案結構

```
raythelp.github.io/
│
├── posts/               # Markdown 文章目錄
│   └── 2025-08-03-test.md
│
├── css/
│   └── style.css        # 網站樣式（支援深色模式）
│
├── js/
│   ├── main.js          # 首頁文章列表生成
│   └── markdown.js      # Markdown → HTML 轉換
│
├── posts.json           # 文章列表與 metadata
├── index.html           # 首頁（文章卡片列表）
├── post.html            # 單篇文章頁
└── about.html           # 關於我
```

## 技術棧

- **HTML5** - 語義化標籤
- **CSS3** - 現代化樣式，支援 CSS 變數
- **JavaScript (ES6+)** - 原生 JavaScript，無依賴
- **Font Awesome** - 圖標庫
- **Markdown** - 文章撰寫格式

## 快速開始

1. **克隆專案**
   ```bash
   git clone https://github.com/raythelp/raythelp.github.io.git
   cd raythelp.github.io
   ```

2. **本地預覽**
   - 使用任何 HTTP 伺服器（如 Python 的 `http.server`）
   - 或直接在瀏覽器中開啟 `index.html`

3. **自訂設定**
   - 修改 `posts.json` 中的文章資料
   - 在 `posts/` 目錄添加新的 Markdown 文章
   - 自訂 `css/style.css` 中的樣式

## 新增文章

1. **創建 Markdown 文件**
   在 `posts/` 目錄下創建新的 `.md` 文件

2. **更新 posts.json**
   在 `posts.json` 中添加文章元數據：

   ```json
   {
     "id": "文章ID",
     "title": "文章標題",
     "date": "YYYY-MM-DD",
     "category": "分類",
     "tags": ["標籤1", "標籤2"],
     "excerpt": "文章摘要",
     "content": "Markdown 內容"
   }
   ```

## 自訂主題

網站支援深色和淺色主題，可以通過以下方式自訂：

1. **修改 CSS 變數**
   在 `css/style.css` 中修改 `:root` 和 `[data-theme="light"]` 中的變數

2. **主題切換**
   點擊右上角的月亮/太陽圖標切換主題

## 功能說明

### 首頁功能
- 文章卡片列表
- 分類篩選
- 標籤篩選
- 搜尋功能
- 主題切換

### 文章頁面
- Markdown 渲染
- 程式碼高亮
- 響應式設計
- 閱讀時間估算

### 關於頁面
- 個人介紹
- 技能展示
- 聯絡資訊


## 聯絡方式

- GitHub: [@raythelp](https://github.com/raythelp)
- Email: raythelp@example.com

---

歡迎 Star 和 Fork！如果有任何問題或建議，請開 Issue 或 Pull Request。