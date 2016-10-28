import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

class Documents extends React.Component {
    render() {
        return (<h1>Documents</h1>)
    };
}

class DocumentNew extends React.Component {
    render() {
        return (<h1>DocumentNew</h1>)
    }
}

const tableData = [
    {
        key: "MY_KEY",
        value: "my value"
    },
    {
        key: "MY_OTHER_KEY",
        value: "my other value"
    }
];

class DocumentShow extends React.Component {
    render() {
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
                        <TableHeaderColumn>ID</TableHeaderColumn>
                        <TableHeaderColumn>Key</TableHeaderColumn>
                        <TableHeaderColumn>Value</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody
                    displayRowCheckbox={false}
                    showRowHover={true}
                >
                    {tableData.map( (row, index) => (
                        <TableRow key={index}>
                            <TableRowColumn>{index}</TableRowColumn>
                            <TableRowColumn>{row.key}</TableRowColumn>
                            <TableRowColumn>{row.value}</TableRowColumn>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

class DocumentEdit extends React.Component {
    render() {
        return (<h1>DocumentEdit</h1>)
    };
}

export { Documents, DocumentNew, DocumentShow, DocumentEdit };