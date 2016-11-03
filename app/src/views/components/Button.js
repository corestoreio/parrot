import React, { PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default class Button extends React.Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired
    }

    render() {
        return (
            <RaisedButton
                label={this.props.label}
                primary={true}
                onClick={this.props.onClick}
            />
        );
    }
}
