import { useContext } from 'react';
import FormDialog from './FormDialog';
import { UserContext } from './User';

export default function LogInFormDialog({ open, setOpen }) {
    const [, setUser] = useContext(UserContext);

    const fields = {
        username: {},
        password: {
            type: 'password',
        },
    };

    const onSave = ({ body }) => {
        if (body && body.token && window && window.localStorage) {
            window.localStorage.setItem('userToken', body.token);
        }
        setUser(null); // force user reload
    };

    return (
        <>
            <FormDialog
                open={open}
                setOpen={setOpen}
                title="Log In"
                fields={fields}
                method="POST"
                url="/auth"
                onSave={onSave}
            />
        </>
    );
}
