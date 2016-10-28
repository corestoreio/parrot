import React from 'react';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const projectList = [
    {
        name: "heros"
    },
    {
        name: "marshal"
    }
]

class Projects extends React.Component {
    render() {
        return (
            <div>
                <List>
                    {projectList.map(function(project, index) {
                        return <ListItem primaryText={project.name} />
                    })}
                </List>
                <RaisedButton label="Create new project" primary={true}/>
            </div>
        );
    }
}

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
                        return <ListItem primaryText={entry.locale + " " + entry.country + " " + entry.language} />
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

export { Projects, ProjectNew, ProjectShow, ProjectEdit };