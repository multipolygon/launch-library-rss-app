import Grid from '@material-ui/core/Grid';
import FeedItemCard from './FeedItemCard';

export default function FeedItemsGrid({ items, viewGrid, hideTitle, getParams }) {
    return (
        <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={2}>
            {items &&
                items.length !== 0 &&
                items.map((i) => (
                    <Grid
                        item
                        key={i.id}
                        xs={viewGrid === 'lg' ? 12 : 6}
                        sm={viewGrid === 'lg' ? 6 : 4}
                        md={viewGrid === 'lg' ? 4 : 3}
                    >
                        <FeedItemCard
                            {...i}
                            hideTitle={hideTitle}
                            viewGrid={viewGrid}
                            getParams={getParams}
                        />
                    </Grid>
                ))}
        </Grid>
    );
}
