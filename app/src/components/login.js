import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class Register extends React.Component {
    render() {
        return (
            <div>
                <TextField
                    hintText="Your email"
                    floatingLabelText="Email"
                /><br />
                <TextField
                    hintText="Your password"
                    floatingLabelText="Password"
                    type="password"
                /><br />
                <RaisedButton label="Register" primary={true} />
            </div>
        );
    }
}

class Login extends React.Component {
    render() {
        return (
            <div>
                <TextField
                    hintText="Your email"
                    floatingLabelText="Email"
                /><br />
                <TextField
                    hintText="Your password"
                    floatingLabelText="Password"
                    type="password"
                /><br />
                <RaisedButton label="Login" primary={true} />
            </div>
        );
    }
}

export { Register, Login };