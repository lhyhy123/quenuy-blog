// ===== 工具函数 =====
function debounce(fn, ms) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), ms);
    };
}

// Toast 提示（替代 alert）
function showToast(msg, ms = 2000) {
    const el = document.createElement('div');
    el.textContent = msg;
    Object.assign(el.style, {
        position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
        background: 'var(--text-primary)', color: 'var(--bg-primary)',
        padding: '10px 24px', borderRadius: '20px', fontSize: '0.85rem',
        zIndex: '9999', opacity: '0', transition: 'opacity 0.3s',
        fontFamily: 'var(--font-sans)', pointerEvents: 'none'
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = '1'; });
    setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 300);
    }, ms);
}

// ===== 主题切换（暗色/浅色） =====
const themeToggle = document.getElementById('themeToggle');
const sidebarThemeToggle = document.getElementById('sidebarThemeToggle');
const sidebarThemeLabel = document.getElementById('sidebarThemeLabel');
const html = document.documentElement;

function updateThemeUI() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const label = isDark ? '☀️ 切换到浅色' : '🌙 切换到深色';
    if (themeToggle) themeToggle.textContent = isDark ? '☀️' : '🌙';
    if (sidebarThemeLabel) sidebarThemeLabel.textContent = label;
}

const savedTheme = localStorage.getItem('quenuy-blog-theme');
if (savedTheme === 'dark') html.setAttribute('data-theme', 'dark');
updateThemeUI();

function toggleTheme() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) { html.removeAttribute('data-theme'); localStorage.setItem('quenuy-blog-theme', 'light'); }
    else { html.setAttribute('data-theme', 'dark'); localStorage.setItem('quenuy-blog-theme', 'dark'); }
    updateThemeUI();
}

themeToggle && themeToggle.addEventListener('click', toggleTheme);
sidebarThemeToggle && sidebarThemeToggle.addEventListener('click', toggleTheme);

// ===== 主题色切换（5种配色） =====
const savedColor = localStorage.getItem('quenuy-blog-color') || 'blue';
html.setAttribute('data-theme-color', savedColor);
document.querySelectorAll('.theme-dot').forEach(dot => {
    dot.classList.toggle('active', dot.dataset.color === savedColor);
    dot.addEventListener('click', function () {
        const color = this.dataset.color;
        html.setAttribute('data-theme-color', color);
        localStorage.setItem('quenuy-blog-color', color);
        document.querySelectorAll('.theme-dot').forEach(d => d.classList.toggle('active', d.dataset.color === color));
    });
});

// ===== 移动端菜单 =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
        menuToggle.setAttribute('aria-label', isOpen ? '关闭菜单' : '打开菜单');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', '打开菜单');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===== 导航栏滚动效果 =====
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', debounce(function() {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, 50));
}

// ===== 导航高亮 =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
if (sections.length && navItems.length) {
    window.addEventListener('scroll', debounce(function() {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 100) current = section.getAttribute('id');
        });
        navItems.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }, 100));
}

// ===== 回到顶部 =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', debounce(function() {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }, 100));
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== 阅读进度条 =====
const readingProgress = document.getElementById('readingProgress');
if (readingProgress) {
    window.addEventListener('scroll', debounce(function() {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        readingProgress.style.width = Math.min(progress, 100) + '%';
    }, 30));
}

