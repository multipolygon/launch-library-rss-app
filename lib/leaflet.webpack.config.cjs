const path = require('path');

module.exports = {
    mode: 'production',
    target: 'web',
    entry: './lib/leaflet.mjs',
    output: {
        filename: 'leaflet.js',
        path: path.resolve(__dirname, '..', 'public'),
    },
};
