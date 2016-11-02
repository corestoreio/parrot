import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import './css/app.css';
import Breadcrumbs from 'react-breadcrumbs';

// Needed for onTouchTap
injectTapEventPlugin();

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="Title"
                        onLeftIconButtonTouchTap={()=>alert("touched")}
                    />
                    <Breadcrumbs
                        routes={this.props.routes}
                        params={this.props.params}
                        separator=" | "
                        setDocumentTitle={true}
                    />
                    {this.props.children}
                </div>
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    children: React.PropTypes.element
};

export default App;
