import React, { PropTypes } from 'react'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class LocalePairs extends React.Component {
    static propTypes = {
        pairs: PropTypes.object.isRequired,
    }

    render() {
        let pairs = this.props.pairs;

        return (
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
                    {Object.keys(pairs).map( (key) => (
                        <TableRow key={key}>
                            <TableRowColumn>{key}</TableRowColumn>
                            <TableRowColumn>{pairs[key]}</TableRowColumn>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}