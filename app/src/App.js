import React from 'react'
import './app.css'
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

// Needed for onTouchTap
injectTapEventPlugin();

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="Title"
                        onLeftIconButtonTouchTap={()=>alert("touched!")}
                    />
                    {this.props.children}
                </div>
            </MuiThemeProvider>
        )
    }
}

export default App;
