import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export const H1 = ({ children }) => (
    <Box mt={0} mb={0}>
        <Typography variant="h1">{children}</Typography>
    </Box>
);

export const H2 = ({ children }) => (
    <Box mt={4} mb={3}>
        <Typography variant="h2">{children}</Typography>
    </Box>
);

export const H3 = ({ children }) => (
    <Box mt={4} mb={3}>
        <Typography variant="h3">{children}</Typography>
    </Box>
);

export const H4 = ({ children }) => (
    <Box mt={4} mb={3}>
        <Typography variant="h4">{children}</Typography>
    </Box>
);

export const P = ({ children }) => (
    <Box my={1}>
        <Typography variant="body1">{children}</Typography>
    </Box>
);

export const Body1 = ({ children }) => (
    <Typography variant="body1" component="span" style={{ display: 'block' }}>
        {children}
    </Typography>
);

export const Body2 = ({ children }) => (
    <Typography variant="body2" component="span" style={{ display: 'block' }}>
        {children}
    </Typography>
);

export const Small = ({ children }) => (
    <Box>
        <Typography variant="body2">{children}</Typography>
    </Box>
);

export const ContentBox = ({ children }) => <Box>{children}</Box>;

export const ContentInner = ({ children }) => <Box my={1}>{children}</Box>;
