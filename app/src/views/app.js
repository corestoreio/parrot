import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './css/app.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { connect } from 'react-redux';
import { RouteTransition } from 'react-router-transition';

// Needed for onTouchTap
injectTapEventPlugin();

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                {this.props.children}
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    children: React.PropTypes.element
};

export default App;