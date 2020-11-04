import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import _last from 'lodash/last';
import Link from './Link';

export default function FeedTagBreadcrumbs({ filterTags, getParams }) {
    return (
        <>
            {filterTags && filterTags.length > 0 && (
                <Box mt={1} mb={1}>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} maxItems={5}>
                        <Typography variant="h4">
                            <Link href="/" as={`/?${getParams({ g: '', t: ['-'] })}`}>
                                All Items
                            </Link>
                        </Typography>
                        {filterTags &&
                            filterTags.map((t, n) =>
                                t
                                    .split('~')
                                    .filter(Boolean)
                                    .map((t2, t2n, tsplit) => (
                                        <Typography key={t} variant="h4">
                                            <Link
                                                href="/"
                                                as={`/?${getParams({
                                                    g: '',
                                                    t: [
                                                        ...filterTags.slice(0, n),
                                                        tsplit.slice(0, t2n + 1).join('~') +
                                                            (tsplit.length - 1 !== t2n ? '~' : ''),
                                                    ],
                                                })}`}
                                            >
                                                #{t2}
                                            </Link>
                                        </Typography>
                                    )),
                            )}
                        {_last(filterTags) === '~' && <Typography variant="h4">Tags</Typography>}
                    </Breadcrumbs>
                </Box>
            )}
        </>
    );
}
