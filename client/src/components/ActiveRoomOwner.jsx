import React from "react";
import {Card, CardContent, CardMedia, Grid, Typography} from "@material-ui/core";
import RoomActions from "./RoomActions";


class ActiveRoomOwner extends React.Component {
    componentDidMount() {
        this.props.getPlaylists();
        this.props.getRoomPlaylists();
    }

    render() {
        return (
            <React.Fragment>
                <Grid container justify='center' spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {this.props.room.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <RoomActions playlists={this.props.playlists}
                                     room={this.props.room}
                                     saveRoomPlaylists={this.props.saveRoomPlaylists}
                                     roomPlaylists={this.props.roomPlaylists}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    {this.props.roomPlaylists.map(playlist => {
                        return (
                            <Grid item xs={12} sm={6} lg={3}>
                                <Card>
                                    <CardMedia image={playlist.imageUrl}
                                               style={{height: '100px'}}
                                               title={playlist.name}/>
                                    <CardContent>
                                        <Typography gutterBottom variant="caption" component="p" noWrap>
                                            {playlist.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </React.Fragment>

        )
    }
};

export default ActiveRoomOwner;