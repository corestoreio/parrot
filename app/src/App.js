import React from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import './css/app.css'

// Needed for onTouchTap
injectTapEventPlugin();

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="0xFF"
                        onLeftIconButtonTouchTap={()=>alert("touched!")}
                    />
                    {this.props.children}
                </div>
            </MuiThemeProvider>
        )
    }
}

export default App;
