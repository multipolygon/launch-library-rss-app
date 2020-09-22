import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import humanize from 'underscore.string/humanize';

export default function Prompt({ open, setOpen, title, onSubmit }) {
    const [text, setText] = useState('');

    useEffect(() => setText(''), [open]);

    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle id="form-dialog-title">
                {humanize(title || '').replace(/s$/, '')}
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    multiline
                    fullWidth
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button disabled={!text} onClick={() => onSubmit(text)}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
