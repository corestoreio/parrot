import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { ProjectList } from './../components/ProjectList';
import Button from './../components/Button';

const ProjectsPage = ({projects, createProjectLink}) => {
    return (
        <div>
            <ProjectList projects={projects} />
            <Button onClick={createProjectLink} label="Create new project" />
        </div>
    );
};

ProjectsPage.propTypes = {
    projects: PropTypes.array.isRequired,
    createProjectLink: PropTypes.func.isRequired
};


const mapStateToProps = (state) => {
    return {
        projects: state.projects.projects
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