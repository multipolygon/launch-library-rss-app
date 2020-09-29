/* global URL */

import { useContext, useState, useEffect } from 'react';
import FormDialog from './FormDialog';
import { FeedbackContext } from './Feedback';

export default function FeedConfigFormDialog({ open, setOpen, feedUrl }) {
    const [, setFeedback] = useContext(FeedbackContext);
    const [data, setData] = useState();

    const fields = {
        configUrl: {
            type: 'hidden',
        },
        config: {
            multiline: true,
            inputProps: {
                wrap: 'soft',
            },
        },
    };

    useEffect(() => {
        setData(null);
        if (open && feedUrl) {
            const configUrl = new URL('./config.yaml', feedUrl).href;
            window
                .fetch(configUrl)
                .then((response) => {
                    if (response.ok) {
                        response
                            .text()
                            .then((config) => {
                                setData({
                                    configUrl,
                                    config,
                                });
                            })
                            .catch(() => {
                                setFeedback({ ok: false, msg: 'Config body error!' });
                            });
                    } else {
                        setFeedback({ ok: false, msg: 'No config!' });
                        setOpen(false);
                    }
                })
                .catch(() => {
                    setFeedback({ ok: false, msg: 'Config request error!' });
                    setOpen(false);
                });
        }
    }, [open, feedUrl]);

    return (
        <>
            <FormDialog
                source={data}
                open={open && Boolean(data)}
                setOpen={setOpen}
                title="Feed Config"
                fields={fields}
                method="POST"
                url="/feed-config"
            />
        </>
    );
}
