import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import NewLocaleForm from './../components/NewLocaleForm'

const NewLocalePage = ({onSubmit, availableLocales}) => {
    return (<NewLocaleForm
        onSubmit={onSubmit}
        availableLocales={availableLocales}
    />);
};

NewLocalePage.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    availableLocales: PropTypes.array.isRequired
};


const mapStateToProps = (state) => {
    return {
        availableLocales: [
            {ident: "en_US", language: "English", country: "USA"},
            {ident: "de_DE", language: "German", country: "Germany"}
        ]
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: (locale) => {
            console.log(locale)
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewLocalePage);