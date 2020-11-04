/* global process URL */

import IndexIcon from 'mdi-material-ui/FileTree';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import _startCase from 'lodash/startCase';
import { useContext, useState } from 'react';
import LinkIcon from 'mdi-material-ui/LinkVariant';
import FileLinkIcon from 'mdi-material-ui/FileLink';
import FileCogIcon from 'mdi-material-ui/FileCog';
import Link from '../components/Link';
import CategoryIcon from '../components/CategoryIcon';
import { shortUrl, resolveUrl } from '../utils/fetch';
import { UserContext } from '../components/User';
import FeedConfigFormDialog from '../components/FeedConfigFormDialog';
import FileIcon from '../components/FileIcon';
import ButtonGrid from '../components/ButtonGrid';
import FeedWithMap from '../components/FeedWithMap';

const contentHost = new URL(process.env.CONTENT_HOST).host;

const headerButtons = process.env.LIMITED
    ? ['favourite']
    : ['original', 'queue', 'favourite', 'archive'];

const HeaderButton = ({ text, feedUrl }) => {
    const all = new URL(`./${text}.json`, feedUrl).href;
    const index = new URL(`./${text}_index.json`, feedUrl).href;

    return (
        <Grid item>
            <ButtonGroup>
                <Button
                    disabled={process.env.LIMITED && text !== 'favourite'}
                    href="/"
                    as={`/?i=${encodeURIComponent(shortUrl(all))}`}
                    component={Link}
                    variant={feedUrl === all ? 'contained' : 'outlined'}
                    color={feedUrl === all ? 'primary' : undefined}
                    startIcon={<CategoryIcon category={text} />}
                    style={feedUrl === all ? { color: '#FFF' } : {}}
                    size="small"
                >
                    {text}
                </Button>
                <Button
                    disabled={process.env.LIMITED && text !== 'favourite'}
                    href="/"
                    as={`/?i=${encodeURIComponent(shortUrl(index))}`}
                    component={Link}
                    variant={feedUrl === index ? 'contained' : 'outlined'}
                    color={feedUrl === index ? 'primary' : undefined}
                    style={feedUrl === index ? { color: '#FFF' } : {}}
                    size="small"
                >
                    <IndexIcon fontSize="small" />
                </Button>
            </ButtonGroup>
        </Grid>
    );
};

export default function Index() {
    const { user } = useContext(UserContext);
    const [openConfig, setOpenConfig] = useState(false);

    const header = ({ feedUrl }) => {
        const feedUrlHost = feedUrl ? new URL(feedUrl).host : null;

        return (
            <>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    spacing={2}
                >
                    {feedUrl &&
                        headerButtons.map((i) => (
                            <HeaderButton key={i} text={i} feedUrl={feedUrl} />
                        ))}
                </Grid>
                {feedUrl && feedUrlHost === contentHost && shortUrl(feedUrl).split('/').length > 2 && (
                    <Box mt={2.5}>
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} maxItems={5}>
                            {feedUrl &&
                                shortUrl(feedUrl)
                                    .split('/')
                                    .map((v, i, a) =>
                                        i > a.length - 3 ? null : (
                                            /* eslint-disable react/no-array-index-key */
                                            <Link
                                                key={i + v}
                                                href="/"
                                                as={`/?i=${encodeURIComponent(
                                                    `${a.slice(0, i + 1).join('/')}/${a[
                                                        a.length - 1
                                                    ]
                                                        .replace(/_index.json$/, '')
                                                        .replace(/.json$/, '')}_index.json`,
                                                )}`}
                                            >
                                                {v === '.' ? 'All' : _startCase(v)}
                                            </Link>
                                        ),
                                    )}
                            <Link href="/" as={`/?i=${encodeURIComponent(feedUrl)}`}>
                                &nbsp;
                            </Link>
                        </Breadcrumbs>
                    </Box>
                )}
                {feedUrl && feedUrlHost !== contentHost && (
                    <Box mt={2.5}>
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} maxItems={5}>
                            <span>{feedUrl}</span>
                        </Breadcrumbs>
                    </Box>
                )}
            </>
        );
    };

    const subheader = ({ feed, feedUrl }) => (
        <>
            <ButtonGrid justify="flex-start">
                {user && user.token && (
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<FileCogIcon />}
                        color="primary"
                        onClick={() => setOpenConfig(true)}
                    >
                        Edit
                    </Button>
                )}
                {feed && feed._feed_url && feed._feed_url.src && feed.home_page_url && (
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<LinkIcon />}
                        href={feed.home_page_url}
                        target="_blank"
                    >
                        Webpage
                    </Button>
                )}
                {feed && feed._feed_url && feed._feed_url.src && (
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<FileLinkIcon />}
                        href={feed._feed_url.src}
                        target="_blank"
                    >
                        Source
                    </Button>
                )}
                {feedUrl && (
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<FileIcon type="xml" />}
                        href={feedUrl.replace(/\.json$/, '.rss.xml')}
                        target="_blank"
                    >
                        RSS
                    </Button>
                )}
                {feedUrl && (
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<FileIcon type="xml" />}
                        href={feedUrl.replace(/\.json$/, '.atom.xml')}
                        target="_blank"
                    >
                        Atom
                    </Button>
                )}
                {feedUrl && (
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<FileIcon type="json" />}
                        href={feedUrl}
                        target="_blank"
                    >
                        JSON
                    </Button>
                )}
                {/* <Button */}
                {/*     size="small" */}
                {/*     variant="outlined" */}
                {/*     startIcon={<FileIcon type="json" />} */}
                {/*     href={feedUrl.replace(/\.json$/, '.geo.json')} */}
                {/*     target="_blank" */}
                {/* > */}
                {/*     GeoJSON */}
                {/* </Button> */}
            </ButtonGrid>
            <FeedConfigFormDialog open={openConfig} setOpen={setOpenConfig} feedUrl={feedUrl} />
        </>
    );

    return (
        <FeedWithMap
            defaultUrl={resolveUrl('./favourite.json', process.env.CONTENT_HOST)}
            subheader={subheader}
        >
            {header}
        </FeedWithMap>
    );
}
