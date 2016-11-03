import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import LocalePairs from './../components/LocalePairs';
import { fetchLocales, updateLocale } from './../../core/locales';
import CircularProgress from 'material-ui/CircularProgress';

class LocalePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false
        };
        this.handleCommitPairs = this.handleCommitPairs.bind(this);
    }

    static propTypes = {
        locale: PropTypes.object.isRequired,
        fetchLocales: PropTypes.func.isRequired,
        commitLocalePairs: PropTypes.func.isRequired,
        pending: PropTypes.bool.isRequired
    };

    componentDidMount() {
        this.props.fetchLocales();
    }

    handleCommitPairs(pairs) {
        const { locale } = this.props;
        locale.pairs = pairs;
        this.props.commitLocalePairs(locale);
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
                <LocalePairs pairs={locale.pairs}
                    onCommit={this.handleCommitPairs}
                />
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
    const ident = ownProps.params.localeId;
    let locale = null;
    let activeLocales = state.locales.activeLocales;
    if (activeLocales && ident) {
        for (let i = 0; i < activeLocales.length; i++) {
            if (activeLocales[i].locale === ident) {
                locale = Object.assign({}, activeLocales[i]);
                break;
            }
        }
    }
        
    return {
        locale: locale,
        pending: state.locales.pending
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const projectId = ownProps.params.projectId;

    return {
        fetchLocales: () => {
            dispatch(fetchLocales(projectId));
        },
        commitLocalePairs: (locale) => {
            dispatch(updateLocale(projectId, locale));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocalePage);