// 全域變數
let posts = []; // 儲存所有文章資料
let categories = {}; // 儲存分類統計
let tags = {}; // 儲存標籤統計

// 初始化應用程式
document.addEventListener('DOMContentLoaded', function() {
    loadPosts(); // 載入文章
    setupThemeToggle(); // 設定主題切換
    setupSearch(); // 設定搜尋功能
    setupBackToTop(); // 設定回到頂部按鈕
});

// 從 posts.json 載入文章資料
async function loadPosts() {
    try {
        const response = await fetch('posts.json');
        const data = await response.json();
        posts = data.posts || [];
        
        // 處理分類和標籤統計
        processCategoriesAndTags();
        
        // 渲染文章列表
        renderPosts(posts);
        
        // 渲染側邊欄
        renderCategories();
        renderTags();
        
    } catch (error) {
        console.error('載入文章時發生錯誤:', error);
        document.getElementById('postsContainer').innerHTML = 
            '<div class="loading">載入文章中...</div>';
    }
}

// 處理文章的分類和標籤統計
function processCategoriesAndTags() {
    categories = {};
    tags = {};
    
    posts.forEach(post => {
        // 處理分類統計
        if (post.category) {
            categories[post.category] = (categories[post.category] || 0) + 1;
        }
        
        // 處理標籤統計
        if (post.tags) {
            post.tags.forEach(tag => {
                tags[tag] = (tags[tag] || 0) + 1;
            });
        }
    });
}

// 渲染文章列表
function renderPosts(postsToRender) {
    const container = document.getElementById('postsContainer');
    
    if (postsToRender.length === 0) {
        container.innerHTML = '<div class="loading">沒有找到文章</div>';
        return;
    }
    
    const postsHTML = postsToRender.map(post => createPostCard(post)).join('');
    container.innerHTML = postsHTML;
    
    // 為文章卡片添加點擊事件處理器
    document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('click', function() {
            const postId = this.dataset.postId;
            window.location.href = `post.html?id=${postId}`;
        });
    });
}

// 創建文章卡片 HTML
function createPostCard(post) {
    const wordCount = post.content ? post.content.split(' ').length : 0;
    const readingTime = Math.ceil(wordCount / 200); // 假設每分鐘閱讀 200 字
    
    const tagsHTML = post.tags ? post.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('') : '';
    
    return `
        <article class="post-card" data-post-id="${post.id}">
            <h2 class="post-title">${post.title}</h2>
            <div class="post-meta">
                <span><i class="fas fa-calendar"></i> ${post.date}</span>
                <span><i class="fas fa-folder"></i> ${post.category || '未分類'}</span>
            </div>
            <div class="post-tags">
                <i class="fas fa-tags"></i>
                ${tagsHTML}
            </div>
            <p class="post-excerpt">${post.excerpt || '沒有摘要'}</p>
            <div class="post-stats">
                <span>${wordCount} words | ${readingTime} minutes</span>
                <i class="fas fa-arrow-right post-arrow"></i>
            </div>
        </article>
    `;
}

// 渲染分類側邊欄
function renderCategories() {
    const container = document.getElementById('categoryList');
    const categoriesList = Object.entries(categories)
        .sort(([,a], [,b]) => b - a)
        .map(([category, count]) => `
            <li class="category-item" data-category="${category}">
                <span>${category}</span>
                <span class="category-count">${count}</span>
            </li>
        `).join('');
    
    container.innerHTML = categoriesList;
    
    // 添加點擊事件處理器
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.dataset.category;
            filterPostsByCategory(category);
        });
    });
}

// 渲染標籤雲側邊欄
function renderTags() {
    const container = document.getElementById('tagCloud');
    const tagsList = Object.entries(tags)
        .sort(([,a], [,b]) => b - a)
        .map(([tag, count]) => `
            <span class="tag" data-tag="${tag}">${tag}</span>
        `).join('');
    
    container.innerHTML = tagsList;
    
    // 添加點擊事件處理器
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const tagName = this.dataset.tag;
            filterPostsByTag(tagName);
        });
    });
}

// 根據分類篩選文章
function filterPostsByCategory(category) {
    const filteredPosts = posts.filter(post => post.category === category);
    renderPosts(filteredPosts);
    
    // 更新激活狀態
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
}

// 根據標籤篩選文章
function filterPostsByTag(tag) {
    const filteredPosts = posts.filter(post => 
        post.tags && post.tags.includes(tag)
    );
    renderPosts(filteredPosts);
    
    // 更新激活狀態
    document.querySelectorAll('.tag').forEach(tagEl => {
        tagEl.classList.remove('active');
    });
    document.querySelector(`[data-tag="${tag}"]`).classList.add('active');
}

// 設定主題切換
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    // 載入保存的主題
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(icon, savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(icon, newTheme);
    });
}

// 更新主題圖標
function updateThemeIcon(icon, theme) {
    if (theme === 'light') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// 設定搜尋功能
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = this.value.toLowerCase().trim();
            
            if (query === '') {
                renderPosts(posts);
                return;
            }
            
            const filteredPosts = posts.filter(post => 
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query) ||
                (post.content && post.content.toLowerCase().includes(query)) ||
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
            );
            
            renderPosts(filteredPosts);
        }, 300);
    });
}

// 設定回到頂部按鈕
function setupBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 工具函數：格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// 工具函數：計算閱讀時間
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
}

// 導出函數供其他文件使用
window.blogUtils = {
    formatDate,
    calculateReadingTime,
    renderPosts,
    filterPostsByCategory,
    filterPostsByTag
}; 