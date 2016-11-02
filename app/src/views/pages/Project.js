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
        editProjectLink: PropTypes.func.isRequired
    };

    render () {
        if (!this.props.project) {
            return (<h1>Empty</h1>);
        }
        return (
            <div>
                <Project project={this.props.project} />
                <Button onClick={this.props.editProjectLink} label="Add locale" />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        project: state.projects.projects.find((element) => {
            return element.id === ownProps.params.projectId;
        })
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        editProjectLink: () => {
            dispatch(push(`/projects/${ownProps.params.projectId}/locales/new`))
        },
        fetchProject: () => {
            dispatch(projectActions.fetchProject(ownProps.params.projectId));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);