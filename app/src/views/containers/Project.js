import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { projectActions } from './../../core/projects'
import { localeActions } from './../../core/locales'
import Project from './../components/Project'
import LocaleSelectField from './../components/LocaleSelectField'
import CircularProgress from 'material-ui/CircularProgress';

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
        pending: PropTypes.bool.isRequired,
        locales: PropTypes.array.isRequired,
        availableLocales: PropTypes.array.isRequired
    };

    renderProjectPage() {
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
                <Project project={project} locales={this.props.locales}/>
                <LocaleSelectField
                    availableLocales={this.props.availableLocales}
                    label="Add locale"
                    onSubmit={this.props.onLocaleAdd}
                />
            </div>
        );
    }

    render () {
        return (
            <div>
                {(this.props.pending
                    ? <CircularProgress size={60} thickness={7} />
                    : this.renderProjectPage()
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
        pending: state.projects.pending,
        availableLocales: [
            {ident: "en_US", language: "English", country: "USA"},
            {ident: "de_DE", language: "German", country: "Germany"}
        ],
        locales: state.locales.activeLocales
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const id = ownProps.params.projectId;
    return {
        onLocaleAdd: (locale) => {
            dispatch(localeActions.createLocale(id, locale))
            dispatch(push(`/projects/${id}/locales/${locale.ident}`))
        },
        fetchLocales: () => {
            dispatch(localeActions.fetchLocales(id));
        },
        fetchProjects: () => {
            dispatch(projectActions.fetchProjects());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);