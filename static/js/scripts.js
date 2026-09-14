const contentDir = 'contents/';
const contentVersion = '20260914-bilingual';
const sectionNames = ['home', 'news', 'publications', 'awards', 'media'];

const interfaceText = {
    en: {
        menu: 'MENU',
        home: 'HOME',
        news: 'NEWS',
        publications: 'PUBLICATIONS',
        awards: 'AWARDS',
        media: 'MEDIA',
        description: 'Academic homepage of Xuanhe Fan',
        languageLabel: 'Select language',
        license: 'License',
    },
    zh: {
        menu: '菜单',
        home: '首页',
        news: '动态',
        publications: '论文',
        awards: '荣誉',
        media: '媒体',
        description: '范烜赫的学术主页',
        languageLabel: '选择语言',
        license: '许可协议',
    },
};

function localizedFile(name, language, extension) {
    const languageSuffix = language === 'zh' ? '.zh' : '';
    return `${contentDir}${name}${languageSuffix}.${extension}?v=${contentVersion}`;
}

async function fetchText(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Unable to load ${path}: ${response.status}`);
    }
    return response.text();
}

function setInterfaceLanguage(language) {
    const text = interfaceText[language];
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.querySelector('meta[name="description"]').content = text.description;
    document.getElementById('nav-menu-label').textContent = text.menu;
    document.getElementById('nav-home').textContent = text.home;
    document.getElementById('nav-news').textContent = text.news;
    document.getElementById('nav-publications').textContent = text.publications;
    document.getElementById('nav-awards').textContent = text.awards;
    document.getElementById('nav-media').textContent = text.media;
    document.getElementById('news-subtitle').innerHTML = `<i class="bi bi-megaphone-fill"></i>&nbsp;${text.news}`;
    document.getElementById('publications-subtitle').innerHTML = `<i class="bi bi-file-text-fill"></i>&nbsp;${text.publications}`;
    document.getElementById('awards-subtitle').innerHTML = `<i class="bi bi-award-fill"></i>&nbsp;${text.awards}`;
    document.getElementById('media-subtitle').innerHTML = `<i class="bi bi-camera-reels"></i>&nbsp;${text.media}`;
    document.getElementById('license-link').textContent = text.license;

    const languageSelect = document.getElementById('language-select');
    languageSelect.value = language;
    languageSelect.setAttribute('aria-label', text.languageLabel);
    languageSelect.title = text.languageLabel;
}

async function loadLanguage(language) {
    const languageSelect = document.getElementById('language-select');
    languageSelect.disabled = true;

    try {
        const requests = [
            fetchText(localizedFile('config', language, 'yml')),
            ...sectionNames.map(name => fetchText(localizedFile(name, language, 'md'))),
        ];
        const [configText, ...markdownSections] = await Promise.all(requests);
        const config = jsyaml.load(configText);

        Object.entries(config).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) element.innerHTML = value;
        });

        markdownSections.forEach((markdown, index) => {
            document.getElementById(`${sectionNames[index]}-md`).innerHTML = marked.parse(markdown);
        });

        setInterfaceLanguage(language);

        if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
            await window.MathJax.typesetPromise();
        }
    } catch (error) {
        console.error(error);
    } finally {
        languageSelect.disabled = false;
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    document.querySelectorAll('#navbarResponsive .nav-link').forEach(navItem => {
        navItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    marked.use({ mangle: false, headerIds: false });

    const languageSelect = document.getElementById('language-select');
    languageSelect.addEventListener('change', event => loadLanguage(event.target.value));

    // English is deliberately loaded on every fresh visit as the default language.
    await loadLanguage('en');

    // Video previews autoplay silently. Clicking a card enables sound for that
    // video and mutes all other previews so audio never overlaps.
    document.addEventListener('click', event => {
        const videoCard = event.target.closest('.media-video-card');
        if (!videoCard || videoCard.classList.contains('is-audible')) return;

        const selectedVideo = videoCard.querySelector('.media-video');
        if (!selectedVideo) return;

        document.querySelectorAll('.media-video').forEach(video => {
            if (video !== selectedVideo) {
                video.muted = true;
                video.controls = false;
                video.closest('.media-video-card')?.classList.remove('is-audible');
            }
        });

        selectedVideo.muted = false;
        selectedVideo.controls = true;
        selectedVideo.play().catch(error => console.error(error));
        videoCard.classList.add('is-audible');
    });
});
