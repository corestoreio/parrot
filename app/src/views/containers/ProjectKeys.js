import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { projectActions } from './../../core/projects';
import EditableKeys from './../components/EditableKeys';
import CircularProgress from 'material-ui/CircularProgress';

class ProjectKeysPage extends React.Component {
    componentDidMount() {
        this.props.fetchProjects();
    }

    static propTypes = {
        project: PropTypes.object.isRequired,
        fetchProjects: PropTypes.func.isRequired,
        pending: PropTypes.bool.isRequired,
        onKeysCommit: PropTypes.func.isRequired
    };

    renderProjectKeys() {
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
                <EditableKeys 
                    keys={project.keys}
                    onCommit={this.props.onKeysCommit}
                />
            </div>
        );
    }

    render () {
        return (
            <div>
                {(this.props.pending
                    ? <CircularProgress size={60} thickness={7} />
                    : this.renderProjectKeys()
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
    const id = parseInt(ownProps.params.projectId, 10);
    return {
        fetchProjects: () => {
            dispatch(projectActions.fetchProjects());
        },
        onKeysCommit: (keys) => {
            dispatch(projectActions.updateProject({id: id, keys: keys}))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectKeysPage);