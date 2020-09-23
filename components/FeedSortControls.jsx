import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import SortAscendingIcon from 'mdi-material-ui/SortAlphabeticalAscending';
import SortDescendingIcon from 'mdi-material-ui/SortAlphabeticalDescending';
import MapOnIcon from 'mdi-material-ui/Earth';
import MapOffIcon from 'mdi-material-ui/EarthOff';
import GridLargeIcon from 'mdi-material-ui/GridLarge';
import GridIcon from 'mdi-material-ui/Grid';
import Grid from '@material-ui/core/Grid';

export default function FeedSortControls({
    itemsSort,
    itemsSortOrder,
    defaultSortOrder,
    viewGrid,
    showMap,
    routerReplace,
}) {
    const sortOptions = {
        Title: 'title',
        'Date Published': 'date_published',
        'Date Modified': 'date_modified',
        // Meta:
        Date: '_meta.date',
        Featured: '_meta.featured',
        Items: '_meta.itemCount',
        Photos: '_meta.imageCount',
        Videos: '_meta.videoCount',
        Audio: '_meta.audioCount',
        Ids: '_meta.idCount',
        Tags: '_meta.tagsCount',
        Location: '_geo.coordinates',
        Users: '_meta.userCount',
    };

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
                <Select
                    value={itemsSort || 'default'}
                    onChange={(event) =>
                        routerReplace({
                            s: event.target.value === 'default' ? null : event.target.value,
                        })
                    }
                    label="Sort"
                    autoWidth
                    defaultValue="default"
                >
                    <MenuItem value="default">
                        <em>Sort</em>
                    </MenuItem>
                    {Object.keys(sortOptions).map((i) => (
                        <MenuItem key={i} value={sortOptions[i]}>
                            {i}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid item>
                <IconButton
                    color={
                        itemsSortOrder && itemsSortOrder !== defaultSortOrder
                            ? 'primary'
                            : undefined
                    }
                    onClick={() =>
                        routerReplace({
                            o: (itemsSortOrder || defaultSortOrder) === 'asc' ? 'desc' : 'asc',
                        })
                    }
                >
                    {(itemsSortOrder || defaultSortOrder) === 'asc' && <SortAscendingIcon />}
                    {(itemsSortOrder || defaultSortOrder) !== 'asc' && <SortDescendingIcon />}
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    color={viewGrid === 'lg' ? 'primary' : undefined}
                    onClick={() => routerReplace({ v: viewGrid === 'lg' ? 'sm' : 'lg' })}
                >
                    {viewGrid === 'lg' && <GridLargeIcon />}
                    {viewGrid !== 'lg' && <GridIcon />}
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    color={showMap === '-' ? 'primary' : undefined}
                    onClick={() => routerReplace({ m: showMap === '-' ? '' : '-' })}
                >
                    {showMap === '-' && <MapOffIcon />}
                    {showMap !== '-' && <MapOnIcon />}
                </IconButton>
            </Grid>
        </Grid>
    );
}
