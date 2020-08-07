import React from "react";
import {connect} from 'react-redux';
import {
    AppBar,
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Drawer,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    TextField,
    Toolbar,
    Typography
} from "@material-ui/core";
import {
    AddCircleOutline,
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
import {attendRoom, createRoom, departRoom, getMyRooms} from "../redux/actionCreators/roomActionCreators";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profileMenuOpen: false,
            profileAnchorEl: null,
            drawerOpen: true,
            createRoomDialogOpen: false
        };
        this.handleToggleProfileMenu = this.handleToggleProfileMenu.bind(this);
        this.closeProfileMenu = this.closeProfileMenu.bind(this);
        this.handleToggleDrawer = this.handleToggleDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.login = this.login.bind(this);
        this.openCreateRoomDialog = this.openCreateRoomDialog.bind(this);
        this.closeCreateRoomDialog = this.closeCreateRoomDialog.bind(this);
        this.handleFormInput = this.handleFormInput.bind(this);
        this.createNewRoom = this.createNewRoom.bind(this);
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

    openCreateRoomDialog() {
        this.setState({
            createRoomDialogOpen: true,
            newRoomName: '',
            newRoomPassword: '',
            newRoomPasswordConfirm: '',
            newRoomNameError: false,
            newRoomPasswordError: false
        });
    }

    closeCreateRoomDialog() {
        this.setState({createRoomDialogOpen: false});
    }

    handleFormInput(fieldName) {
        return (event) => {
            let newState = {};
            newState[fieldName] = event.target.value;
            this.setState(newState);
        }
    }

    createNewRoom() {
        let newState = {};
        let hasErrors = false;
        if (!this.state.newRoomName) {
            newState.newRoomNameError = true;
            hasErrors = true;
        } else {
            newState.newRoomNameError = false;
        }

        if (this.state.newRoomPassword !== this.state.newRoomPasswordConfirm) {
            newState.newRoomPasswordError = true;
            hasErrors = true;
        } else {
            newState.newRoomPasswordError = false;
        }

        if (hasErrors) {
            this.setState(newState);
        } else {
            this.props.createRoom({
                title: this.state.newRoomName,
                password: this.state.newRoomPassword
            });
            this.closeCreateRoomDialog();
        }

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
                            onClick={() => isCurrentRoom || this.props.attendRoom(room.id)}
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
                    <React.Fragment>
                        <ListItem button key="depart" onClick={() => this.props.departRoom()}>
                            <ListItemIcon><NoMeetingRoom/></ListItemIcon>
                            <ListItemText primary="Exit Current Room"/>
                        </ListItem>
                        <Divider/>
                    </React.Fragment>
                }
                <ListItem
                    button
                    key="create"
                    onClick={this.openCreateRoomDialog}
                >
                    <ListItemIcon><AddCircleOutline/></ListItemIcon>
                    <ListItemText primary="Create New Room"/>
                </ListItem>

            </List>
        )
    }

    renderCreateRoomDialog() {
        return (
            <Dialog open={this.state.createRoomDialogOpen} onClose={this.closeCreateRoomDialog}>
                <DialogTitle id="create-new-room-dialog">Create New Room</DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="title"
                                label="Room Title"
                                value={this.state.newRoomName}
                                error={this.state.newRoomNameError}
                                helperText={this.state.newRoomNameError && "Title is required"}
                                fullWidth
                                onChange={this.handleFormInput("newRoomName")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                id="password"
                                label="Passowrd"
                                type="password"
                                error={this.state.newRoomPasswordError}
                                helperText={this.state.newRoomPasswordError && "Password must match"}
                                value={this.state.newRoomPassword}
                                fullWidth
                                onChange={this.handleFormInput("newRoomPassword")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                id="confirm"
                                label="Confirm Password"
                                type="password"
                                error={this.state.newRoomPasswordError}
                                value={this.state.newRoomPasswordConfirm}
                                fullWidth
                                onChange={this.handleFormInput("newRoomPasswordConfirm")}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.createNewRoom} color="primary">Create</Button>
                    <Button onClick={this.closeCreateRoomDialog} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog>
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.renderCreateRoomDialog()}
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
        getMyRooms: () => dispatch(getMyRooms()),
        createRoom: (options) => dispatch(createRoom(options))
    })
)(Header);