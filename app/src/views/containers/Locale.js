import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import LocalePairs from './../components/LocalePairs'
import Button from './../components/Button'

const LocalePage = ({pairs, editLocaleLink}) => {
    return (
        <div>
            <LocalePairs pairs={pairs} />
            <Button onClick={editLocaleLink} label="Edit" />
        </div>
    );
};

LocalePage.propTypes = {
    pairs: PropTypes.object.isRequired,
    editLocaleLink: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        pairs: {'my key': 'my pair'}
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        editLocaleLink: () => {
            dispatch(push(`/projects/${ownProps.params.projectId}/locales/${ownProps.params.localeId}/edit`))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocalePage);