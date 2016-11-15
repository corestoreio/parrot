import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchProjects, updateProject } from './../../core/projects';
import EditableKeys from './../components/EditableKeys';
import AppBar from 'material-ui/AppBar';
import LoadingIndicator from './../components/LoadingIndicator';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { goBack } from 'react-router-redux';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

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

    renderProjectKeys(project) {
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

    render() {
        const project = this.props.project;
        const backButton = (
            <IconButton onTouchTap={this.props.goBack}>
                <FontIcon className="material-icons" color="white">arrow_back</FontIcon>
            </IconButton>
        );

        return (
            <div>
                <AppBar
                    style={{ position: 'fixed', top: 0 }}
                    title={project ? project.name : ''}
                    showMenuIconButton={true}
                    iconElementLeft={backButton}
                    >
                </AppBar>
                <div style={{ marginTop: 60 }}>

                    <Toolbar style={{ backgroundColor: '#0087A6' }}>
                        <ToolbarGroup>

                        </ToolbarGroup>
                        <ToolbarGroup>

                        </ToolbarGroup>
                    </Toolbar>

                    {(this.props.pending
                        ? <LoadingIndicator />
                        : this.renderProjectKeys(project)
                    )}
                </div>
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
            dispatch(fetchProjects());
        },
        onKeysCommit: (keys) => {
            dispatch(updateProject({ id: id, keys: keys }))
        },
        goBack: () => {
            dispatch(goBack())
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectKeysPage);