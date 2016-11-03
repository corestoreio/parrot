import React, { PropTypes } from 'react'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class EditableKeys extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            keys: props.keys
        }
    }

    static propTypes = {
        keys: PropTypes.array.isRequired,
        onCommit: PropTypes.func.isRequired
    }

    handleChange = (e) => {
        e.preventDefault();
        const temp = this.state.keys.slice();
        temp[e.target.id] = e.target.value;
        this.setState({
            keys: temp
        });
    };

    onCommit = (e) => {
        e.preventDefault();
        this.props.onCommit(this.state.keys);
    };

    handleAddKey = (e) => {
        e.preventDefault();
        const result = this.state.keys.slice();
        result.push('')
        this.setState({
            keys: result
        })
        console.log(this.state)
    };

    render() {
        return (
            <form onSubmit={this.onCommit}>
                {this.state.keys.map((elem, index) => {
                    return (
                        <div key={index}>
                            <TextField
                                id={index.toString()}
                                hintText="Start typing your key here"
                                onChange={this.handleChange}
                                value={elem}
                            /><br />
                        </div>
                    );
                })}
                <RaisedButton
                    primary={true}
                    label="Add key"
                    onClick={this.handleAddKey}
                />
                <RaisedButton
                    primary={true}
                    type="submit"
                    label="Commit Changes"
                />
            </form>
        );
    }
}