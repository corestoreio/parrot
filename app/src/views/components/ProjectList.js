import React, { PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';

export class ProjectList extends React.Component {
    render() {
        return (
            <div>
                <List>
                    {this.props.projects.map(function(project, index) {
                        return <ListItem key={index.toString()} primaryText={'Project ' + index + ' ' + project.name} />
                    })}
                </List>
            </div>
        );
    }
}

ProjectList.propTypes = {
    projects: PropTypes.array.isRequired
};