// ===== 自定义背景上传 =====
(function () {
    const upload = document.getElementById('bgUpload');
    const reset = document.getElementById('bgReset');
    const bgLayer = document.getElementById('bgLayer');
    const bgVideo = document.getElementById('bgVideo');
    const videoFile = document.getElementById('bgVideoFile');
    if (!upload || !bgLayer) return;

    // 视频背景上传
    if (videoFile && bgVideo) {
        videoFile.addEventListener('change', function () {
            var file = this.files[0];
            if (!file) return;
            var url = URL.createObjectURL(file);
            bgVideo.src = url;
            bgVideo.style.display = 'block';
            bgLayer.style.display = 'none';
        });
    }

    var customBg = localStorage.getItem('custom-bg');
    if (customBg) {
        bgLayer.style.backgroundImage = 'url(' + customBg + ')';
        bgLayer.classList.add('active');
    }

    upload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) { showToast('图片不能超过 3MB'); return; }
        const reader = new FileReader();
        reader.onload = function (ev) {
            const dataUrl = ev.target.result;
            localStorage.setItem('custom-bg', dataUrl);
            bgLayer.style.backgroundImage = 'url(' + dataUrl + ')';
            bgLayer.classList.add('active');
        };
        reader.readAsDataURL(file);
    });

    reset && reset.addEventListener('click', function () {
        localStorage.removeItem('custom-bg');
        localStorage.removeItem('bg-date');
        localStorage.removeItem('bg-idx');
        localStorage.removeItem('bg-video');
        if (bgVideo) { bgVideo.style.display = 'none'; bgVideo.src = ''; }
        bgLayer.style.display = '';
        bgLayer.classList.remove('active');
        bgLayer.style.backgroundImage = '';
        bgLayer.classList.remove('active');
        upload.value = '';
    });
})();

// ===== 背景图轮换 =====
(function () {
    var bgLayer = document.getElementById('bgLayer');
    if (!bgLayer) return;

    var files = (window.__BG_FILES__ && window.__BG_FILES__.length)
        ? window.__BG_FILES__.map(function(f) { return '/images/bg/' + f; })
        : ['/images/bg/bg0.jpg', '/images/bg/bg1.jpg', '/images/bg/bg2.jpg', '/images/bg/bg3.jpg'];

    function setBg(url) {
        bgLayer.style.backgroundImage = 'url(' + url + ')';
        bgLayer.classList.add('active');
    }

    function pickBg(idx) {
        setBg(files[idx % files.length]);
        localStorage.setItem('bg-date', new Date().toISOString().slice(0, 10));
        localStorage.setItem('bg-idx', idx);
    }

    var customBg = localStorage.getItem('custom-bg');
    if (customBg) return;

    var today = new Date().toISOString().slice(0, 10);
    var savedDate = localStorage.getItem('bg-date');
    var savedIdx = localStorage.getItem('bg-idx');

    if (savedDate === today && savedIdx !== null) {
        pickBg(parseInt(savedIdx));
    } else {
        pickBg(Math.floor(Math.random() * files.length));
    }

    // 手动切换背景
    var bgSwitch = document.getElementById('bgSwitch');
    if (bgSwitch) {
        bgSwitch.addEventListener('click', function () {
            var currentIdx = parseInt(localStorage.getItem('bg-idx')) || 0;
            var nextIdx;
            if (files.length > 1) {
                // 顺序递增轮换（bg0→bg1→...→bg19→bg0），不是随机
                nextIdx = (currentIdx + 1) % files.length;
            } else { nextIdx = 0; }
            localStorage.removeItem('custom-bg');
            pickBg(nextIdx);
        });
    }

    // 导航栏里的换背景按钮（和侧边栏按钮同步）
    var navBgSwitch = document.getElementById('navBgSwitch');
    if (navBgSwitch) {
        navBgSwitch.addEventListener('click', function () {
            if (bgSwitch) bgSwitch.click();
        });
    }
})();

// ===== 侧边栏 =====
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarTrigger = document.getElementById('sidebarTrigger');
const sidebarClose = document.getElementById('sidebarClose');

function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
    document.body.style.overflow = '';
}
if (sidebarTrigger) sidebarTrigger.addEventListener('click', openSidebar);
if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
});

