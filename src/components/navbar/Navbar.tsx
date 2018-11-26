import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, FormControl } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import * as React from 'react';

import Main from './Main';
import Routes from './Routes';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        drawer: {
            width: 240,
            flexShrink: 0,
        },
        drawerPaper: {
            width: 240,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing.unit * 3,
            marginTop: 50
        },
        toolbar: theme.mixins.toolbar,
        grow: {
            flexGrow: 1,
        },
        menuButton: {
            marginLeft: -12,
            marginRight: 20,
        }
    });

interface State {
    anchorEl: any;
    openDialog: boolean;
    name: string;
    password: string;
};

class Navbar extends React.Component<WithStyles<typeof styles>, State> {
    state: State = {
        anchorEl: null,
        openDialog: false,
        name: '',
        password: ''
    };

    handleMenu = (event: any) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleCloseDialog = () => {
        this.setState({
            openDialog: false
        });
    };

    handleClick = () => {
        this.setState({
            openDialog: true,
        });
    };

    render(): React.ReactNode {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        const actions = [
            <Button color="primary" onClick={this.handleCloseDialog}>Cancelar</Button>,
            <Button type="submit" color="primary">Logar</Button>,
        ];

        return (
            <div className={classes.root}>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            Catálogo de Peças
                        </Typography>
                        <div>
                            <IconButton onClick={this.handleMenu} color="inherit">
                                <AccountCircle></AccountCircle>
                            </IconButton>
                            <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} onClose={this.handleClose}>
                                <MenuItem onClick={this.handleClick}>Login</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }}>
                    <div className={classes.toolbar} />
                    <List>
                        <Routes></Routes>
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <Main></Main>
                </main>

                <Dialog open={this.state.openDialog} onClose={this.handleCloseDialog}>
                    <DialogTitle>Realizar o Login</DialogTitle>
                    <DialogContent>
                        <form onSubmit={(e) => { e.preventDefault(); alert('Submitted form!'); this.handleClose(); }}>
                            <FormControl fullWidth>
                                <TextField name="email" label="E-mail" value={this.state.name} />
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField name="pwd" type="password" label="Senha" value={this.state.name} />
                            </FormControl>
                            <div style={{ textAlign: 'right', padding: 8, margin: '24px -24px -24px -24px' }}>
                                {actions}
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(Navbar);