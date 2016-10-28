import React, { PropTypes } from 'react';
import { register } from './../actions/register';
import { connect } from 'react-redux';
import RegisterForm from './../components/RegisterForm';

const Register = ({onSubmit}) => (
    <RegisterForm onSubmit={onSubmit} />
);

Register.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: (user) => {
            dispatch(register(user))
        }
    };
};

export default connect(null, mapDispatchToProps)(Register);