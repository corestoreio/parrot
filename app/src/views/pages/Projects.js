import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { ProjectList } from './../components/ProjectList';

const ProjectsPage = ({projects}) => {
    return (<ProjectList projects={projects} />);
};

ProjectsPage.propTypes = {
    projects: PropTypes.array.isRequired
};


const mapStateToProps = (state) => {
    return {
        projects: state.projects.projectList
    };
};

export default connect(mapStateToProps)(ProjectsPage);