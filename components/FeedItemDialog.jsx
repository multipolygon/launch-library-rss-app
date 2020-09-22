/* global URL process */
/* eslint-disable react/no-array-index-key */

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import _findIndex from 'lodash/findIndex';
import { useRouter } from 'next/router';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import OpenIcon from 'mdi-material-ui/OpenInNew';
import CloseIcon from 'mdi-material-ui/Close';
import FavouriteIcon from 'mdi-material-ui/Star';
import ArchiveIcon from 'mdi-material-ui/Archive';
import QueueIcon from 'mdi-material-ui/InboxArrowDown';
import LeftIcon from 'mdi-material-ui/ChevronLeft';
import RightIcon from 'mdi-material-ui/ChevronRight';
import Box from '@material-ui/core/Box';
import moment from 'moment';
import { useMemo, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { P } from './Typography';

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

    const goToFeed = (f) => {
        if (f) {
            router.replace('/', `/?${getParams({ f, p: 1, x: null })}`, { shallow: true });
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

    const action = (i, addOrRem, bucket, favourite) => {
        if (i && window) {
            const token =
                (window && window.localStorage && window.localStorage.getItem('userToken')) || null;

            window
                .fetch(new URL('/actions/new', process.env.API_HOST).href, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token
                            ? {
                                  Authorization: `Bearer ${token}`,
                              }
                            : {}),
                    },
                    body: JSON.stringify({
                        feedPath: ((i && i._feed_url && i._feed_url.parent) || feedUrl).replace(
                            process.env.CONTENT_HOST_DEV || process.env.CONTENT_HOST,
                            '',
                        ),
                        id: (i && i._id && i._id.parent) || itemId,
                        action: addOrRem,
                        bucket,
                        favourite,
                    }),
                })
                .then(() => {
                    // todo
                })
                .catch(() => {
                    // todo
                });
        }
    };

    return (
        <Dialog open={Boolean(itemId)} onClose={close} fullWidth maxWidth="md">
            <DialogTitle>
                {item && item.image && (
                    <Avatar
                        alt=""
                        src={item.image}
                        variant="rounded"
                        style={{
                            float: 'left',
                            width: '65px',
                            height: '65px',
                            marginRight: '15px',
                        }}
                    />
                )}
                <IconButton
                    onClick={close}
                    variant="outlined"
                    style={{ float: 'right', marginTop: '-7px', marginRight: '-14px' }}
                >
                    <CloseIcon />
                </IconButton>
                {(item && item.title) || itemId}
                {item && item._meta && item._meta.subtitle && (
                    <small
                        onClick={() => goToFeed(item && item._feed_url && item._feed_url.parent)}
                    >
                        <br />
                        {item._meta.subtitle}
                    </small>
                )}
            </DialogTitle>
            <DialogContent>
                {item && (
                    <>
                        {item && item.date_published && (
                            <P>
                                <strong>
                                    {moment.parseZone(item.date_published).format('Do MMM YYYY')}
                                </strong>
                            </P>
                        )}
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

                        {item.content_text &&
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
                    </>
                )}
            </DialogContent>
            <DialogActions>
                {item && (
                    <>
                        {item.url && (
                            <Button
                                startIcon={<OpenIcon />}
                                href={item.url}
                                target="_blank"
                                variant="outlined"
                            >
                                Open
                            </Button>
                        )}
                        <ButtonGroup>
                            <Button
                                disabled={process.env.LIMITED}
                                onClick={() => action(item, 'add', 'queue')}
                                startIcon={<QueueIcon />}
                            >
                                Queue
                            </Button>
                            <Button
                                disabled={process.env.LIMITED}
                                onClick={() => action(item, 'rem', 'queue')}
                                style={{ padding: 0 }}
                            >
                                <CloseIcon fontSize="small" />
                            </Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button
                                disabled={process.env.LIMITED}
                                onClick={() => action(item, 'add', 'archive')}
                                startIcon={<ArchiveIcon />}
                            >
                                Archive
                            </Button>
                            <Button
                                disabled={process.env.LIMITED}
                                onClick={() => action(item, 'rem', 'archive')}
                                style={{ padding: 0 }}
                            >
                                <CloseIcon fontSize="small" />
                            </Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button
                                disabled={process.env.LIMITED}
                                onClick={() => action(item, 'add', 'archive', true)}
                                startIcon={<FavouriteIcon />}
                            >
                                Favourite
                            </Button>
                            <Button
                                disabled={process.env.LIMITED}
                                onClick={() => action(item, 'add', 'archive', false)}
                                style={{ padding: 0 }}
                            >
                                <CloseIcon fontSize="small" />
                            </Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button
                                disabled={itemIndex === -1}
                                onClick={() => goTo(feedItems[itemIndex - 1])}
                            >
                                <LeftIcon />
                            </Button>
                            <Button
                                disabled={itemIndex === -1 || itemIndex === feedItems.length - 1}
                                onClick={() => goTo(feedItems[itemIndex + 1])}
                            >
                                <RightIcon />
                            </Button>
                        </ButtonGroup>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}
