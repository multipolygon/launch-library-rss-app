/* global require module process */
/* eslint-disable no-console */

const fs = require('fs');
const _pick = require('lodash/pick');
const manifest = require('./manifest.js');

fs.writeFileSync('./public/manifest.json', JSON.stringify(manifest, null, 1));

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

const nextConfig = {
    env: {
        ..._pick(process.env, publicEnv),
        // SECRETS_JSON is provided by Github Actions Workflow
        ..._pick(process.env.SECRETS_JSON ? JSON.parse(process.env.SECRETS_JSON) : {}, publicEnv),
    },
    exportTrailingSlash: false,
};

console.log(nextConfig.env);

module.exports = nextConfig;
