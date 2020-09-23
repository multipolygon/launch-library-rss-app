/* global process */

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from 'mdi-material-ui/VectorPolygon';
import Box from '@material-ui/core/Box';
import React, { useState, useContext } from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from 'mdi-material-ui/Home';
import LogInIcon from 'mdi-material-ui/Login';
import LogOutIcon from 'mdi-material-ui/Logout';
import AboutIcon from 'mdi-material-ui/Information';
import Link from './Link';
import LogInFormDialog from './LogInFormDialog';
import { UserContext } from './User';

export default function NavHeader() {
    const [drawerIsOpen, openDrawer] = useState(false);
    const [openLogInForm, setOpenLogInForm] = useState(false);

    const [user, setUser] = useContext(UserContext);

    const logOut = () => {
        if (window && typeof window === 'object') {
            window.localStorage.removeItem('userToken');
        }
        setUser({});
    };

    return (
        <>
            <AppBar position="fixed">
                <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" onClick={() => openDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Box ml={1}>
                        <Link
                            href="/"
                            style={{
                                color: 'white',
                                fontSize: '20px',
                                lineHeight: '20px',
                                fontWeight: 500,
                            }}
                        >
                            {process.env.APP_NAME}
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar variant="dense" />
            <Drawer anchor="left" open={drawerIsOpen} onClose={() => openDrawer(false)}>
                <div
                    role="presentation"
                    onClick={() => openDrawer(false)}
                    onKeyDown={() => openDrawer(false)}
                    style={{ width: '250px' }}
                >
                    <List component="nav">
                        <ListItem button component={Link} href="/">
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                        {process.env.API_HOST && (
                            <>
                                {user && !user.name && (
                                    <ListItem button onClick={() => setOpenLogInForm(true)}>
                                        <ListItemIcon>
                                            <LogInIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Log In" />
                                    </ListItem>
                                )}
                                {user && user.name && (
                                    <ListItem button onClick={logOut}>
                                        <ListItemIcon>
                                            <LogOutIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Log Out" />
                                    </ListItem>
                                )}
                            </>
                        )}
                        <ListItem button component={Link} href="/about" as="/about">
                            <ListItemIcon>
                                <AboutIcon />
                            </ListItemIcon>
                            <ListItemText primary="About" />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
            <LogInFormDialog open={openLogInForm} setOpen={setOpenLogInForm} />
        </>
    );
}
