// 全域變數
let posts = []; // 儲存所有文章資料
let categories = {}; // 儲存分類統計
let tags = {}; // 儲存標籤統計

// 初始化應用程式
document.addEventListener('DOMContentLoaded', function() {
    // 等待共用元件初始化完成
    setTimeout(() => {
        loadPosts(); // 載入文章
        setupBackToTop(); // 設定回到頂部按鈕
        updateProfileInfo(); // 更新個人資料
        
        // 檢查 URL 參數是否有篩選條件
        checkUrlFilters();
    }, 200); // 增加延遲時間確保共用元件完全載入
});

// 檢查 URL 參數中的篩選條件
function checkUrlFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const tag = urlParams.get('tag');
    
    if (category) {
        // 延遲執行，確保分類已渲染完成
        setTimeout(() => {
            filterPostsByCategory(category);
        }, 300);
    } else if (tag) {
        // 延遲執行，確保標籤已渲染完成
        setTimeout(() => {
            filterPostsByTag(tag);
        }, 300);
    }
}

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
    if (!container) return;
    
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
    const readingSpeed = window.SITE_CONFIG?.posts?.readingSpeed || 200;
    const readingTime = Math.ceil(wordCount / readingSpeed);
    
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
                <span>${wordCount} 字 | ${readingTime} 分鐘</span>
            </div>
            <div class="post-arrow">
                <i class="fas fa-arrow-right"></i>
            </div>
        </article>
    `;
}

// 渲染分類側邊欄
function renderCategories() {
    const container = document.getElementById('categoryList');
    if (!container) return;
    
    const categoriesList = Object.entries(categories)
        .map(([category, count]) => `
            <li class="category-item" data-category="${category}">
                <span class="category-name">${category}</span>
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
    if (!container) return;
    
    const tagsList = Object.entries(tags)
        .map(([tag, count]) => `
            <span class="tag" data-tag="${tag}">
                ${tag} <span class="tag-count">${count}</span>
            </span>
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
    console.log('篩選分類:', category); // 除錯用
    const filteredPosts = posts.filter(post => post.category === category);
    renderPosts(filteredPosts);
    
    // 更新激活狀態
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.category === category) {
            item.classList.add('active');
        }
    });
}

// 根據標籤篩選文章
function filterPostsByTag(tag) {
    console.log('篩選標籤:', tag); // 除錯用
    const filteredPosts = posts.filter(post => 
        post.tags && post.tags.includes(tag)
    );
    renderPosts(filteredPosts);
    
    // 更新激活狀態
    document.querySelectorAll('.tag').forEach(tagEl => {
        tagEl.classList.remove('active');
        if (tagEl.dataset.tag === tag) {
            tagEl.classList.add('active');
        }
    });
}

// 設定回到頂部按鈕
function setupBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);
    
    // 監聽滾動事件
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    // 點擊回到頂部
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 更新個人資料
function updateProfileInfo() {
    if (window.commonComponents && window.SITE_CONFIG) {
        // 更新網站標題
        window.commonComponents.updateSiteTitle(window.SITE_CONFIG.siteTitle);
        
        // 更新個人資料
        const profile = window.SITE_CONFIG.profile;
        window.commonComponents.updateProfile(
            profile.name,
            profile.bio,
            profile.socialLinks
        );
    }
}

// 搜尋功能（供共用元件調用）
function performSearch(searchTerm) {
    if (!searchTerm.trim()) {
        renderPosts(posts);
        return;
    }
    
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
    
    renderPosts(filteredPosts);
}

// 工具函數：格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 工具函數：計算閱讀時間
function calculateReadingTime(content) {
    const wordsPerMinute = window.SITE_CONFIG?.posts?.readingSpeed || 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
}

// 導出函數供其他文件使用
window.blogUtils = {
    formatDate,
    calculateReadingTime,
    performSearch,
    filterPostsByCategory,
    filterPostsByTag
}; 