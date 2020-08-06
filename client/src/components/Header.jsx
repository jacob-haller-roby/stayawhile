import React from "react";
import {connect} from 'react-redux';
import {AppBar, Avatar, IconButton, MenuItem, Toolbar, Typography, Menu} from "@material-ui/core";
import {Close, ExitToApp} from "@material-ui/icons";
import {login, logout} from "../redux/actionCreators/authActionCreators";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuOpen: false,
            anchorEl: null
        };
        this.handleToggleMenu = this.handleToggleMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.login = this.login.bind(this);
    }

    handleToggleMenu(event) {
        let {currentTarget} = event;
        this.setState(prevState => {
            return {
                menuOpen: !prevState.menuOpen,
                anchorEl: prevState.anchorEl == null ? currentTarget : null
            };
        });
    }

    closeMenu() {
        this.setState({menuOpen: false, anchorEl: null});
    }

    login() {
        this.props.login();
        this.closeMenu();
    }

    render() {
        return (
            <div style={{flexGrow: 1}}>
                <AppBar variant="fixed">
                    <Toolbar>
                        <Typography style={{flexGrow: 1}}>Stay a while....</Typography>
                        <div>
                            <IconButton onClick={this.handleToggleMenu}>
                                <Avatar>J</Avatar>
                            </IconButton>
                            <Menu
                                id="profile-menu"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                keepMounted
                                anchorEl={this.state.anchorEl}
                                open={Boolean(this.state.menuOpen)}
                                onClose={this.closeMenu}
                            >
                                <MenuItem onClick={this.login}>Change Account</MenuItem>
                                <MenuItem onClick={this.props.logout.bind(this)}>
                                    <ExitToApp/>
                                </MenuItem>
                                <MenuItem onClick={this.closeMenu}>
                                    <Close/>
                                </MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
};

export default connect(
    () => {
    },
    (dispatch) => ({
        logout: () => dispatch(logout()),
        login: () => dispatch(login)
    })
)(Header);