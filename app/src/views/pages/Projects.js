import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { ProjectList } from './../components/ProjectList';

const Projects = ({projects}) => {
    return (<ProjectList projects={projects} />);
};

Projects.propTypes = {
    projects: PropTypes.array.isRequired
};


const mapStateToProps = (state) => {
    return {
        projects: state.projects
    };
};

export default connect(mapStateToProps)(Projects);