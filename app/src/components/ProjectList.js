import React, { PropTypes } from 'react';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export class ProjectList extends React.Component {
    render() {
        return (
            <div>
                <List>
                    {this.props.projects.map(function(project, index) {
                        return <ListItem key={index.toString()} primaryText={'Project ' + index + ' ' + project.name} />
                    })}
                </List>
                <RaisedButton label="Create new project" primary={true}/>
            </div>
        );
    }
}

ProjectList.propTypes = {
    projects: PropTypes.array.isRequired
};

class ProjectNew extends React.Component {
    render() {
        return (
            <div>
                <TextField
                    hintText="The project's name"
                    floatingLabelText="Name"
                /><br />
                <RaisedButton label="Create" primary={true} />
            </div>
        );
    }
}

const projectLocales = [
    {
        locale: "en_US",
        country: "United States",
        language: "English"
    },
    {
        locale: "de_DE",
        country: "Germany",
        language: "German"
    }
]

class ProjectShow extends React.Component {
    render() {
        return (
            <div>
                <List>
                    {projectLocales.map(function(entry, index) {
                        return <ListItem
                            key={index.toString()}
                            primaryText={entry.locale + " " + entry.country + " " + entry.language}
                        />
                    })}
                </List>
                <RaisedButton label="Add locale" primary={true}/>
            </div>
        );
    }
}

class ProjectEdit extends React.Component {
    render() {
        return (<h1>ProjectEdit</h1>);
    }
}

export { ProjectNew, ProjectShow, ProjectEdit };