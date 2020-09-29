import { useContext } from 'react';
import FormDialog from './FormDialog';
import { UserContext } from './User';

export default function LogInFormDialog({ open, setOpen }) {
    const { setToken } = useContext(UserContext);

    const fields = {
        username: {},
        password: {
            type: 'password',
        },
    };

    const onSave = ({ body }) => {
        if (body && body.token) {
            setToken(body.token);
        }
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
