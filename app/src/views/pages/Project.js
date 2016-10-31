import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import Project from './../components/Project'
import Button from './../components/Button';

const ProjectPage = ({project, editProjectLink}) => {
    return (
        <div>
            <Project project={project} />
            <Button onClick={editProjectLink} label="Add locale" />
        </div>
    );
};

ProjectPage.propTypes = {
    project: PropTypes.object.isRequired,
    editProjectLink: PropTypes.func.isRequired
};

const mockProject = {
    id: 1,
    locales: [
        {locale: "en_US", language: "English", country: "USA"},
        {locale: "de_DE", language: "German", country: "Germany"}
    ]
};

const mapStateToProps = (state) => {
    return {
        project: mockProject
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        editProjectLink: () => {
            dispatch(push(`/projects/${ownProps.params.projectId}/edit`))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);