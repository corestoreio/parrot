import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { ProjectList } from './../components/ProjectList';
import { fetchProjects, createProject } from './../../core/projects'
import CircularProgress from 'material-ui/CircularProgress';
import NewProjectDialog from './../components/NewProjectDialog';

class ProjectsPage extends React.Component {
    static propTypes = {
        projects: PropTypes.array.isRequired,
        onCreateProject: PropTypes.func.isRequired,
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
                <NewProjectDialog onSubmit={this.props.onCreateProject} />
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
        fetchProjects: () => {
            dispatch(fetchProjects());
        },
        onCreateProject: (project) => {
            dispatch(createProject(project));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);