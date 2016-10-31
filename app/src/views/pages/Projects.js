import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { ProjectList } from './../components/ProjectList';
import NewProjectButton from './../components/NewProjectButton';

const ProjectsPage = ({projects, createProjectLink}) => {
    return (
        <div>
            <ProjectList projects={projects} />
            <NewProjectButton onClick={createProjectLink} />
        </div>
    );
};

ProjectsPage.propTypes = {
    projects: PropTypes.array.isRequired,
    createProjectLink: PropTypes.func.isRequired
};


const mapStateToProps = (state) => {
    return {
        projects: state.projects.projectList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createProjectLink: () => {
            dispatch(push('/projects/new'))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);