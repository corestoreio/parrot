import React, { PropTypes } from 'react';
import { authActions } from './../../core/auth';
import { connect } from 'react-redux';
import LoginForm from './../components/LoginForm';

class LoginPage extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired
    };

    render() {
        return (
            <section>
                <LoginForm onSubmit={this.props.onSubmit} />
            </section>
        );
    }
}

// const Login = ({onSubmit}) => (
//     <LoginForm onSubmit={onSubmit} />
// );

// Login.propTypes = {
//     onSubmit: PropTypes.func.isRequired
// };

const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: (credentials) => {
            dispatch(authActions.authenticate(credentials))
        }
    };
};

export default connect(null, mapDispatchToProps)(LoginPage);