/* global process module */

module.exports = {
    name: process.env.APP_NAME,
    short_name: process.env.APP_SHORT_NAME,
    theme_color: process.env.THEME_COLOR,
    background_color: process.env.BACKGROUND_COLOR,
    display: 'standalone',
    scope: '.',
    start_url: '/',
    icons: [
        {
            src: '/icons/icon72.png',
            sizes: '72x72',
            type: 'image/png',
        },
        {
            src: '/icons/icon96.png',
            sizes: '96x96',
            type: 'image/png',
        },
        {
            src: '/icons/icon128.png',
            sizes: '128x128',
            type: 'image/png',
        },
        {
            src: '/icons/icon144.png',
            sizes: '144x144',
            type: 'image/png',
        },
        {
            src: '/icons/icon152.png',
            sizes: '152x152',
            type: 'image/png',
        },
        {
            src: '/icons/icon192.png',
            sizes: '192x192',
            type: 'image/png',
        },
        {
            src: '/icons/icon384.png',
            sizes: '384x384',
            type: 'image/png',
        },
        {
            src: '/icons/icon512.png',
            sizes: '512x512',
            type: 'image/png',
        },
    ],
    splash_pages: null,
};
