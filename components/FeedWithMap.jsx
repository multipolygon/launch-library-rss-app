/* global URL URLSearchParams process */
/* eslint-disable react/no-array-index-key */

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useState, useEffect, useMemo, useCallback, useReducer } from 'react';
import Head from 'next/head';
import _stripTags from 'underscore.string/stripTags';
import _startsWith from 'lodash/startsWith';
import _upperFirst from 'lodash/upperFirst';
import _orderBy from 'lodash/orderBy';
import _get from 'lodash/get';
import _pickBy from 'lodash/pickBy';
import _isEqual from 'lodash/isEqual';
import _isArray from 'lodash/isArray';
import _last from 'lodash/last';
import _uniq from 'lodash/uniq';
import _without from 'lodash/without';
import Pagination from '@material-ui/lab/Pagination';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import _toPairs from 'lodash/toPairs';
import _fromPairs from 'lodash/fromPairs';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import { resolveUrl, fetchJson, shortUrl } from '../utils/fetch';
import FeedItemsGrid from './FeedItemsGrid';
import GeoJsonMap from './GeoJsonMap';
import Layout from './Layout';
import { H1, P } from './Typography';
import FeedSortControls from './FeedSortControls';
import FeedFilterControls from './FeedFilterControls';
import FeedItemDialog from './FeedItemDialog';
import FeedTagBreadcrumbs from './FeedTagBreadcrumbs';

const PER_PAGE = 52;

const DEFAULT_SORT_ORDER = 'desc';

const coord = (ary) =>
    ary.reduce((acc, val) => acc && Boolean(parseFloat(val)), true)
        ? ary.map((v) => Math.round(parseFloat(v) * 1000) / 1000)
        : null;

const average = (ary) => ary.reduce((a, b) => a + b, 0) / ary.length;

export const averageCoord = (coordAry) =>
    coord([average(coordAry.map((i) => i[0])), average(coordAry.map((i) => i[1]))]);

function feedParamsReducer(prev, next) {
    return _pickBy(
        {
            ...prev,
            ..._pickBy(next, (v, k) => !_isEqual(v, prev[k])),
        },
        Boolean,
    );
}

