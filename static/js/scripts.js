

const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'publications', 'awards', 'media']


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    })

    // Videos autoplay silently. A deliberate click enables sound for one video
    // while muting the others, so multiple previews never play audio together.
    document.addEventListener('click', event => {
        const videoCard = event.target.closest('.media-video-card');
        if (!videoCard) return;

        const selectedVideo = videoCard.querySelector('.media-video');
        if (!selectedVideo) return;
        if (videoCard.classList.contains('is-audible')) return;

        document.querySelectorAll('.media-video').forEach(video => {
            if (video !== selectedVideo) {
                video.muted = true;
                video.controls = false;
                video.closest('.media-video-card')?.classList.remove('is-audible');
            }
        });

        selectedVideo.muted = false;
        selectedVideo.controls = true;
        selectedVideo.play().catch(error => console.log(error));
        videoCard.classList.add('is-audible');
    });

}); 
