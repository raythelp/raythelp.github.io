// Global variables
let posts = [];
let categories = {};
let tags = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    setupThemeToggle();
    setupSearch();
    setupBackToTop();
});

// Load posts from posts.json
async function loadPosts() {
    try {
        const response = await fetch('posts.json');
        const data = await response.json();
        posts = data.posts || [];
        
        // Process categories and tags
        processCategoriesAndTags();
        
        // Render posts
        renderPosts(posts);
        
        // Render sidebar
        renderCategories();
        renderTags();
        
    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById('postsContainer').innerHTML = 
            '<div class="loading">Loading posts...</div>';
    }
}

// Process categories and tags from posts
function processCategoriesAndTags() {
    categories = {};
    tags = {};
    
    posts.forEach(post => {
        // Process categories
        if (post.category) {
            categories[post.category] = (categories[post.category] || 0) + 1;
        }
        
        // Process tags
        if (post.tags) {
            post.tags.forEach(tag => {
                tags[tag] = (tags[tag] || 0) + 1;
            });
        }
    });
}

// Render posts
function renderPosts(postsToRender) {
    const container = document.getElementById('postsContainer');
    
    if (postsToRender.length === 0) {
        container.innerHTML = '<div class="loading">No posts found</div>';
        return;
    }
    
    const postsHTML = postsToRender.map(post => createPostCard(post)).join('');
    container.innerHTML = postsHTML;
    
    // Add click handlers to post cards
    document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('click', function() {
            const postId = this.dataset.postId;
            window.location.href = `post.html?id=${postId}`;
        });
    });
}

// Create post card HTML
function createPostCard(post) {
    const wordCount = post.content ? post.content.split(' ').length : 0;
    const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute
    
    const tagsHTML = post.tags ? post.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('') : '';
    
    return `
        <article class="post-card" data-post-id="${post.id}">
            <h2 class="post-title">${post.title}</h2>
            <div class="post-meta">
                <span><i class="fas fa-calendar"></i> ${post.date}</span>
                <span><i class="fas fa-folder"></i> ${post.category || 'Uncategorized'}</span>
            </div>
            <div class="post-tags">
                <i class="fas fa-tags"></i>
                ${tagsHTML}
            </div>
            <p class="post-excerpt">${post.excerpt || 'No excerpt available'}</p>
            <div class="post-stats">
                <span>${wordCount} words | ${readingTime} minutes</span>
                <i class="fas fa-arrow-right post-arrow"></i>
            </div>
        </article>
    `;
}

// Render categories in sidebar
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
    
    // Add click handlers
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.dataset.category;
            filterPostsByCategory(category);
        });
    });
}

// Render tags in sidebar
function renderTags() {
    const container = document.getElementById('tagCloud');
    const tagsList = Object.entries(tags)
        .sort(([,a], [,b]) => b - a)
        .map(([tag, count]) => `
            <span class="tag" data-tag="${tag}">${tag}</span>
        `).join('');
    
    container.innerHTML = tagsList;
    
    // Add click handlers
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const tagName = this.dataset.tag;
            filterPostsByTag(tagName);
        });
    });
}

// Filter posts by category
function filterPostsByCategory(category) {
    const filteredPosts = posts.filter(post => post.category === category);
    renderPosts(filteredPosts);
    
    // Update active state
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
}

// Filter posts by tag
function filterPostsByTag(tag) {
    const filteredPosts = posts.filter(post => 
        post.tags && post.tags.includes(tag)
    );
    renderPosts(filteredPosts);
    
    // Update active state
    document.querySelectorAll('.tag').forEach(tagEl => {
        tagEl.classList.remove('active');
    });
    document.querySelector(`[data-tag="${tag}"]`).classList.add('active');
}

// Setup theme toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    // Load saved theme
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

// Update theme icon
function updateThemeIcon(icon, theme) {
    if (theme === 'light') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Setup search functionality
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

// Setup back to top button
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

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// Utility function to calculate reading time
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
}

// Export functions for use in other files
window.blogUtils = {
    formatDate,
    calculateReadingTime,
    renderPosts,
    filterPostsByCategory,
    filterPostsByTag
}; 