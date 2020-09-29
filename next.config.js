/* global require module process */
/* eslint-disable no-console */

const fs = require('fs');
const _ = require('lodash');
const LicenseCheckerWebpackPlugin = require('license-checker-webpack-plugin');
const manifest = require('./manifest.js');

fs.writeFileSync('./public/manifest.json', JSON.stringify(manifest, null, 1));

if (process.env.SECRETS_JSON) {
    // SECRETS_JSON is provided by Github Actions Workflow
    console.log('GitHub secrets:');
    console.log(JSON.parse(process.env.SECRETS_JSON));
}

const publicEnv = ['.env', '.env.production'].reduce(
    (acc, f) =>
        acc.concat(
            fs
                .readFileSync(f)
                .toString()
                .split('\n')
                .map((i) => i.trim())
                .filter(Boolean)
                .map((i) => i.split('=', 1)[0]),
        ),
    [],
);

console.log(
    'WARNING: The following settings will be available in the browser for everyone to see:',
);
console.log(publicEnv);

const nextConfig = {
    env: {
        ..._.pick(process.env, publicEnv),
        ..._.pick(process.env.SECRETS_JSON ? JSON.parse(process.env.SECRETS_JSON) : {}, publicEnv),
    },
    exportTrailingSlash: false,
    webpack: (config, { dev }) => {
        if (!dev) {
            config.plugins.push(
                new LicenseCheckerWebpackPlugin({
                    outputFilename: '../public/third-party-notices.txt',
                }),
            );
        }
        return config;
    },
};

console.log(nextConfig.env);

module.exports = nextConfig;
