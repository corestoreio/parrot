import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { ProjectList } from './../components/ProjectList';
import Button from './../components/Button';
import { fetchProjects } from './../../core/projects'
import CircularProgress from 'material-ui/CircularProgress';

class ProjectsPage extends React.Component {
    static propTypes = {
        projects: PropTypes.array.isRequired,
        createProjectLink: PropTypes.func.isRequired,
        fetchProjects: PropTypes.func.isRequired,
        pending: PropTypes.bool.isRequired
    };

    componentDidMount() {
        this.props.fetchProjects();
    }

    renderProjects() {
        const projects = this.props.projects;
        if (!projects || projects.length <= 0) {
            return (
                <p>
                    No projects found
                </p>
            );
        }

        return (
            <ProjectList projects={this.props.projects} />
        );
    }
    
    render() {
        return (
            <div>
                {(this.props.pending
                    ? <CircularProgress size={60} thickness={7} />
                    : this.renderProjects()
                )}<br />
                <Button onClick={this.props.createProjectLink} label="Create new project" />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        projects: state.projects.projects,
        pending: state.projects.pending

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createProjectLink: () => {
            dispatch(push('/projects/new'))
        },
        fetchProjects: () => {
            dispatch(fetchProjects());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);