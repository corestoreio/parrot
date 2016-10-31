import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.credentials = {
            email: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        this.credentials[e.target.id] = e.target.value;
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.credentials);
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <TextField
                    id="email"
                    hintText="Your email"
                    floatingLabelText="Email"
                    onChange={this.handleChange}
                /><br />
                <TextField
                    id="password"
                    hintText="Your password"
                    floatingLabelText="Password"
                    type="password"
                    onChange={this.handleChange}
                /><br />
                <RaisedButton
                    label="Login"
                    type="submit"
                    primary={true}
                />
            </form>
        );
    }
};

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default LoginForm;