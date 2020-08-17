import React from 'react';
import {Badge, Paper, Typography} from "@material-ui/core";

class InviteLink extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            copyMessage: undefined
        }
        this.clearBadge = this.clearBadge.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
    }

    getLink() {
        return `${process.env.REACT_APP_HOST}/gameOn/${this.props.room.id}`;
    }

    handleClick() {
        navigator.clipboard.writeText(this.getLink.call(this));
        this.setState({copyMessage: 'Copied!'});
        this.timeout = setTimeout(this.clearBadge, 5000);
    }

    clearBadge() {
        this.setState({copyMessage: undefined});
    }

    render() {
        return (
            <Paper
                style={{
                    backgroundColor: 'lightgreen',
                    borderColor: 'green',
                    border: '3px',
                    borderStyle: 'solid',
                    flexShrink: 1,
                    padding: '5px',
                    userSelect: 'none'
                }}
                onClick={this.handleClick}
            >
                <Badge badgeContent={this.state.copyMessage} color="primary" style={{display: 'flex'}}>
                    <Typography>
                        Invite Link: {`${process.env.REACT_APP_HOST}/gameOn/${this.props.room.id}`}
                    </Typography>
                </Badge>
            </Paper>
        )
    }
}

export default InviteLink;