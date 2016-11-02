import React, { PropTypes } from 'react'
import { List, ListItem } from 'material-ui/List';

export default class Project extends React.Component {
    static propTypes = {
        project: PropTypes.object.isRequired,
    }

    render() {
        return (
            <div>
                {this.props.project && 
                    <div>
                        <h1>{this.props.project.name}</h1>
                        <List>
                            {this.props.project.keys.map(function(locale, index) {
                                return <ListItem
                                    key={index.toString()}
                                    primaryText={locale.ident + "  " + locale.country + "  " + locale.language}
                                />
                            })}
                        </List>
                    </div>
                }
            </div>
        );
    }
}