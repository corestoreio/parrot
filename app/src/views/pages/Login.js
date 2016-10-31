import React, { PropTypes } from 'react';
// import { authenticate } from './../actions/auth';
// import { connect } from 'react-redux';
import LoginForm from './../components/LoginForm';

export default class LoginPage extends React.Component {
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

// const mapDispatchToProps = (dispatch) => {
//     return {
//         onSubmit: (credentials) => {
//             dispatch(authenticate(credentials))
//         }
//     };
// };

// export default connect(null, mapDispatchToProps)(Login);