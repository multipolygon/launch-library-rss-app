/* global process URL */
/* eslint-disable no-alert */
import { withStyles } from '@material-ui/core/styles';
import { useState, useEffect, useContext, useReducer } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import humanize from 'underscore.string/humanize';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { createHash } from 'crypto';
import DialogActions from '@material-ui/core/DialogActions';
import { FeedbackContext } from './Feedback';

export default function FormDialog({
    open,
    setOpen,
    title,
    description,
    fields,
    namespace,
    method,
    url,
    source,
    setSource,
    onSave,
    saveButtonText = 'Submit',
}) {
    const [data, updateData] = useReducer((obj1, obj2) => ({ ...obj1, ...obj2 }), {});
    const [active, setActive] = useState(false);
    const [, setFeedback] = useContext(FeedbackContext);
    const [errors, setErrors] = useState({});
    const [openErrorsDialog, setOpenErrorsDialog] = useState(false);

    const getFieldValues = (obj) =>
        Object.keys(fields).reduce(
            (acc, f) => ({ ...acc, [f]: (obj || {})[f] || fields[f].default || '' }),
            {},
        );

    useEffect(() => {
        if (open) {
            updateData(getFieldValues(source));
            setErrors({});
            setOpenErrorsDialog(false);
            setActive(false);
        }
    }, [open]);

    const passwordDigest = (password) =>
        createHash('sha256').update(`${process.env.PASSWORD_SALT}${password}`).digest('base64');

    const cancel = () => {
        setOpen(false);
        setActive(false);
    };

    const save = () => {
        if (!active) {
            setActive(true);
            const token =
                (window && window.localStorage && window.localStorage.getItem('userToken')) || '-';
            /* eslint-disable camelcase */
            const { password, password_confirmation } = data;
            const bodyData =
                password || password_confirmation
                    ? {
                          ...data,
                          password: password ? passwordDigest(password) : null,
                          password_confirmation: password_confirmation
                              ? passwordDigest(password_confirmation)
                              : null,
                      }
                    : { ...data };
            /* eslint-enable camelcase */
            setTimeout(
                () =>
                    window
                        .fetch(new URL(url, process.env.API_HOST).href, {
                            method: method || 'POST',
                            mode: 'cors',
                            cache: 'no-cache',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                utf8: '✓',
                                ...(namespace
                                    ? {
                                          [namespace]: bodyData,
                                      }
                                    : bodyData),
                            }),
                        })
                        .then((response) => {
                            response
                                .json()
                                .then((body) => {
                                    setActive(false);
                                    if (response.ok) {
                                        setOpen(false);
                                        setFeedback({
                                            ok: true,
                                            msg: (body && body.message) || 'Success.',
                                        });
                                        if (setSource) {
                                            setSource({
                                                ...source,
                                                ...data,
                                            });
                                        }
                                        if (onSave) {
                                            onSave({ data, body });
                                        }
                                    } else {
                                        setFeedback({ ok: false, msg: 'Not saved!' });
                                        setErrors(body.errors || {});
                                        setOpenErrorsDialog(true);
                                    }
                                })
                                .catch(() => {
                                    setActive(false);
                                    setFeedback({ ok: false, msg: 'Response error!' });
                                });
                        })
                        .catch(() => {
                            setActive(false);
                            setFeedback({ ok: false, msg: 'Request failed!' });
                        }),
                500,
            );
        }
    };

    const BlackCircularProgress = withStyles({
        root: {
            color: '#000',
        },
    })(CircularProgress);

    return (
        <>
            <Dialog
                open={errors && Object.keys(errors).length !== 0 && openErrorsDialog}
                onClose={() => setOpenErrorsDialog(false)}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Please Review</DialogTitle>
                <DialogContent>
                    {Object.keys(errors).map((k) => (
                        <Typography variant="body1">
                            <strong>{k}:</strong> {errors[k].join(', ')}
                        </Typography>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenErrorsDialog(false)} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {description && (
                        <Box mb={3}>
                            <Typography variant="body1">{description}</Typography>
                        </Box>
                    )}
                    {Object.keys(fields)
                        .filter((k) => fields[k].type !== 'hidden')
                        .map((k) => (
                            <Box key={k} mb={3}>
                                {fields[k].type !== 'checkbox' && (
                                    <>
                                        <TextField
                                            label={fields[k].label || humanize(k)}
                                            type={fields[k].type || 'text'}
                                            inputProps={fields[k].inputProps || {}}
                                            name={k}
                                            value={data[k]}
                                            onChange={(e) => updateData({ [k]: e.target.value })}
                                            error={errors[k] !== undefined}
                                            helperText={
                                                errors[k] !== undefined
                                                    ? errors[k][0]
                                                    : fields[k].helperText
                                            }
                                            placeholder={fields[k].placeholder}
                                            autoFocus={fields[k].autoFocus}
                                            multiline={fields[k].multiline}
                                            InputLabelProps={fields[k].InputLabelProps}
                                            required={fields[k].required}
                                            variant="outlined"
                                            size="small"
                                            style={{ width: '100%' }}
                                            fullWidth
                                        />
                                    </>
                                )}
                                {fields[k].type === 'checkbox' && (
                                    <FormControl
                                        required={fields[k].required}
                                        error={errors[k] !== undefined}
                                    >
                                        <FormControlLabel
                                            label={fields[k].label || humanize(k)}
                                            control={
                                                <Checkbox
                                                    checked={data[k] === '1'}
                                                    onChange={(e) =>
                                                        updateData({
                                                            [k]: e.target.checked ? '1' : '0',
                                                        })
                                                    }
                                                    color="primary"
                                                />
                                            }
                                        />
                                        <FormHelperText>
                                            {errors[k] !== undefined
                                                ? errors[k][0]
                                                : fields[k].helperText}
                                        </FormHelperText>
                                    </FormControl>
                                )}
                            </Box>
                        ))}
                    <Box mb={3} style={{ textAlign: 'right' }}>
                        <Button onClick={cancel}>Cancel</Button>{' '}
                        <Button onClick={save}>
                            {(active && <BlackCircularProgress size={20} />) || saveButtonText}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
