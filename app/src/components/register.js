import React, { PropTypes } from 'react';
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

export default Register;