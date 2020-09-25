/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-danger */

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import _findIndex from 'lodash/findIndex';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import moment from 'moment';
import { useMemo, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { P } from './Typography';
import DialogActions from './FeedItemDialogActions';

const youTubeRegExp = /https?:\/\/(?:\w+\.)?youtube.com\/watch\?v=([\w\d]+)/;

export default function FeedItemDialog({ feedUrl, feedItems, itemId, getParams }) {
    const router = useRouter();

    const itemIndex = useMemo(() => _findIndex(feedItems || [], (i) => i.id === itemId), [
        feedItems,
        itemId,
    ]);
    const item = useMemo(() => (itemIndex !== -1 ? feedItems[itemIndex] : null), [itemIndex]);

    const close = () => {
        router.replace('/', `/?${getParams({ x: null })}`, { shallow: true });
    };

    const goTo = (i) => {
        if (i && i.id) {
            router.replace('/', `/?${getParams({ x: i.id })}`, { shallow: true });
        }
    };

    const goToFeed = (i) => {
        if (i) {
            router.replace('/', `/?${getParams({ i, p: 1, x: null })}`, { shallow: true });
        }
    };

    useEffect(() => {
        if (window) {
            const listener = (e) => {
                if (e.defaultPrevented || e.isComposing) {
                    return;
                }

                // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
                switch (e.key) {
                    case 'Left':
                    case 'ArrowLeft':
                        goTo(feedItems[itemIndex - 1]);
                        e.preventDefault();
                        break;
                    case 'Right':
                    case 'ArrowRight':
                        goTo(feedItems[itemIndex + 1]);
                        e.preventDefault();
                        break;
                    case 'Esc':
                    case 'Escape':
                        close();
                        e.preventDefault();
                        break;
                    default:
                        break;
                }
            };

            window.addEventListener('keydown', listener);

            return () => {
                window.removeEventListener('keydown', listener);
            };
        }
        return null;
    }, [feedItems, itemIndex]);

    return (
        <Dialog open={Boolean(itemId)} onClose={close} fullWidth maxWidth="md">
            <DialogContent style={{ minHeight: '80vh' }}>
                {item && (
                    <>
                        <Box mb={3}>
                            <DialogActions
                                {...{ feedUrl, feedItems, itemId, itemIndex, item, goTo, close }}
                            />
                        </Box>
                        {item.image && (
                            <div
                                style={{
                                    float: 'left',
                                    margin: '0.2rem 1rem 1rem 0',
                                }}
                            >
                                <Avatar
                                    alt=""
                                    src={item.image}
                                    variant="rounded"
                                    style={{
                                        width: '10vw',
                                        height: '10vw',
                                        maxWidth: '80px',
                                        maxHeight: '80px',
                                    }}
                                />
                            </div>
                        )}
                        <Typography variant="h2">{item.title || itemId}</Typography>
                        {item && item._meta && item._meta.subtitle && (
                            <Box mt={1}>
                                <Typography
                                    variant="h3"
                                    onClick={() =>
                                        goToFeed(item && item._feed_url && item._feed_url.parent)
                                    }
                                    style={{ cursor: 'pointer' }}
                                >
                                    {item._meta.subtitle}
                                </Typography>
                            </Box>
                        )}
                        {item && item.date_published && (
                            <Box mt={1}>
                                <Typography variant="h4">
                                    <em>
                                        {moment
                                            .parseZone(item.date_published)
                                            .format('Do MMM YYYY')}
                                    </em>
                                </Typography>
                            </Box>
                        )}
                        <div style={{ clear: 'left' }}>
                            {item.attachments &&
                                item.attachments
                                    .filter((a) => /^audio/.test(a.mime_type))
                                    .map((attachment) => (
                                        <Box mt={3} mb={2} key={attachment.url}>
                                            <audio controls style={{ width: '100%' }}>
                                                <source
                                                    src={attachment.url}
                                                    type={attachment.mime_type}
                                                />
                                                <a href={attachment.url}>{attachment.url}</a>
                                            </audio>
                                        </Box>
                                    ))}
                            {item.attachments &&
                                item.attachments
                                    .filter((a) => /^video/.test(a.mime_type))
                                    .map((attachment) => (
                                        <Box mt={3} mb={2} key={attachment.url}>
                                            <video
                                                controls
                                                style={{ maxWidth: '100%', maxHeight: '70vh' }}
                                            >
                                                <source
                                                    src={attachment.url}
                                                    type={attachment.mime_type}
                                                />
                                                <a href={attachment.url}>{attachment.url}</a>
                                            </video>
                                        </Box>
                                    ))}
                            {item._youtube && (
                                <Box mt={3} mb={2}>
                                    <div
                                        style={{
                                            position: 'relative',
                                            width: '100%',
                                            height: 0,
                                            paddingBottom: `${Math.round(
                                                (item._youtube.height / item._youtube.width) * 100,
                                            )}%`,
                                        }}
                                    >
                                        <iframe
                                            title={item._youtube.id}
                                            src={`https://www.youtube.com/embed/${item._youtube.id}`}
                                            width={item._youtube.width}
                                            height={item._youtube.height}
                                            style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                left: 0,
                                                top: 0,
                                            }}
                                            allowFullScreen
                                        />
                                    </div>
                                </Box>
                            )}
                            {item.attachments &&
                                item.attachments
                                    .filter((a) => /^image/.test(a.mime_type))
                                    .map((attachment) => (
                                        <Box mt={3} mb={2} key={attachment.url}>
                                            <a href={attachment.url}>
                                                <img
                                                    src={attachment.url}
                                                    title={attachment.url}
                                                    alt=""
                                                    style={{ maxWidth: '100%', maxHeight: '70vh' }}
                                                />
                                            </a>
                                        </Box>
                                    ))}
                            {!item._youtube &&
                                [item.url, item.external_url]
                                    .filter(Boolean)
                                    .filter((url) => youTubeRegExp.test(url))
                                    .map((url) => youTubeRegExp.exec(url)[1])
                                    .map((youtubeId) => (
                                        <Box mt={3} mb={2} key={youtubeId}>
                                            <iframe
                                                title={youtubeId}
                                                src={`https://www.youtube.com/embed/${youtubeId}`}
                                                allowFullScreen
                                                style={{ width: '100%', height: '30vh' }}
                                            />
                                        </Box>
                                    ))}
                            {item.content_html && (
                                <Typography variant="body1">
                                    <div
                                        className="feed-item-dialog-content-html"
                                        dangerouslySetInnerHTML={{
                                            __html: item.content_html,
                                        }}
                                    />
                                </Typography>
                            )}
                            {!item.content_html &&
                                item.content_text &&
                                item.content_text.split(/\n+/).map((p, n) => <P key={n}>{p}</P>)}
                            {item.tags && item.tags.length !== 0 && (
                                <P>
                                    <em>[{item.tags.join(', ')}]</em>
                                </P>
                            )}
                            {item._archive && item._archive.log && item._archive.log.length !== 0 && (
                                <P>
                                    <em>Log: {item._archive.log.join(', ')}</em>
                                </P>
                            )}
                        </div>
                    </>
                )}
                <br />
            </DialogContent>
        </Dialog>
    );
}
