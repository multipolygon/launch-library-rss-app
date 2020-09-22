/* global process */

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Head from 'next/head';
import NavHeader from './NavHeader';

export default function Layout({ title, href, windowTitle, children }) {
    return (
        <>
            <Head>
                <title>
                    {[windowTitle, title, process.env.APP_NAME].filter(Boolean).join(' - ')}
                </title>
                <meta property="og:title" content={windowTitle || title} />
            </Head>
            <NavHeader title={title} href={href} />
            <Container maxWidth="md">
                <Box pt={2.5} pb={5}>
                    {children}
                </Box>
            </Container>
        </>
    );
}