// ===== 文章页 TOC 目录 =====
(function () {
    const tocNav = document.getElementById('tocNav');
    const tocSection = document.getElementById('sidebarToc');
    if (!tocNav || !tocSection) return;

    const headings = document.querySelectorAll('.post-body h2, .post-body h3');
    if (headings.length < 2) return;

    tocSection.style.display = '';
    headings.forEach(function (h, i) {
        const id = 'toc-' + i;
        h.id = id;
        const a = document.createElement('a');
        a.href = '#' + id;
        a.textContent = h.textContent;
        a.className = h.tagName === 'H3' ? 'toc-h3' : '';
        a.addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
            closeSidebar();
        });
        tocNav.appendChild(a);
    });
})();

// ===== 模糊度调节 =====
(function () {
    const slider = document.getElementById('blurSlider');
    if (!slider) return;
    const saved = localStorage.getItem('quenuy-blur') || '14';
    slider.value = saved;
    document.documentElement.style.setProperty('--blur-level', saved);
    slider.addEventListener('input', function () {
        document.documentElement.style.setProperty('--blur-level', this.value);
        localStorage.setItem('quenuy-blur', this.value);
    });
})();

// ===== 樱花飘落 =====
(function() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden';
    document.body.appendChild(container);

    var colors = ['#ffb7c5','#ffccd5','#ffe0e6','#ff9aa2','#ffd1dc','#fff0f3','#f8c8d8','#fad0c4'];
    var maxPetals = 15;

    function createPetal() {
        var petal = document.createElement('div');
        var size = 10 + Math.random() * 14;
        var startX = Math.random() * window.innerWidth;
        var duration = 6 + Math.random() * 10;
        var delay = Math.random() * 5;
        var opacity = 0.4 + Math.random() * 0.4;
        var color = colors[Math.floor(Math.random() * colors.length)];

        petal.style.cssText = [
            'position:absolute',
            'top:-30px',
            'left:' + startX + 'px',
            'width:' + size + 'px',
            'height:' + (size * 0.8) + 'px',
            'background:' + color,
            'border-radius:50% 0 50% 0',
            'opacity:' + opacity,
            'animation:petalFall ' + duration + 's ' + delay + 's linear forwards',
            'box-shadow:0 0 4px ' + color
        ].join(';');
        container.appendChild(petal);

        setTimeout(function() {
            if (petal.parentNode) petal.remove();
        }, (duration + delay) * 1000 + 500);
    }

    var style = document.createElement('style');
    style.textContent = [
        '@keyframes petalFall {',
        '  0%   { transform:translateY(0) rotate(0deg) translateX(0); opacity:1; }',
        '  25%  { transform:translateY(25vh) rotate(90deg) translateX(40px); }',
        '  50%  { transform:translateY(50vh) rotate(180deg) translateX(-30px); }',
        '  75%  { transform:translateY(75vh) rotate(270deg) translateX(20px); }',
        '  100% { transform:translateY(105vh) rotate(360deg) translateX(-10px); opacity:0; }',
        '}'
    ].join('\n');
    document.head.appendChild(style);

    for (var i = 0; i < maxPetals; i++) createPetal();
    setInterval(function() {
        if (container.children.length < maxPetals) createPetal();
    }, 1500);
})();

// ===== 滚动入场动画（Intersection Observer） =====
(function () {
    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.article-card, .archive-item, .friend-card, .device-card').forEach(function (el) {
        observer.observe(el);
    });

    // 文章详情页的段落逐个淡入
    document.querySelectorAll('.post-body > *').forEach(function (el, i) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(12px)';
        el.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
        el.style.transitionDelay = (i * 0.05) + 's';
        setTimeout(function () {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + (i * 50));
    });
})();



