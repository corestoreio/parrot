import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { loginActions } from './../../core/auth';
import { connect } from 'react-redux';
import LoginForm from './../components/LoginForm';
import Button from './../components/Button'

class LoginPage extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired
    };

    render() {
        return (
            <section>
                <LoginForm onSubmit={this.props.onSubmit} />
                <Button label="Not registered yet?" onClick={this.props.goToRegister}/>
            </section>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: (credentials) => {
            dispatch(loginActions.login(credentials));
        },
        goToRegister: () => {
            dispatch(push('/register'));
        }
    };
};

export default connect(null, mapDispatchToProps)(LoginPage);