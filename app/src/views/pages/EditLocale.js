import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import LocalePairsEditable from './../components/LocalePairsEditable'
import Button from './../components/Button'

const EditLocalePage = ({pairs, onSubmit}) => {
    return (
        <div>
            <LocalePairsEditable pairs={pairs} onSubmit={onSubmit}/>
        </div>
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
            console.log(pairs)
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditLocalePage);