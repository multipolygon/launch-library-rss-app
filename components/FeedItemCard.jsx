/* global process URL */

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import StarIcon from 'mdi-material-ui/StarOutline';
import ItemIcon from 'mdi-material-ui/Eye';
import ImageIcon from 'mdi-material-ui/Camera';
import TextIcon from 'mdi-material-ui/TextSubject';
import VideoIcon from 'mdi-material-ui/Video';
import LinkIcon from 'mdi-material-ui/LinkVariant';
import YoutubeIcon from 'mdi-material-ui/Youtube';
import AudioIcon from 'mdi-material-ui/VolumeHigh';
import MapMarkerCheck from 'mdi-material-ui/MapMarkerCheckOutline';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import UserIcon from 'mdi-material-ui/Account';
import TagIcon from 'mdi-material-ui/Tag';
import queryString from 'query-string';
import { useRouter } from 'next/router';
import _truncate from 'lodash/truncate';

const icons = {
    itemCount: <ItemIcon />,
    userCount: <UserIcon />,
    imageCount: <ImageIcon />,
    videoCount: <VideoIcon />,
    audioCount: <AudioIcon />,
    youtubeCount: <YoutubeIcon />,
    tagCount: <TagIcon />,
};

export default function FeedItemCard({
    id,
    url,
    title,
    image,
    date_published: datePublished,
    author,
    _geo,
    _meta,
    hideTitle,
    viewGrid,
    getParams,
}) {
    const router = useRouter();

    const click = () => {
        if (url) {
            const href = new URL(url);
            if (href.host === new URL(process.env.APP_HOST).host && href.pathname === '/') {
                const { i, t } = queryString.parse(href.search);
                if (i) {
                    router.push('/', `/?${getParams({ i, t: t ? t.split('|') : undefined })}`, {
                        shallow: true,
                    });
                    return;
                }
            }
        }
        router.push('/', `/?${getParams({ x: id })}`, { shallow: true });
    };

    return (
        <Card>
            <CardActionArea onClick={click}>
                {image && (
                    <CardMedia
                        style={{
                            height: viewGrid === 'lg' ? '260px' : '140px',
                            lineHeight: viewGrid === 'lg' ? '260px' : '140px',
                            backgroundColor: '#EEE',
                            textAlign: 'center',
                            color: '#888',
                        }}
                        image={image}
                    >
                        {!image && url && <LinkIcon />}
                        {!image && !url && <TextIcon />}
                    </CardMedia>
                )}
                <CardContent>
                    <Typography variant="body2" component="div" style={{ margin: 0 }}>
                        {(_meta && _meta.date) ||
                            (datePublished || '').split('T', 1)[0] ||
                            'No date'}
                        {_geo && _geo.coordinates && (
                            <MapMarkerCheck
                                style={{ fontSize: 12, color: '#555', marginLeft: '3px' }}
                            />
                        )}
                        {_meta && _meta.featured && (
                            <StarIcon style={{ fontSize: 12, color: '#555', marginLeft: '3px' }} />
                        )}
                    </Typography>
                    {author && author.name && (
                        <Typography
                            variant="body2"
                            component="div"
                            style={{ margin: 0, fontWeight: 500 }}
                        >
                            {author.name}
                        </Typography>
                    )}
                    {title && title !== hideTitle && (
                        <>
                            <Typography variant="h2" component="div">
                                {_truncate(title, { length: 140 })}
                            </Typography>
                            {_meta && _meta.subtitle && (
                                <Box mt={0.5}>
                                    <Typography
                                        variant="h4"
                                        component="div"
                                        style={{ color: 'grey' }}
                                    >
                                        {_meta.subtitle}
                                    </Typography>
                                </Box>
                            )}
                        </>
                    )}
                    <Box mt={1}>
                        {_meta && (
                            <>
                                {Object.keys(icons).map(
                                    (i) =>
                                        (_meta[i] && _meta[i] !== 0 && (
                                            <Chip
                                                key={i}
                                                size="small"
                                                icon={icons[i]}
                                                label={_meta[i]}
                                                style={{
                                                    backgroundColor: '#FFF',
                                                }}
                                            />
                                        )) ||
                                        '',
                                )}
                            </>
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
