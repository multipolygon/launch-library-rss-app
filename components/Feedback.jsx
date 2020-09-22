import { createContext, useReducer } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

export const FeedbackContext = createContext([null, () => null]);

export const FeedbackContextProvider = ({ children }) => {
    const [feedback, setFeedback] = useReducer(
        (state, { show = true, ok = true, msg = '' }) => ({ show, ok, msg }),
        { show: false, ok: true, msg: '' },
    );

    return (
        <FeedbackContext.Provider value={[feedback, setFeedback]}>
            {children}
            <Snackbar
                open={feedback.show}
                autoHideDuration={10000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={() => {
                    setFeedback({ ...feedback, show: false });
                }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    severity={feedback.ok ? 'success' : 'error'}
                    onClose={() => {
                        setFeedback({ ...feedback, show: false });
                    }}
                >
                    {feedback.msg}
                </MuiAlert>
            </Snackbar>
        </FeedbackContext.Provider>
    );
};
