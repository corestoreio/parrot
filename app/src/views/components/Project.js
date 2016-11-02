import React, { PropTypes } from 'react'
import { List, ListItem } from 'material-ui/List';

export default class Project extends React.Component {
    static propTypes = {
        project: PropTypes.object.isRequired,
        locales: PropTypes.array.isRequired
    }

    render() {
        return (
            <div>
                {this.props.project && 
                    <div>
                        <h1>{this.props.project.name}</h1>
                        <List>
                            {this.props.locales.map(function(locale, index) {
                                return <ListItem
                                    key={locale.id.toString()}
                                    primaryText={locale.locale}
                                />
                            })}
                        </List>
                    </div>
                }
            </div>
        );
    }
}