import React, { PropTypes } from 'react'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Button from './Button';

export default class LocalePairs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            originalPairs: Object.assign({}, props.pairs),
            pairs: Object.assign({}, props.pairs),
            editing: false
        }

        this.enableEdit = this.enableEdit.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
    }

    static propTypes = {
        pairs: PropTypes.object.isRequired,
        onCommit: PropTypes.func.isRequired
    }

    enableEdit() {
        this.setState({
            editing: true
        });
    }

    cancelEdit() {
        this.setState({
            editing: false,
            pairs: this.state.originalPairs
        });
    }

    handleChange = (e) => {
        e.preventDefault();
        const changed = Object.assign({}, this.state.pairs);
        changed[e.target.id] = e.target.value;
        this.setState({
            pairs: changed
        })
    };

    onCommit = (e) => {
        e.preventDefault();
        this.props.onCommit(this.state.pairs);
    };

    renderEditable() {
        const pairs = this.state.pairs;
        return (
            <TableBody
                displayRowCheckbox={false}
                showRowHover={true}
            >
                {Object.keys(pairs).map((key) => (
                    <TableRow key={key}>
                        <TableRowColumn>{key}</TableRowColumn>
                        <TableRowColumn>
                            <TextField
                                id={key}
                                value={pairs[key]}
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
        );
    }

    renderReadOnly() {
        const pairs = this.state.pairs;
        return (
            <TableBody
                displayRowCheckbox={false}
                showRowHover={true}
            >
                {Object.keys(pairs).map((key) => (
                    <TableRow key={key}>
                        <TableRowColumn>{key}</TableRowColumn>
                        <TableRowColumn>{pairs[key]}</TableRowColumn>
                    </TableRow>
                ))}
            </TableBody>
        );
    }

    render() {
        return (
            <div>
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
                    {this.state.editing
                        ? this.renderEditable()
                        : this.renderReadOnly()
                    }
                </Table>
                {this.state.editing
                    ?  (
                        <div>
                            <Button onClick={this.cancelEdit} label="Cancel changes" />
                            <Button onClick={this.onCommit} label="Commit changes" />
                        </div>
                        )
                    : (<Button onClick={this.enableEdit} label="Edit" />)
                }
            </div>
        );
    }
}