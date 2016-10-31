import React, { PropTypes } from 'react';
import { registerActions } from './../../core/auth';
import { connect } from 'react-redux';
import RegisterForm from './../components/RegisterForm';

const RegisterPage = ({onSubmit}) => (
    <RegisterForm onSubmit={onSubmit} />
);

RegisterPage.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: (user) => {
            dispatch(registerActions.register(user))
        }
    };
};

export default connect(null, mapDispatchToProps)(RegisterPage);