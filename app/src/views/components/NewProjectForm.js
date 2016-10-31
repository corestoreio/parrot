import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class NewProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.project = {
            name: '',
            locales: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    static propTypes = {
        onSubmit: PropTypes.func.isRequired
    }

    handleChange(e) {
        e.preventDefault();
        this.project[e.target.id] = e.target.value;
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.project);
    }
    
    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <TextField
                    id="name"
                    hintText="The project's name"
                    floatingLabelText="Name"
                    onChange={this.handleChange}
                /><br />
                <RaisedButton
                    type="submit"
                    label="Create"
                    primary={true}
                />
            </form>
        );
    }
}
