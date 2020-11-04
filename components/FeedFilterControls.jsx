import _pickBy from 'lodash/pickBy';
import IconButton from '@material-ui/core/IconButton';
import ImageIcon from 'mdi-material-ui/Camera';
import MapMarkerIcon from 'mdi-material-ui/MapMarkerCheckOutline';
import TagIcon from 'mdi-material-ui/Tag';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useRef, useEffect } from 'react';
import Hidden from '@material-ui/core/Hidden';
import _last from 'lodash/last';

const filterNext = {
    undefined: 'yes',
    yes: 'no',
    no: undefined,
};

export default function FeedSortControls({
    length,
    page,
    lastPage,
    itemsFilter,
    searchText,
    filterTags,
    uniqItemTags,
    routerReplace,
}) {
    const searchTimeout = useRef(null);
    const searchFieldRef = useRef();

    const filterOptions = {
        Image: 'image',
        Location: '_geo.coordinates',
    };

    const filterIcons = {
        Image: <ImageIcon />,
        Location: <MapMarkerIcon />,
    };

    const updateSearchText = (event) => {
        const { value } = event.target;
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => routerReplace({ q: value }), 1000);
    };

    useEffect(() => {
        if (searchText && searchFieldRef.current && !searchFieldRef.current.value) {
            searchFieldRef.current.value = searchText;
        }
    }, [searchFieldRef, searchText]);

    return (
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            alignContent="center"
            spacing={1}
        >
            <Grid item>
                <IconButton
                    edge="start"
                    onClick={() =>
                        routerReplace({
                            t:
                                filterTags && _last(filterTags) === '~'
                                    ? filterTags.slice(0, filterTags.length - 1)
                                    : [...(filterTags || []), '~'],
                        })
                    }
                >
                    <Badge
                        badgeContent={uniqItemTags.length}
                        invisible={uniqItemTags.length === 0}
                        color={filterTags && _last(filterTags) === '~' ? 'primary' : 'default'}
                        style={{
                            color:
                                filterTags && _last(filterTags) === '~'
                                    ? process.env.THEME_COLOR
                                    : 'inherit',
                        }}
                    >
                        <TagIcon />
                    </Badge>
                </IconButton>
            </Grid>
            {Object.keys(filterOptions).map((i) => (
                <Grid item key={i}>
                    <IconButton
                        edge="start"
                        onClick={() =>
                            routerReplace({
                                f: _pickBy(
                                    {
                                        ...(itemsFilter || {}),
                                        [filterOptions[i]]:
                                            filterNext[
                                                itemsFilter &&
                                                    itemsFilter[filterOptions[i] || undefined]
                                            ],
                                    },
                                    Boolean,
                                ),
                            })
                        }
                    >
                        <Badge
                            badgeContent={(itemsFilter && itemsFilter[filterOptions[i]]) || ''}
                            invisible={!itemsFilter || !itemsFilter[filterOptions[i]]}
                            color="primary"
                            style={{
                                color:
                                    itemsFilter && itemsFilter[filterOptions[i]]
                                        ? process.env.THEME_COLOR
                                        : 'inherit',
                            }}
                        >
                            {filterIcons[i]}
                        </Badge>
                    </IconButton>
                </Grid>
            ))}
            <Grid item>
                <TextField
                    inputRef={searchFieldRef}
                    defaultValue=""
                    size="small"
                    onChange={updateSearchText}
                    placeholder="Search"
                    style={{ width: '100px' }}
                />
            </Grid>
            <Grid item>
                <Button disabled title={`${length} items`}>
                    {length} items
                </Button>
            </Grid>
            <Hidden xsDown>
                <Grid item>
                    <Button disabled title={`Page ${page} of ${lastPage}`}>
                        Page {page}/{lastPage}
                    </Button>
                </Grid>
            </Hidden>
        </Grid>
    );
}
