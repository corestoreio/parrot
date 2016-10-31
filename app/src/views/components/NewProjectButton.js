import React, { PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default class NewProjectButton extends React.Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired
    }

    render() {
        return (
            <RaisedButton
                label="Create new project"
                primary={true}
                onClick={this.props.onClick}
            />
        );
    }
}
