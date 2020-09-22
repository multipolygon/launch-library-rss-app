/* eslint-disable react/no-array-index-key */

import Grid from '@material-ui/core/Grid';

export default function ButtonGrid({ justify, alignItems, items, children }) {
    return (
        <Grid
            container
            direction="row"
            justify={justify || 'center'}
            alignItems={alignItems || 'center'}
            spacing={1}
        >
            {items &&
                items.map((i, n) => (
                    <Grid item key={n}>
                        {i}
                    </Grid>
                ))}
            {children &&
                children.map((i, n) => (
                    <Grid item key={n}>
                        {i}
                    </Grid>
                ))}
        </Grid>
    );
}
