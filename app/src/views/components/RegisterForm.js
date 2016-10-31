import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class RegisterForm extends React.Component {
    constructor(props) {
        super(props)
        this.user = {
            email: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        this.user[e.target.id] = e.target.value;
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.user);
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
                    label="Register"
                    type="submit"
                    primary={true}
                />
            </form>
        );
    }
};

RegisterForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default RegisterForm;