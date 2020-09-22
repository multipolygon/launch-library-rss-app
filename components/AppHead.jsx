/* global process */

export default function AppHead() {
    const href = (src) => `${process.env.ASSET_PREFIX || ''}${src}`;

    return (
        <>
            <link rel="manifest" href={href('/manifest.json')} />

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={process.env.APP_NAME} />
            <meta property="og:description" content={process.env.APP_DESCRIPTION} />

            <meta name="twitter:site" content={process.env.APP_TWITTER} />

            <meta name="application-name" content={process.env.APP_NAME} />
            <meta name="description" content={process.env.APP_DESCRIPTION} />

            <meta name="theme-color" content={process.env.THEME_COLOR} />

            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content={process.env.APP_NAME} />

            <meta name="format-detection" content="telephone=no" />
            <meta name="mobile-web-app-capable" content="yes" />

            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
            />

            <link
                rel="shortcut icon"
                href={href('/icons/transparent/icon128.png')}
                type="image/png"
            />

            <link rel="apple-touch-icon" href={href('/icons/icon32.png')} />
            <link rel="apple-touch-icon" sizes="57x57" href={href('/icons/icon57.png')} />
            <link rel="apple-touch-icon" sizes="72x72" href={href('/icons/icon72.png')} />
            <link rel="apple-touch-icon" sizes="76x76" href={href('/icons/icon76.png')} />
            <link rel="apple-touch-icon" sizes="114x114" href={href('/icons/icon114.png')} />
            <link rel="apple-touch-icon" sizes="120x120" href={href('/icons/icon120.png')} />
            <link rel="apple-touch-icon" sizes="144x144" href={href('/icons/icon144.png')} />
            <link rel="apple-touch-icon" sizes="152x152" href={href('/icons/icon152.png')} />
            <link rel="apple-touch-icon" sizes="180x180" href={href('/icons/icon180.png')} />

            {/* https://appsco.pe/developer/splash-screens */}
            <link
                href="/splashscreens/iphone5_splash.png"
                media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
                rel="apple-touch-startup-image"
            />
            <link
                href="/splashscreens/iphone6_splash.png"
                media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
                rel="apple-touch-startup-image"
            />
            <link
                href="/splashscreens/iphoneplus_splash.png"
                media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)"
                rel="apple-touch-startup-image"
            />
            <link
                href="/splashscreens/iphonex_splash.png"
                media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
                rel="apple-touch-startup-image"
            />
            <link
                href="/splashscreens/iphonexr_splash.png"
                media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
                rel="apple-touch-startup-image"
            />
            <link
                href="/splashscreens/iphonexsmax_splash.png"
                media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
                rel="apple-touch-startup-image"
            />
            <link
                href="/splashscreens/ipad_splash.png"
                media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
                rel="apple-touch-startup-image"
            />
            <link
                href="/splashscreens/ipadpro1_splash.png"
                media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
                rel="apple-touch-startup-image"
            />
            <link
                href="/splashscreens/ipadpro3_splash.png"
                media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
                rel="apple-touch-startup-image"
            />
            <link
                href="/splashscreens/ipadpro2_splash.png"
                media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
                rel="apple-touch-startup-image"
            />
        </>
    );
}
