import React, { PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';
import { browserHistory } from 'react-router';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';

export class ProjectList extends React.Component {
    render() {
        return (
            <List>
                {this.props.projects.map(function(project, index) {
                    return (
                        <Paper key={project.id} style={{margin: 10}}>
                            <ListItem
                                primaryText={'Project ' + index + ' ' + project.name}
                                rightAvatar={<FontIcon className="material-icons" color="gray">info</FontIcon>}
                                onClick={() => {
                                    browserHistory.push(`/projects/${project.id}`);
                                }}
                            >
                            </ListItem>
                        </Paper>
                    );
                })}
            </List>
        );
    }
}

ProjectList.propTypes = {
    projects: PropTypes.array.isRequired
};