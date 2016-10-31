import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

/**
 * With the `maxHeight` property set, the Select Field will be scrollable
 * if the number of items causes the height to exceed this limit.
 */
export default class LocaleSelectField extends React.Component {
    static propTypes = {
        availableLocales: PropTypes.array.isRequired,
        label: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired
    }

    state = {
        value: 1,
    };

    handleChange = (event, index, value) => {
        event.preventDefault();
        this.setState({value});
        this.props.onChange(value);
    };

    render() {
        return (
            <SelectField
                floatingLabelText={this.props.label}
                value={this.state.value}
                onChange={this.handleChange}
                maxHeight={200}
            >
                {this.props.availableLocales.map(function(locale, index) {
                        return <MenuItem
                                    value={locale.ident}
                                    key={index}
                                    primaryText={`${locale.ident}`}
                                />
                    })
                }
            </SelectField>
        );
    }
}