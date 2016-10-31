import React, { PropTypes } from 'react'
import { List, ListItem } from 'material-ui/List';

export default class Project extends React.Component {
    static propTypes = {
        project: PropTypes.object.isRequired,
    }

    render() {
        return (
            <div>
                <List>
                    {this.props.project.locales.map(function(entry, index) {
                        return <ListItem
                            key={index.toString()}
                            primaryText={entry.locale + "  " + entry.country + "  " + entry.language}
                        />
                    })}
                </List>
            </div>
        );
    }
}