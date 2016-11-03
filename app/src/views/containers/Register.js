import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { register } from './../../core/auth';
import { connect } from 'react-redux';
import RegisterForm from './../components/RegisterForm';
import Button from './../components/Button'

const RegisterPage = ({onSubmit, goToLogin}) => (
    <div>
        <RegisterForm onSubmit={onSubmit} />
        <Button label="Already registered?" onClick={goToLogin} />
    </div>
);

RegisterPage.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: (user) => {
            dispatch(register(user))
        },
        goToLogin: () => {
            dispatch(push('/login'));
        }
    };
};

export default connect(null, mapDispatchToProps)(RegisterPage);