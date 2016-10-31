import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import NewProjectForm from './../components/NewProjectForm'
import { projectActions } from './../../core/projects'

const NewProjectPage = ({onSubmit}) => {
    return (<NewProjectForm onSubmit={onSubmit} />);
};

NewProjectPage.propTypes = {
    onSubmit: PropTypes.func.isRequired
};


const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: (project) => {
            dispatch(projectActions.createProject(project));
        }
    };
};

export default connect(null, mapDispatchToProps)(NewProjectPage);