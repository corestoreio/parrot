import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { fetchProjects } from './../../core/projects';
import { fetchLocales, createLocale } from './../../core/locales';
import { getAvailableLocales } from './../../core/util/locale';
import LocaleList from './../components/LocaleList';
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
                <h1>{project.name}</h1>
                <LocaleList projectId={project.id} locales={this.props.locales} />
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
    const projectId = ownProps.params.projectId;
    return {
        onLocaleAdd: (locale) => {
            dispatch(createLocale(projectId, locale))
            dispatch(push(`/projects/${projectId}/locales/${locale.ident}`))
        },
        fetchLocales: () => {
            dispatch(fetchLocales(projectId));
        },
        fetchProjects: () => {
            dispatch(fetchProjects());
        },
        linkToEditKeys: () => {
            dispatch(push(`/projects/${projectId}/keys`))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);