export default function FeedWithMap({ defaultUrl, subheader, children }) {
    const [feedUrl, setFeedUrl] = useState();
    const [feedParams, setFeedParams] = useReducer(feedParamsReducer, { page: 1 });
    const [error, setError] = useState(null);
    const [feed, setFeed] = useState({});
    const [feedItems, setFeedItems] = useState([]);
    const [feedNextUrl, setFeedNextUrl] = useState(null);
    const [openDescription, setOpenDescription] = useState(false);

    const router = useRouter();

    const getParams = useCallback(
        ({ i, t, s, o, f, v, q, p, m, x }) => {
            const params = _pickBy(
                {
                    i: shortUrl(i !== undefined ? i : feedUrl),
                    t: (t !== undefined ? t : feedParams.filterTags || []).join('|'),
                    s: s !== undefined ? s : feedParams.itemsSort,
                    o: o !== undefined ? o : feedParams.itemsSortOrder,
                    f: _toPairs(
                        _pickBy(f !== undefined ? f : feedParams.itemsFilter || {}, Boolean),
                    )
                        .map((n) => n.join('~'))
                        .join('|'),
                    v: v !== undefined ? v : feedParams.viewGrid,
                    q: q !== undefined ? q : feedParams.searchText,
                    p: p !== undefined ? p : feedParams.page || 1,
                    m: m !== undefined ? m : feedParams.showMap,
                    x,
                },
                Boolean,
            );
            return new URLSearchParams(params).toString();
        },
        [feedUrl, feedParams],
    );

    const loadUrlQuery = (routerPath) => {
        const { i, t, s, o, f, v, q, p, m, x } = queryString.parse(routerPath.split('?', 2)[1]);
        const url = resolveUrl(i || defaultUrl || '', process.env.CONTENT_HOST);
        setFeedUrl(url);
        const tags = t ? t.split('|') : undefined;
        setFeedParams({
            filterTags: tags,
            itemsSort: s,
            itemsSortOrder: o,
            itemsFilter: f ? _fromPairs(f.split('|').map((n) => n.split('~', 2))) : undefined,
            viewGrid:
                v || (window && window.innerWidth && window.innerWidth < 640 && 'lg') || undefined,
            searchText: q,
            page: parseInt(p || 1, 10) || 1,
            showMap: m,
            itemId: x,
        });
    };

    useEffect(() => {
        loadUrlQuery(router.asPath);
        const handleRouteChange = (url) => {
            loadUrlQuery(url);
        };
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, []);

    const routerReplace = (opt) => {
        router.replace(router.pathname, `${router.pathname}?${getParams(opt)}`, { shallow: true });
        return true;
    };

    useEffect(() => {
        try {
            setTimeout(() => window.scroll({ top: 0 }), 1);
        } catch (e) {
            // failsafe
        }
    }, [feedUrl]);

    useEffect(() => {
        if (window && document && (feedParams.filterTags || feedParams.page)) {
            try {
                const top = document.getElementById('feed-items-grid');
                if (top) {
                    setTimeout(
                        () =>
                            window.scroll({
                                top: top.getBoundingClientRect().top + window.scrollY - 75,
                                behavior: 'smooth',
                            }),
                        1,
                    );
                }
            } catch (e) {
                // failsafe
            }
        }
    }, [feedParams.filterTags, feedParams.page]);

    useEffect(() => {
        setError(null);
        setFeed({});
        setFeedItems([]);
        setFeedNextUrl(null);
        if (feedUrl) {
            fetchJson(feedUrl).then((obj) => {
                if (obj) {
                    const { items, next_url: nextUrl, ...other } = obj;
                    setFeed(other);
                    setFeedItems(items);
                    setFeedNextUrl(nextUrl);
                } else {
                    setError('Nothing to Show');
                }
            });
        }
    }, [feedUrl]);

    useEffect(() => {
        if (feedNextUrl && feedItems.length !== 0) {
            fetchJson(feedNextUrl).then((obj) => {
                if (obj && obj.items && obj.items.length !== 0) {
                    const { items, next_url: nextUrl } = obj;
                    setFeedItems(feedItems.concat(items));
                    setFeedNextUrl(nextUrl);
                } else {
                    setFeedNextUrl(null); // EOL
                }
            });
        }
    }, [feedNextUrl]);

    const filterTags = useMemo(() => {
        if (feedParams && _isArray(feedParams.filterTags) && feedParams.filterTags.length !== 0) {
            if (feedParams.filterTags.length === 1 && feedParams.filterTags[0] === '-') {
                return [];
            }
            return feedParams.filterTags;
        }
        if (
            feed &&
            feed._display &&
            _isArray(feed._display.start_tags) &&
            feed._display.start_tags.length !== 0
        ) {
            return feed._display.start_tags;
        }
        return null;
    }, [feed, feedParams.filterTags]);

    const itemsFiltered = useMemo(() => {
        if (feedItems.length !== 0) {
            let items = feedItems;

            const { itemsFilter } = feedParams;

            if (itemsFilter) {
                Object.keys(itemsFilter).forEach((k) => {
                    if (itemsFilter[k]) {
                        // console.log('Filter: ', itemsFilter[k]);
                        items = items.filter(
                            (i) => (itemsFilter[k] === 'yes') === Boolean(_get(i, k, false)),
                        );
                    }
                });
            }

            if (_isArray(filterTags) && filterTags.length !== 0) {
                const normalFilterTags = filterTags.filter((t) => _last(t) !== '~');

                items = items.filter(
                    ({ tags }) =>
                        tags &&
                        tags.length >= normalFilterTags.length &&
                        normalFilterTags.reduce((acc, ft) => acc && tags.includes(ft), true),
                );

                const groupByTag =
                    _last(filterTags) === '~' || _last(_last(filterTags)) === '~'
                        ? _last(filterTags)
                        : null;

                if (groupByTag) {
                    items = Object.values(
                        items.reduce((acc, item) => {
                            if (item.tags) {
                                item.tags.forEach((tag) => {
                                    if (
                                        tag &&
                                        (groupByTag === '~' || _startsWith(tag, groupByTag)) &&
                                        (!filterTags || !filterTags.includes(tag))
                                    ) {
                                        const rhs = tag.replace(new RegExp(`^${groupByTag}`), '');
                                        const t = rhs.includes('~')
                                            ? `${rhs.split('~', 1)[0]}~`
                                            : rhs;
                                        if (acc[t] === undefined) {
                                            acc[t] = {
                                                id: t,
                                                url: new URL(
                                                    `/?${getParams({
                                                        t: [
                                                            ...normalFilterTags,
                                                            groupByTag === '~' ? t : groupByTag + t,
                                                        ],
                                                    })}`,
                                                    process.env.APP_HOST,
                                                ),
                                                title: _upperFirst(
                                                    t.replace(/_/g, ' ').replace(/~$/, ''),
                                                ),
                                                content_text: '-',
                                                image: item.image,
                                                date_published: item.date_published,
                                                date_modified: item.date_published,
                                                tags: [t],
                                                _geo: {
                                                    allCoordinates:
                                                        item._geo && item._geo.coordinates
                                                            ? [item._geo.coordinates]
                                                            : [],
                                                },
                                                _meta: {
                                                    date: item.date_published.split('T', 1)[0],
                                                    itemCount: 1,
                                                },
                                            };
                                        } else {
                                            /* eslint-disable prefer-destructuring */
                                            acc[t].image = acc[t].image || item.image;
                                            acc[t].date_published = [
                                                acc[t].date_published,
                                                item.date_published,
                                            ].sort()[1];
                                            acc[t].date_modified = [
                                                acc[t].date_modified,
                                                item.date_modified,
                                            ].sort()[1];
                                            if (item._geo && item._geo.coordinates)
                                                acc[t]._geo.allCoordinates.push(
                                                    item._geo.coordinates,
                                                );
                                            acc[t]._meta.date = acc[t].date_published.split(
                                                'T',
                                                1,
                                            )[0];
                                            acc[t]._meta.itemCount += 1;
                                            /* eslint-enable prefer-destructuring */
                                        }
                                    }
                                });
                            }
                            return acc;
                        }, {}),
                    ).map((item) => {
                        /* eslint-disable no-param-reassign */
                        item._geo =
                            item._geo.allCoordinates.length === 0
                                ? null
                                : { coordinates: averageCoord(item._geo.allCoordinates) };
                        /* eslint-enable no-param-reassign */
                        return item;
                    });
                }
            }

            if (feedParams.searchText) {
                items = items.filter(
                    (item) =>
                        item.title &&
                        RegExp(feedParams.searchText.replace(/\./g, '\\.'), 'i').test(item.title),
                );
            }

            return items;
        }
        return [];
    }, [feedItems, feedParams.itemsFilter, filterTags, feedParams.searchText, feedParams.showMap]);

    const uniqItemTags = useMemo(
        () =>
            _uniq(
                (itemsFiltered || [])
                    .slice(0, 500)
                    .reduce((acc, i) => acc.concat(_without(i.tags, filterTags || [])), []),
                [],
            ),
        [itemsFiltered],
    );

    const itemsSorted = useMemo(() => {
        let { itemsSort, itemsSortOrder } = feedParams;
        if (feed && feed._display) {
            if (!itemsSort && feed._display.sort_by) {
                itemsSort = feed._display.sort_by;
            }
            if (!itemsSortOrder && feed._display.sort_order) {
                itemsSortOrder = feed._display.sort_order;
            }
        }
        return !itemsSort
            ? itemsFiltered
            : _orderBy(
                  itemsFiltered,
                  [(i) => _get(i, itemsSort, '')],
                  [itemsSortOrder || DEFAULT_SORT_ORDER],
              );
    }, [itemsFiltered, feedParams.itemsSort, feedParams.itemsSortOrder]);

    const itemsPage = useMemo(
        () => itemsSorted.slice((feedParams.page - 1) * PER_PAGE, feedParams.page * PER_PAGE),
        [itemsSorted, feedParams.page],
    );

    const lastPage = useMemo(() => Math.ceil(itemsFiltered.length / PER_PAGE), [itemsFiltered]);

    const geo = useMemo(
        () => ({
            type: 'FeatureCollection',
            features: itemsFiltered
                .filter(({ _geo }) => _geo && _geo.coordinates)
                .map(({ id, url: itemUrl, title, image, _geo, _meta }) => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: _geo.coordinates,
                    },
                    properties: {
                        id,
                        url: itemUrl,
                        date: _meta && _meta.date,
                        title,
                        image,
                    },
                })),
        }),
        [itemsFiltered],
    );

    return (
        <Layout title={(feed && feed.title) || error || 'Loading...'} href="/">
            {feedUrl && (
                <Head>
                    <link rel="alternate" type="application/json" title="JSON" href={feedUrl} />
                    <link
                        rel="alternate"
                        type="application/geo+json"
                        title="GeoJSON"
                        href={resolveUrl(`./geo.json`, feedUrl)}
                    />
                    <link
                        rel="alternate"
                        type="application/rss+xml"
                        title="RSS"
                        href={resolveUrl(`./index.rss.xml`, feedUrl)}
                    />
                    <link
                        rel="alternate"
                        type="application/atom+xml"
                        title="Atom"
                        href={resolveUrl(`./index.atom.xml`, feedUrl)}
                    />
                </Head>
            )}
            {children && (
                <Box mt={1}>
                    {children({
                        feedUrl,
                        getParams,
                        filterTags,
                        items: itemsFiltered,
                    })}
                </Box>
            )}
            <Box mt={3} style={{ overflowWrap: 'break-word' }}>
                <H1>{feed.title || error || 'Loading...'}</H1>
                {feed && feed.description && (
                    <Collapse
                        in={feed.description.length < 300 || openDescription}
                        timeout="auto"
                        collapsedHeight={feed.description.length < 300 ? 0 : 95}
                    >
                        {feed.description.length >= 300 && (
                            <IconButton
                                onClick={() => setOpenDescription(!openDescription)}
                                style={{
                                    float: 'right',
                                    transform: openDescription ? 'rotate(180deg)' : 'rotate(0deg)',
                                }}
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        )}
                        <Typography variant="body1" component="div">
                            {feed._display && feed._display.description_html && (
                                /* eslint-disable react/no-danger */
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: feed._display.description_html,
                                    }}
                                />
                                /* eslint-enable react/no-danger */
                            )}
                            {(!feed._display || !feed._display.description_html) && (
                                <p>{_stripTags(feed.description)}</p>
                            )}
                        </Typography>
                    </Collapse>
                )}
            </Box>
            {subheader && (
                <Box mt={1}>
                    {subheader({
                        feed,
                        feedUrl,
                        feedParams,
                        getParams,
                        filterTags,
                        items: itemsFiltered,
                    })}
                </Box>
            )}
            <Box mt={1}>
                <FeedFilterControls
                    {...{
                        length: itemsFiltered.length,
                        page: feedParams.page,
                        lastPage,
                        itemsFilter: feedParams.itemsFilter,
                        searchText: feedParams.searchText,
                        filterTags,
                        uniqItemTags,
                        routerReplace,
                    }}
                />
            </Box>
            <FeedTagBreadcrumbs filterTags={filterTags} getParams={getParams} />
            {geo && geo.features && geo.features.length !== 0 && feedParams.showMap !== '-' && (
                <Box mt={1} mb={1}>
                    <GeoJsonMap geo={geo} />
                </Box>
            )}
            <Box>
                <FeedSortControls
                    {...{
                        itemsSort: feedParams.itemsSort,
                        itemsSortOrder: feedParams.itemsSortOrder,
                        defaultSortOrder:
                            (feed && feed._display && feed._display.sort_order) ||
                            DEFAULT_SORT_ORDER,
                        viewGrid: feedParams.viewGrid,
                        showMap: feedParams.showMap,
                        routerReplace,
                    }}
                />
            </Box>
            <div id="top" />
            <Box mt={1} id="feed-items-grid">
                {feed.title && itemsPage.length === 0 && <P>No items.</P>}
                <FeedItemsGrid
                    items={itemsPage}
                    viewGrid={feedParams.viewGrid}
                    hideTitle={filterTags && _last((_last(filterTags) || '').split('~'))}
                    getParams={getParams}
                />
                <FeedItemDialog
                    feedUrl={feedUrl}
                    feedItems={feedItems}
                    itemId={feedParams.itemId}
                    getParams={getParams}
                />
            </Box>
            <Box mt={3}>
                <Pagination
                    count={lastPage}
                    page={feedParams.page}
                    onChange={(e, i) => routerReplace({ p: i })}
                    variant="outlined"
                    shape="rounded"
                />
            </Box>
        </Layout>
    );
}
