// 全站共用 JavaScript

// Mobile Menu Toggle - 優化版
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('nav');
    const navContainer = document.querySelector('.nav-container');
    const navMenus = document.querySelectorAll('.nav-menu');
    
    // 創建漢堡選單按鈕
    if (!document.querySelector('.menu-toggle')) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.setAttribute('aria-label', '選單');
        menuToggle.innerHTML = '<span></span><span></span><span></span>';
        navContainer.appendChild(menuToggle);
        
        // 點擊漢堡選單切換
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navMenus.forEach(menu => menu.classList.toggle('active'));
            document.body.style.overflow = this.classList.contains('active') ? 'hidden' : '';
        });
    }

    // 點擊導覽連結後關閉選單
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const menuToggle = document.querySelector('.menu-toggle');
            if (menuToggle && menuToggle.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenus.forEach(menu => menu.classList.remove('active'));
                document.body.style.overflow = '';
            }
        });
    });

    // 點擊選單外部關閉選單
    document.addEventListener('click', function(e) {
        const menuToggle = document.querySelector('.menu-toggle');
        const isClickInsideNav = nav.contains(e.target);
        
        if (!isClickInsideNav && menuToggle && menuToggle.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenus.forEach(menu => menu.classList.remove('active'));
            document.body.style.overflow = '';
        }
    });

    // 視窗大小改變時重置
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const menuToggle = document.querySelector('.menu-toggle');
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
            navMenus.forEach(menu => menu.classList.remove('active'));
            document.body.style.overflow = '';
        }
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// 防止表單重複提交
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            setTimeout(() => {
                submitBtn.disabled = false;
            }, 3000);
        }
    });
});

// 圖片延遲載入
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Utility Functions
const utils = {
    // 格式化日期
    formatDate: function(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('zh-TW', options);
    },

    // 顯示通知
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Export utils for other scripts
window.utils = utils;
