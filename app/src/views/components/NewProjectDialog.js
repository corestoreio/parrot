import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class NewProjectDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			project: {
				name: ''
			}
		};
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    static propTypes = {
        onSubmit: PropTypes.func.isRequired
    }

    handleChange(e) {
        e.preventDefault();
        this.state.project[e.target.id] = e.target.value;
    }

	onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state.project);
		this.handleClose();
    }

	handleOpen = () => {
		this.setState({open: true});
	};

	handleClose = () => {
		this.setState({open: false});
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
				onTouchTap={this.onSubmit}
			/>,
		];

		return (
			<div>
				<RaisedButton
					primary={true}
					label="New Project"
					onTouchTap={this.handleOpen}
				/>
				<Dialog
					title="New Project"
					actions={actions}
					modal={false}
					onRequestClose={this.handleClose}
					open={this.state.open}
				>
					<TextField
						id="name"
						hintText="The project's name"
						floatingLabelText="Name"
						onChange={this.handleChange}
					/>
				</Dialog>
			</div>
		);
	}
}