import React, { PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router';

export class ProjectList extends React.Component {
    render() {
        return (
            <div>
                <List>
                    {this.props.projects.map(function(project, index) {
                        return (
                            <Link
                                key={project.id}
                                to={`/projects/${project.id}`}
                            >
                                <ListItem
                                    primaryText={'Project ' + index + ' ' + project.name}
                                />
                            </Link>
                        );
                    })}
                </List>
            </div>
        );
    }
}

ProjectList.propTypes = {
    projects: PropTypes.array.isRequired
};