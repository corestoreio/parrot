import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { projectActions } from './../../core/projects';
import { localeActions } from './../../core/locales';
import { getAvailableLocales } from './../../core/util/locale';
import Project from './../components/Project';
import LocaleSelectField from './../components/LocaleSelectField';
import CircularProgress from 'material-ui/CircularProgress';
import Button from './../components/Button';

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
                /><br />
                <Button
                    label="Project Keys"
                    onClick={this.props.linkToEditKeys}
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
        },
        linkToEditKeys: () => {
            dispatch(push(`/projects/${id}/keys`))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);