import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

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
		const project = this.state.project;
		project[e.target.id] = e.target.value;
		this.setState({
			project: project
		});
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.onSubmit(this.state.project);
		this.handleClose();
	}

	handleOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
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
				<IconButton onTouchTap={this.handleOpen}>
					<FontIcon className="material-icons" color="white">add</FontIcon>
				</IconButton>

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