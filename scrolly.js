/**
 * Canary Inn Cinematic Scrollytelling Engine
 * Native JavaScript - No Dependencies
 */

const scrollyConfig = {
    totalHeight: 400, // vh
    beats: [
        { id: 'beat1', threshold: [0, 0.25], text: "The Legend Returns." },
        { id: 'beat2', threshold: [0.25, 0.5], text: "Modern Urban Luxury." },
        { id: 'beat3', threshold: [0.5, 0.75], text: "A Sanctuary of Leisure." },
        { id: 'beat4', threshold: [0.75, 1], text: "Canary Inn | Hazaribagh." }
    ],
    images: []
};

function initScrolly() {
    const scrollyContainer = document.getElementById('scrolly-intro');
    const canvas = document.getElementById('scrolly-canvas');
    const ctx = canvas.getContext('2d');
    const mainNav = document.getElementById('mainNav');
    
    // Load Cinematic Images
    const imagePaths = [
        'assets/scrolly/beat1.png',
        'assets/scrolly/beat2.png',
        'assets/scrolly/beat3.png',
        'assets/scrolly/beat4.png'
    ];

    let imagesLoaded = 0;
    imagePaths.forEach((path, i) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            scrollyConfig.images[i] = img;
            imagesLoaded++;
            if (imagesLoaded === imagePaths.length) {
                renderScrolly(); // Start rendering
            }
        };
    });

    function renderScrolly() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const totalHeightPx = viewportHeight * 4;
        const progress = Math.min(Math.max(scrollY / totalHeightPx, 0), 1);

        // Resize Canvas to Match Viewport
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Clear Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Determine Cinematic Beat
        let activeBeat = 0;
        if (progress > 0.25) activeBeat = 1;
        if (progress > 0.5) activeBeat = 2;
        if (progress > 0.75) activeBeat = 3;

        // Draw Images with 'Apple-Style' Easing & Zoom
        const currentImg = scrollyConfig.images[activeBeat];
        if (currentImg) {
            const beatProgress = (progress % 0.25) / 0.25;
            const scale = 1 + beatProgress * 0.2; // Subtle 20% zoom
            const opacity = 1 - Math.pow(beatProgress, 2); // Quadratic fade out

            // Draw current frame
            ctx.globalAlpha = 1;
            drawResizedImage(ctx, currentImg, scale);

            // Crossfade with next frame if near threshold
            if (beatProgress > 0.7 && activeBeat < 3) {
                const nextImg = scrollyConfig.images[activeBeat + 1];
                const crossfade = (beatProgress - 0.7) / 0.3;
                ctx.globalAlpha = crossfade;
                drawResizedImage(ctx, nextImg, 1);
            }
        }

        // Manage Narrative Beats Visibility
        updateNarrativeBeats(activeBeat, progress % 0.25);

        // Manage Site Visibility & Transitions
        if (progress >= 0.95) {
            document.body.classList.add('scrolly-finished');
            mainNav.classList.remove('intro-active');
            document.querySelector('.site-content').classList.add('visible');
            document.querySelector('.scrolly-viewport').style.opacity = 1 - (progress - 0.95) * 20;
        } else {
            document.body.classList.remove('scrolly-finished');
            mainNav.classList.add('intro-active');
            document.querySelector('.site-content').classList.remove('visible');
            document.querySelector('.scrolly-viewport').style.opacity = 1;
        }

        requestAnimationFrame(renderScrolly);
    }

    function drawResizedImage(ctx, img, scale) {
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.width;
        const ih = img.height;
        const ratio = Math.max(cw / iw, ch / ih) * scale;
        const nw = iw * ratio;
        const nh = ih * ratio;
        const nx = (cw - nw) / 2;
        const ny = (ch - nh) / 2;
        ctx.drawImage(img, nx, ny, nw, nh);
    }

    function updateNarrativeBeats(activeIndex, beatProgress) {
        document.querySelectorAll('.narrative-beat').forEach((beat, i) => {
            if (i === activeIndex && beatProgress > 0.1 && beatProgress < 0.8) {
                beat.classList.add('active');
            } else {
                beat.classList.remove('active');
            }
        });
    }

    // Initial State Check
    mainNav.classList.add('intro-active');
}

window.addEventListener('load', initScrolly);
window.addEventListener('resize', () => {
    const canvas = document.getElementById('scrolly-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
