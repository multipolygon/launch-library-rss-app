/* global process */

import Layout from '../components/Layout';
import { ContentBox, H1, P } from '../components/Typography';

export default function About() {
    return (
        <Layout title="About" href="/about/">
            <H1>About</H1>
            <ContentBox>
                <P>{process.env.APP_DESCRIPTION}</P>
                <P>
                    This app is open-source and is hosted on GitHub at:
                    <br />
                    <a href="https://github.com/multipolygon/json-feed-reader-app">
                        github.com/multipolygon/json-feed-reader-app
                    </a>
                </P>
                <P>
                    <a href="/third-party-notices.txt">Third-party notices</a>
                </P>
            </ContentBox>
        </Layout>
    );
}
