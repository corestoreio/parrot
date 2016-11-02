import React, { PropTypes } from 'react'
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router';

export default class Project extends React.Component {
    static propTypes = {
        project: PropTypes.object.isRequired,
        locales: PropTypes.array.isRequired
    }

    render() {
        const project = this.props.project;
        const locales = this.props.locales;
        return (
            <div>
                {project && 
                    <div>
                        <h1>{project.name}</h1>
                        <List>
                            {locales.map(function(locale, index) {
                                return (
                                     <Link
                                        key={locale.locale}
                                        to={`/projects/${project.id}/locales/${locale.locale}`}
                                     >
                                        <ListItem
                                            primaryText={locale.locale}
                                        />
                                    </Link>
                                );
                            })}
                        </List>
                    </div>
                }
            </div>
        );
    }
}