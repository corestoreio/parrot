import React, { PropTypes } from 'react';
import { push, goBack } from 'react-router-redux';
import { connect } from 'react-redux';
import { fetchProjects } from './../../core/projects';
import { fetchLocales, createLocale } from './../../core/locales';
import { getAvailableLocales } from './../../core/util/locale';
import LocaleList from './../components/LocaleList';
import LocaleSelectField from './../components/LocaleSelectField';
import LoadingIndicator from './../components/LoadingIndicator';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

class ProjectPage extends React.Component {
    componentDidMount() {
        this.props.fetchProjects();
        this.props.fetchLocales();
    }

    static propTypes = {
        project: PropTypes.object.isRequired,
        onLocaleAdd: PropTypes.func.isRequired,
        fetchProjects: PropTypes.func.isRequired,
        fetchLocales: PropTypes.func.isRequired,
        goBack: PropTypes.func.isRequired,
        pending: PropTypes.bool.isRequired,
        locales: PropTypes.array.isRequired,
        availableLocales: PropTypes.array.isRequired
    };

    renderProject(project) {
        if (!project) {
            return (
                <p>No project found</p>
            );
        }

        return (
            <div>
                <LocaleList projectId={project.id} locales={this.props.locales} />
            </div>
        );
    }

    render () {
        const project = this.props.project;
        const backButton = (
            <IconButton onTouchTap={this.props.goBack}>
                <FontIcon className="material-icons" color="white">arrow_back</FontIcon>
            </IconButton>
        );

        return (
            <div>
                <AppBar
                    style={{position: 'fixed', top: 0}}
                    title={project ? project.name : ''}
                    showMenuIconButton={true}
                    iconElementLeft={backButton}
                >
                </AppBar>
                <div style={{marginTop: 60}}>

                    <Toolbar style={{backgroundColor: '#0087A6'}}>
                        <ToolbarGroup>
                            <FlatButton
                                style={{color: 'white'}}
                                label="Project Keys"
                                onClick={this.props.linkToEditKeys}
                            />
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <div style={{margin: 'auto'}}>
                                <LocaleSelectField
                                    availableLocales={this.props.availableLocales}
                                    label="Add locale"
                                    onSubmit={this.props.onLocaleAdd}
                                />
                            </div>
                        </ToolbarGroup>
                    </Toolbar>

                    {(this.props.pending
                        ? <LoadingIndicator />
                        : this.renderProject(project)
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
    const existingLocales = state.locales.activeLocales.map((elem)=>{
        return {ident: elem.locale};
    });

    return {
        project: result,
        pending: state.projects.pending,
        availableLocales: getAvailableLocales(existingLocales),
        locales: state.locales.activeLocales
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const projectId = ownProps.params.projectId;
    return {
        onLocaleAdd: (locale) => {
            dispatch(createLocale(projectId, locale))
        },
        fetchLocales: () => {
            dispatch(fetchLocales(projectId));
        },
        fetchProjects: () => {
            dispatch(fetchProjects());
        },
        linkToEditKeys: () => {
            dispatch(push(`/projects/${projectId}/keys`))
        },
        goBack: () => {
            dispatch(goBack())
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);