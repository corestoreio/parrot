import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

export default class LocaleList extends React.Component {
    render() {
        const centeredStyle = {
            top: '50%',
            left: '50%',
            position: 'absolute',
            transform: 'translate(-50%, -50%)'
        };

        return (
            <CircularProgress size={60} thickness={7} style={centeredStyle} {...this.props} />
        );
    }
}
