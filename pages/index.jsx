/* global process URL */

import IndexIcon from 'mdi-material-ui/FileTree';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import _startCase from 'lodash/startCase';
import Link from '../components/Link';
import CategoryIcon from '../components/CategoryIcon';
import { shortUrl, resolveUrl } from '../utils/fetch';

import FeedWithMap from '../components/FeedWithMap';

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
    return (
        <FeedWithMap defaultUrl={resolveUrl('./favourite.json', process.env.CONTENT_HOST)}>
            {({ feedUrl }) => (
                <>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                        spacing={2}
                    >
                        {feedUrl &&
                            ['original', 'queue', 'favourite', 'archive'].map((i) => (
                                <HeaderButton key={i} text={i} feedUrl={feedUrl} />
                            ))}
                    </Grid>
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
                        </Breadcrumbs>
                    </Box>
                </>
            )}
        </FeedWithMap>
    );
}
