import React, { PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import LocaleSelectField from './LocaleSelectField';

export default class NewLocaleForm extends React.Component {
    constructor(props) {
        super(props);
        this.localeIdent = '';
        this.handleSelection = this.handleSelection.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        availableLocales: PropTypes.array.isRequired
    }

    handleSelection(value) {
        this.localeIdent = value;
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.localeIdent);
    }
    
    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <LocaleSelectField
                    id="ident"
                    availableLocales={this.props.availableLocales}
                    label="Which locale?"
                    hintText="Dude"
                    onChange={this.handleSelection}
                /><br />
                <RaisedButton
                    type="submit"
                    label="Create"
                    primary={true}
                />
            </form>
        );
    }
}