// ===== 背景图取色自适应（莫奈风格） =====
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var bgLayer = document.getElementById('bgLayer');
    if (!bgLayer) return;

    function extractColors() {
        var img = new Image();
        var bgStyle = getComputedStyle(bgLayer).backgroundImage;
        var urlMatch = bgStyle.match(/url\(["']?([^"')]+)["']?\)/);
        if (!urlMatch) return;
        img.crossOrigin = 'anonymous';
        img.onload = function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var w = canvas.width = 100;
            var h = canvas.height = 60;
            ctx.drawImage(img, 0, 0, w, h);
            var data = ctx.getImageData(0, 0, w, h).data;

            // 采样：每隔 N 个像素取一个颜色
            var samples = [];
            for (var i = 0; i < data.length; i += 80) {
                var r = data[i], g = data[i+1], b = data[i+2];
                // 跳过太暗或太亮的像素
                var brightness = (r + g + b) / 3;
                if (brightness < 20 || brightness > 235) continue;
                samples.push([r, g, b]);
            }

            if (samples.length < 5) return;

            // 取出现最多的颜色区间
            var avgR = 0, avgG = 0, avgB = 0;
            samples.forEach(function (s) { avgR += s[0]; avgG += s[1]; avgB += s[2]; });
            avgR = Math.round(avgR / samples.length);
            avgG = Math.round(avgG / samples.length);
            avgB = Math.round(avgB / samples.length);

            // MD3 令牌：基于背景主色生成 surface / glass / glow
            var root = document.documentElement;
            var alpha = function(a) { return 'rgba(' + avgR + ',' + avgG + ',' + avgB + ',' + a + ')'; };
            root.style.setProperty('--md3-surface', alpha(0.6));
            root.style.setProperty('--md3-surface-glass', alpha(0.45));
            root.style.setProperty('--md3-primary-tint', alpha(0.08));
            root.style.setProperty('--md3-glow', alpha(0.15));

            // 更新卡片 hover 光晕
            root.style.setProperty('--card-glow', 'rgba(' + avgR + ',' + avgG + ',' + avgB + ',0.15)');
        };
        img.src = urlMatch[1];
    }

    function updatePetalColors(r, g, b) {
        var container = document.querySelector('body > div[style*="pointer-events:none"]');
        if (!container) return;
        var styleId = 'petal-color-style';
        var oldStyle = document.getElementById(styleId);
        if (oldStyle) oldStyle.remove();
        var style = document.createElement('style');
        style.id = styleId;
        // 生成粉色调变体（保持樱花感，但融入背景色）
        var r2 = Math.round((r + 255) / 2), g2 = Math.round((g + 180) / 2), b2 = Math.round((b + 200) / 2);
        style.textContent = [
            '@keyframes petalFallAdapted {',
            '  0%   { transform:translateY(0) rotate(0deg) translateX(0); opacity:1; }',
            '  25%  { transform:translateY(25vh) rotate(90deg) translateX(40px); }',
            '  50%  { transform:translateY(50vh) rotate(180deg) translateX(-30px); }',
            '  75%  { transform:translateY(75vh) rotate(270deg) translateX(20px); }',
            '  100% { transform:translateY(105vh) rotate(360deg) translateX(-10px); opacity:0; }',
            '}'
        ].join('\n');
        document.head.appendChild(style);
        // 更新现有花瓣
        container.querySelectorAll('div').forEach(function (p) {
            p.style.background = 'rgba(' + r2 + ',' + g2 + ',' + b2 + ',0.6)';
            p.style.boxShadow = '0 0 4px rgba(' + r2 + ',' + g2 + ',' + b2 + ',0.4)';
        });
    }

    // 初始提取 + 切换背景时重新提取
    extractColors();
    var bgSwitch = document.getElementById('bgSwitch');
    if (bgSwitch) {
        var origClick = bgSwitch.onclick;
        bgSwitch.addEventListener('click', function () {
            setTimeout(extractColors, 800);
        });
    }
})();



// ===== 图片灯箱 =====
(function () {
    var lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = '<img src="" alt="灯箱">';
    document.body.appendChild(lb);
    lb.addEventListener('click', function () { lb.classList.remove('show'); });
    document.addEventListener('click', function (e) {
        var img = e.target.closest('.post-body img');
        if (!img) return;
        lb.querySelector('img').src = img.src;
        lb.classList.add('show');
    });
})();
