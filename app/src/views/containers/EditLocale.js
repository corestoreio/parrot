import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import LocalePairsEditable from './../components/LocalePairsEditable'

const EditLocalePage = ({pairs, onSubmit}) => {
    return (
        <LocalePairsEditable pairs={pairs} onSubmit={onSubmit}/>
    );
};

EditLocalePage.propTypes = {
    pairs: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        pairs: {'my key': 'my pair'}
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onSubmit: (pairs) => {
            console.log(pairs);
            dispatch(push(`/projects/${ownProps.params.projectId}/locales/${ownProps.params.localeId}`));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditLocalePage);