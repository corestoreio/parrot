import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { projectActions } from './../../core/projects'
import Project from './../components/Project'
import Button from './../components/Button';
import CircularProgress from 'material-ui/CircularProgress';

class ProjectPage extends React.Component {
    componentDidMount() {
        this.props.fetchProject();
    }

    static propTypes = {
        project: PropTypes.object.isRequired,
        editProjectLink: PropTypes.func.isRequired,
        fetchProject: PropTypes.func.isRequired,
        pending: PropTypes.bool.isRequired,
    };

    renderProject() {
        const project = this.props.project;
        if (!project) {
            return (
                <p>
                    No project found
                </p>
            );
        }

        return (
            <div>
                <Project project={project} />
                <Button onClick={this.props.editProjectLink} label="Add locale" />
            </div>
        );
    }

    render () {
        return (
            <div>
                {(this.props.pending
                    ? <CircularProgress size={60} thickness={7} />
                    : this.renderProject()
                )}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const id = parseInt(ownProps.params.projectId, 10);
    const result = state.projects.projects.find((element) => {
            return element.id === id;
    });
    return {
        project: result,
        pending: state.projects.pending
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const id = ownProps.params.projectId;
    return {
        editProjectLink: () => {
            dispatch(push(`/projects/${id}/locales/new`))
        },
        fetchProject: () => {
            dispatch(projectActions.fetchProject(id));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);