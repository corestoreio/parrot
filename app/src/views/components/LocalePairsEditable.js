import React, { PropTypes } from 'react'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class LocalePairs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pairs: {...props.pairs}
        }
    }

    static propTypes = {
        pairs: PropTypes.object.isRequired,
        onSubmit: PropTypes.func.isRequired
    }

    handleChange = (e) => {
        e.preventDefault();

        const changed = {
            ...this.state.pairs
        }

        changed[e.target.id] = e.target.value;
        this.setState({
            pairs: changed
        })
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.props.onSubmit(this.state.pairs);
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <Table
                    fixedHeader={true}
                    selectable={false}
                >
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                    >
                        <TableRow>
                            <TableHeaderColumn>Key</TableHeaderColumn>
                            <TableHeaderColumn>Value</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        showRowHover={true}
                    >
                        {Object.keys(this.state.pairs).map((key) => (
                            <TableRow key={key}>
                                <TableRowColumn>{key}</TableRowColumn>
                                <TableRowColumn>
                                    <TextField
                                        id={key}
                                        value={this.state.pairs[key]}
                                        hintText="Value for this key"
                                        multiLine={true}
                                        rows={1}
                                        rowsMax={25}
                                        onChange={this.handleChange}
                                    />
                                </TableRowColumn>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
                <RaisedButton
                    primary={true}
                    type="submit"
                    label="Commit Changes"
                />
            </form>
        );
    }
}