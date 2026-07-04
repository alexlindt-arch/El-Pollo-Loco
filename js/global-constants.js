// Suppress harmless audio play() rejections (autoplay policy / audio assets
// not bundled via the GitHub import — the .mp3 binaries are not included).
window.addEventListener('unhandledrejection', (e) => {
    const msg = e && e.reason && (e.reason.message || e.reason.name || '');
    if (/not allowed|play|NotAllowed|NotSupported|interrupted|no supported sources/i.test(String(msg))) {
        e.preventDefault();
    }
});

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 480;
const MOST_LEFT_BG = -2;
const MOST_RIGHT_BG = 12;
const NUMBER_OF_BG = MOST_RIGHT_BG - MOST_LEFT_BG + 1;
const WORLD_START = MOST_LEFT_BG * CANVAS_WIDTH;
const WORLD_END = (MOST_RIGHT_BG + 1) * CANVAS_WIDTH - 1;
const WORLD_WIDTH = NUMBER_OF_BG * CANVAS_WIDTH;
const GROUND_Y = 135;