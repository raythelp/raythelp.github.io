// 共用元件管理
class CommonComponents {
    constructor() {
        this.initTemplates();
        this.initComponents();
        this.initVisitorCount();
    }

    // 初始化所有元件
    initComponents() {
        this.initHeader();
        this.initSidebar();
        this.initFooter();
    }

    // 初始化訪客計數
    initVisitorCount() {
        // 從 localStorage 獲取訪客計數
        let count = parseInt(localStorage.getItem('visitorCount') || '0');
        
        // 如果是新的瀏覽階段，增加計數
        if (!sessionStorage.getItem('visited')) {
            count++;
            localStorage.setItem('visitorCount', count.toString());
            sessionStorage.setItem('visited', 'true');
        }
        
        // 更新顯示
        const visitorCountElement = document.getElementById('visitorCount');
        if (visitorCountElement) {
            visitorCountElement.textContent = count.toString();
        }
    }

    // 初始化模板
    initTemplates() {
        // 頁尾 HTML 模板
        this.footerTemplate = `
            <footer class="footer">
                <div class="footer-content">
                    <div class="visitor-count">
                        <i class="fas fa-users"></i>
                        <span>Blog Visitors: <span id="visitorCount">0</span></span>
                    </div>
                    <p>© ${new Date().getFullYear()} ${window.SITE_CONFIG?.profile?.name || 'raythelp'} All Rights Reserved.</p>
                    <p>Built by <a href="https://pages.github.com/" target="_blank" rel="noopener">Github Pages</a></p>
                </div>
            </footer>
        `;

        // 頁首 HTML 模板
        this.headerTemplate = `
            <header class="header">
                <div class="header-content">
                    <div class="logo">
                        <i class="fas fa-home"></i>
                        <span id="siteTitle">${window.SITE_CONFIG?.siteTitle || '我的部落格'}</span>
                    </div>
                    <nav class="nav">
                        ${this.generateNavigation()}
                    </nav>
                    <div class="header-controls">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="搜尋..." id="searchInput">
                        </div>
                        <button class="theme-toggle" id="themeToggle">
                            <i class="fas fa-moon"></i>
                        </button>
                    </div>
                </div>
            </header>
        `;

        // 側邊欄 HTML 模板
        this.sidebarTemplate = `
            <aside class="sidebar">
                <!-- 個人資料卡片 -->
                <div class="profile-card">
                    <div class="profile-avatar">
                        <i class="${window.SITE_CONFIG?.profile?.avatar || 'fas fa-user'}"></i>
                    </div>
                    <h3 class="profile-name" id="profileName">${window.SITE_CONFIG?.profile?.name || '你的名字'}</h3>
                    <p class="profile-bio" id="profileBio">${window.SITE_CONFIG?.profile?.bio || '你的簡介'}</p>
                    <div class="social-links">
                        ${this.generateSocialLinks()}
                    </div>
                </div>

                <!-- 分類列表 -->
                <div class="sidebar-section">
                    <h3 class="section-title">分類</h3>
                    <ul class="category-list" id="categoryList">
                        <!-- 分類將由 JavaScript 動態生成 -->
                    </ul>
                </div>

                <!-- 標籤雲 -->
                <div class="sidebar-section">
                    <h3 class="section-title">標籤</h3>
                    <div class="tag-cloud" id="tagCloud">
                        <!-- 標籤將由 JavaScript 動態生成 -->
                    </div>
                </div>
            </aside>
        `;
    }

    // 生成導航選單
    generateNavigation() {
        const navigation = window.SITE_CONFIG?.navigation || [
            { name: '首頁', url: 'index.html', icon: 'fas fa-home' },
            { name: '文章', url: '#', icon: 'fas fa-file-alt' },
            { name: '關於', url: 'about.html', icon: 'fas fa-user' },
            { name: 'GitHub', url: '#', icon: 'fab fa-github', external: true }
        ];

        return navigation.map(item => {
            const externalIcon = item.external ? ' <i class="fas fa-external-link-alt"></i>' : '';
            return `<a href="${item.url}" class="nav-link" ${item.external ? 'target="_blank"' : ''}>
                ${item.name}${externalIcon}
            </a>`;
        }).join('');
    }

    // 生成社交連結
    generateSocialLinks() {
        const socialLinks = window.SITE_CONFIG?.profile?.socialLinks || {};
        const socialIcons = {
            github: 'fab fa-github',
            linkedin: 'fab fa-linkedin',
            twitter: 'fab fa-twitter',
            instagram: 'fab fa-instagram',
            email: 'fas fa-envelope'
        };

        return Object.entries(socialLinks).map(([platform, url]) => {
            const icon = socialIcons[platform];
            if (!icon) return '';
            
            return `<a href="${url}" class="social-link" target="_blank"><i class="${icon}"></i></a>`;
        }).join('');
    }

    // 初始化頁首
    initHeader() {
        const headerContainer = document.querySelector('#headerContainer');
        if (headerContainer) {
            headerContainer.innerHTML = this.headerTemplate;
            this.setupHeaderControls();
        }
    }

    // 初始化側邊欄
    initSidebar() {
        const sidebarContainer = document.querySelector('#sidebarContainer');
        if (sidebarContainer) {
            sidebarContainer.innerHTML = this.sidebarTemplate;
        }
    }

    // 初始化頁尾
    initFooter() {
        const footerContainer = document.querySelector('#footerContainer');
        if (footerContainer) {
            footerContainer.innerHTML = this.footerTemplate;
        }
    }

    // 設定頁首控制項
    setupHeaderControls() {
        // 主題切換
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const savedTheme = localStorage.getItem('theme') || window.SITE_CONFIG?.theme?.default || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.updateThemeIcon(themeToggle.querySelector('i'), savedTheme);

            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon(themeToggle.querySelector('i'), newTheme);
            });
        }

        // 搜尋功能
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            const debounceTime = window.SITE_CONFIG?.search?.debounceTime || 300;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const searchTerm = e.target.value.toLowerCase();
                    this.performSearch(searchTerm);
                }, debounceTime);
            });
        }
    }

    // 更新主題圖標
    updateThemeIcon(icon, theme) {
        if (theme === 'light') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // 執行搜尋
    performSearch(searchTerm) {
        const minLength = window.SITE_CONFIG?.search?.minSearchLength || 2;
        if (searchTerm.length < minLength) {
            if (window.blogUtils && window.blogUtils.performSearch) {
                window.blogUtils.performSearch('');
            }
            return;
        }
        
        // 搜尋邏輯將由 main.js 處理
        if (window.blogUtils && window.blogUtils.performSearch) {
            window.blogUtils.performSearch(searchTerm);
        }
    }

    // 更新個人資料
    updateProfile(name, bio, socialLinks = {}) {
        const profileName = document.getElementById('profileName');
        const profileBio = document.getElementById('profileBio');
        
        if (profileName) profileName.textContent = name;
        if (profileBio) profileBio.textContent = bio;

        // 更新社交連結
        if (socialLinks.github) {
            const githubLink = document.querySelector('.social-link[href="#"]');
            if (githubLink) githubLink.href = socialLinks.github;
        }
    }

    // 更新網站標題
    updateSiteTitle(title) {
        const siteTitle = document.getElementById('siteTitle');
        if (siteTitle) siteTitle.textContent = title;
    }
}

// 創建全域實例
window.commonComponents = new CommonComponents();

// 頁面載入時自動初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化頁首
    window.commonComponents.initHeader();
    
    // 初始化側邊欄（如果存在）
    window.commonComponents.initSidebar();
}); 