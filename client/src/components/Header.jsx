import React from "react";
import {connect} from 'react-redux';
import {AppBar, Avatar, IconButton, MenuItem, Toolbar, Typography, Menu} from "@material-ui/core";
import {Close, ExitToApp} from "@material-ui/icons";
import {login, logout, getProfile} from "../redux/actionCreators/authActionCreators";
import {
    profileImageUrlSelector,
    profileNameSelector
} from "../redux/selectors/selectors";

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

    componentDidMount() {
        this.props.getProfile();
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

    renderAvatar() {
        if (this.props.profileImageUrl) {
            return (
                <Avatar src={this.props.profileImageUrl}/>
            );
        } else {
            return (
                <Avatar>{this.props.profileName.charAt(0)}</Avatar>
            );
        }
    }

    render() {
        return (
            <div style={{flexGrow: 1}}>
                <AppBar variant="fixed">
                    <Toolbar>
                        <Typography style={{flexGrow: 1}}>Stay a while....</Typography>
                        <div>
                            <IconButton onClick={this.handleToggleMenu}>
                                {this.renderAvatar()}
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
    (state) => ({
        profileImageUrl: profileImageUrlSelector(state),
        profileName: profileNameSelector(state)
    }),
    (dispatch) => ({
        logout: () => dispatch(logout()),
        login: () => dispatch(login),
        getProfile: () => dispatch(getProfile())
    })
)(Header);