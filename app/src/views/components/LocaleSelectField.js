import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

export default class LocaleSelectField extends React.Component {
    static propTypes = {
        availableLocales: PropTypes.array.isRequired,
        label: PropTypes.string.isRequired,
        onSubmit: PropTypes.func.isRequired
    }

    state = {
        open: false,
        value: {}
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };


    handleChange = (e, value) => {
        e.preventDefault();
        this.setState({
            value: value
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.handleClose();
        this.props.onSubmit(this.state.value);
    };

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleSubmit}
            />,
        ];

        const availableLocales = this.props.availableLocales;
        const selectables = [];
        for (let i = 0; i < availableLocales.length; i++) {
            const locale = availableLocales[i];
            selectables.push(
                <RadioButton
                    key={i}
                    value={locale}
                    label={`${locale.language} - ${locale.country} (${locale.ident})`}
                />
            );
        }

        return (
            <div>
            <FlatButton style={{color: 'white'}} label={this.props.label} onClick={this.handleOpen} />
            <Dialog
                title="Select locale"
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
                autoScrollBodyContent={true}
                actions={actions}
            >
                <RadioButtonGroup
                    name="locales"
                    onChange={this.handleChange}
                >
                    {selectables}
                </RadioButtonGroup>
            </Dialog>
            </div>
        );
    }
}
