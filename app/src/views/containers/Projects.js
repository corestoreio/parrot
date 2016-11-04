import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { ProjectList } from './../components/ProjectList';
import { fetchProjects, createProject } from './../../core/projects'
import AppBar from 'material-ui/AppBar';
import NewProjectDialog from './../components/NewProjectDialog';
import LoadingIndicator from './../components/LoadingIndicator';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';

class ProjectsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {drawerOpen: false};
    }

    handleToggle = () => this.setState({drawerOpen: !this.state.drawerOpen});

    handleClose = () => this.setState({drawerOpen: false});


    static propTypes = {
        projects: PropTypes.array.isRequired,
        fetchProjects: PropTypes.func.isRequired,
        pending: PropTypes.bool.isRequired,
        onCreateProject: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.fetchProjects();
    }

    renderProjects() {
        const projects = this.props.projects;
        if (!projects || projects.length <= 0) {
            return (
                <p>No projects found</p>
            );
        }

        return (
            <ProjectList projects={this.props.projects} />
        );
    }
    
    render() {
        return (
            <div>
                <Drawer
                    docked={false}
                    width={200}
                    open={this.state.drawerOpen}
                    onRequestChange={(drawerOpen) => this.setState({drawerOpen})}
                >
                    <MenuItem onTouchTap={this.handleClose}>Menu Item</MenuItem>
                    <MenuItem onTouchTap={this.handleClose}>Menu Item 2</MenuItem>
                </Drawer>

                <AppBar
                    style={{position: 'fixed', top: 0}}
                    title="Projects"
                    showMenuIconButton={true}
                    onLeftIconButtonTouchTap={this.handleToggle}
                >   
                    <div style={{ margin: 'auto' }}>
                        <NewProjectDialog onSubmit={this.props.onCreateProject} />
                    </div>
                </AppBar>

                <div style={{marginTop: 60}}>
                    {(this.props.pending
                        ? <LoadingIndicator />
                        : this.renderProjects()
                    )}<br />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
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