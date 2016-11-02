import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import LocalePairs from './../components/LocalePairs'
import Button from './../components/Button'
import { localeActions } from './../../core/locales'
import CircularProgress from 'material-ui/CircularProgress';

class LocalePage extends React.Component {
    static propTypes = {
        editLocaleLink: PropTypes.func.isRequired,
        locale: PropTypes.object.isRequired,
        fetchLocale: PropTypes.func.isRequired,
        pending: PropTypes.bool.isRequired
    };

    componentDidMount() {
        this.props.fetchLocales();
        // TODO: fetch locales if needed?
        // const locale = this.props.locale;
        // this.props.fetchLocale(locale.id);
    }

    
    renderLocalePage() {
        const locale = this.props.locale;
        if (!locale) {
            return (
                <p>
                    No locale found
                </p>
            );
        }

        return (
            <div>
                <LocalePairs pairs={locale.pairs} />
                <Button onClick={this.props.editLocaleLink} label="Edit" />
            </div>
        );
    }

    render() {
        return (
            <div>
                {(this.props.pending
                    ? <CircularProgress size={60} thickness={7} />
                    : this.renderLocalePage()
                )}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const ident = ownProps.params.localeIdent;
    const result = state.locales.activeLocales.find((element) => {
            return element.ident === ident;
    });
    return {
        locale: result,
        pending: state.locales.pending
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const projectId = ownProps.params.projectId;
    return {
        editLocaleLink: () => {
            dispatch(push(`/projects/${projectId}/locales/${ownProps.params.localeId}/edit`))
        },
        fetchLocales: () => {
            dispatch(localeActions.fetchLocales(projectId));
        },
        fetchLocale: (localeId) => {
            dispatch(localeActions.fetchLocale(projectId, localeId));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocalePage);