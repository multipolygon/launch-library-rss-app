import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Link from '../components/Link';
import Layout from '../components/Layout';
import { H1, P } from '../components/Typography';

export default function Four04() {
    return (
        <Layout title="Not Found" href="/help/">
            <Box component={Paper} mt={3} p={2}>
                <H1>Page Not Found</H1>
                <br />
                <P>
                    <Button color="primary" variant="outlined" component={Link} href="/" as="/">
                        Home Page
                    </Button>
                </P>
            </Box>
        </Layout>
    );
}
