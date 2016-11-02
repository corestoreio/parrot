import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { projectActions } from './../../core/projects'
import Project from './../components/Project'
import Button from './../components/Button';

class ProjectPage extends React.Component {

    componentDidMount() {
        this.props.fetchProject();
    }

    static propTypes = {
        project: PropTypes.object.isRequired,
        editProjectLink: PropTypes.func.isRequired,
        fetchProject: PropTypes.func.isRequired
    };

    render () {
        const project = this.props.project;
        return (
            <div>
                {project && 
                    <div>
                        <Project project={project} />
                        <Button onClick={this.props.editProjectLink} label="Add locale" />
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.params.projectId;
    const result = state.projects.projects.find((element) => {
            return element.id == id;
    });
    return {
        project: result
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