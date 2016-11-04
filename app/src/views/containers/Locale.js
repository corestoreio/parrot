import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import LocalePairs from './../components/LocalePairs';
import { fetchLocales, updateLocale } from './../../core/locales';
import LoadingIndicator from './../components/LoadingIndicator';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import { goBack } from 'react-router-redux';

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
        pending: PropTypes.bool.isRequired,
        goBack: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.fetchLocales();
    }

    handleCommitPairs(pairs) {
        const { locale } = this.props;
        locale.pairs = pairs;
        this.props.commitLocalePairs(locale);
    }

    renderLocale(locale) {
        if (!locale) {
            return (
                <p>No locale found</p>
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
        const locale = this.props.locale;
        const backButton = (
            <IconButton onTouchTap={this.props.goBack}>
                <FontIcon className="material-icons" color="white">arrow_back</FontIcon>
            </IconButton>
        );

        return (
            <div>
                <AppBar
                    style={{position: 'fixed', top: 0}}
                    title={locale ? locale.locale : ''}
                    showMenuIconButton={true}
                    iconElementLeft={backButton}
                >
                </AppBar>
                <div style={{marginTop: 60}}>

                    <Toolbar style={{backgroundColor: '#0087A6'}}>
                        <ToolbarGroup>

                        </ToolbarGroup>
                        <ToolbarGroup>

                        </ToolbarGroup>
                    </Toolbar>

                    {(this.props.pending
                        ? <LoadingIndicator />
                        : this.renderLocale(locale)
                    )}
                </div>
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
        },
        goBack: () => {
            dispatch(goBack())
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocalePage);