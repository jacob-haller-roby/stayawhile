import React from "react";
import {connect} from 'react-redux';
import {
    AppBar,
    Avatar,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from "@material-ui/core";
import {
    ChevronLeft,
    Close,
    ExitToApp,
    List as ListIcon,
    MeetingRoom,
    MusicNote,
    NoMeetingRoom
} from "@material-ui/icons";
import {getProfile, login, logout} from "../redux/actionCreators/authActionCreators";
import {
    currentRoomSelector,
    profileImageUrlSelector,
    profileNameSelector,
    roomsSelector
} from "../redux/selectors/selectors";
import {attendRoom, departRoom, getMyRooms} from "../redux/actionCreators/roomActionCreators";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profileMenuOpen: false,
            profileAnchorEl: null,
            drawerOpen: true
        };
        this.handleToggleProfileMenu = this.handleToggleProfileMenu.bind(this);
        this.closeProfileMenu = this.closeProfileMenu.bind(this);
        this.handleToggleDrawer = this.handleToggleDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        this.props.getProfile();
        this.props.getMyRooms();
    }

    handleToggleDrawer() {
        this.setState(prevState => {
            return {
                drawerOpen: !prevState.drawerOpen
            };
        });
    }

    closeDrawer() {
        this.setState({drawerOpen: false});
    }

    handleToggleProfileMenu(event) {
        let {currentTarget} = event;
        this.setState(prevState => {
            return {
                profileMenuOpen: !prevState.profileMenuOpen,
                profileAnchorEl: prevState.profileAnchorEl == null ? currentTarget : null
            };
        });
    }

    closeProfileMenu() {
        this.setState({profileMenuOpen: false, profileAnchorEl: null});
    }

    login() {
        this.props.login();
        this.closeProfileMenu();
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

    renderRoomList() {
        return (
            <List component="nav">
                <ListItem button key="close-drawer" onClick={this.closeDrawer}>
                    <ListItemIcon><ChevronLeft/></ListItemIcon>
                    <ListItemText primary="Collapse Menu"/>
                </ListItem>
                <Divider/>
                {this.props.myRooms && this.props.myRooms.map(room => {
                    let isCurrentRoom = this.props.currentRoom && this.props.currentRoom.id === room.id;
                    return (
                        <ListItem
                            button
                            key={room.title}
                            onClick={() => this.props.attendRoom(room.id)}
                            selected={isCurrentRoom}
                        >
                            <ListItemIcon>{isCurrentRoom ? <MusicNote/> : <MeetingRoom/>}</ListItemIcon>
                            <ListItemText primary={room.title}/>
                        </ListItem>
                    );
                })}
                <Divider/>
                {
                    this.props.currentRoom &&
                    <ListItem button key="depart" onClick={() => this.props.departRoom()}>
                        <ListItemIcon><NoMeetingRoom/></ListItemIcon>
                        <ListItemText primary="Exit Current Room"/>
                    </ListItem>
                }
            </List>
        )
    }

    render() {
        return (
            <React.Fragment>
                <Drawer
                    variant="persistent"
                    anchor="left"
                    open={this.state.drawerOpen}
                >
                    <div style={{width: 250, height: 'auto'}}>
                        {this.renderRoomList()}
                    </div>
                </Drawer>
                <div style={{flexGrow: 1}}>
                    <AppBar variant="fixed">
                        <Toolbar>
                            <React.Fragment>
                                <IconButton onClick={this.handleToggleDrawer} edge="start">
                                    <ListIcon/>
                                </IconButton>
                            </React.Fragment>
                            <Typography style={{flexGrow: 1}}>Stay a while....</Typography>
                            <React.Fragment>
                                <IconButton onClick={this.handleToggleProfileMenu} edge="end">
                                    {this.renderAvatar()}
                                </IconButton>
                                <Menu
                                    id="profile-menu"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    keepMounted
                                    profileAnchorEl={this.state.profileAnchorEl}
                                    open={Boolean(this.state.profileMenuOpen)}
                                    onClose={this.closeMenu}
                                >
                                    <MenuItem onClick={this.login}>Change Account</MenuItem>
                                    <MenuItem onClick={this.props.logout.bind(this)}>
                                        <ExitToApp/>
                                    </MenuItem>
                                    <MenuItem onClick={this.closeProfileMenu}>
                                        <Close/>
                                    </MenuItem>
                                </Menu>
                            </React.Fragment>
                        </Toolbar>
                    </AppBar>
                </div>
            </React.Fragment>
        )
    }
};

export default connect(
    (state) => ({
        profileImageUrl: profileImageUrlSelector(state),
        profileName: profileNameSelector(state),
        myRooms: roomsSelector(state),
        currentRoom: currentRoomSelector(state)
    }),
    (dispatch) => ({
        logout: () => dispatch(logout()),
        login: () => dispatch(login),
        getProfile: () => dispatch(getProfile()),
        attendRoom: (roomId) => dispatch(attendRoom(roomId)),
        departRoom: () => dispatch(departRoom()),
        getMyRooms: () => dispatch(getMyRooms())
    })
)(Header);