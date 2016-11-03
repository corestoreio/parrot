import React, { PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router';

export default class LocaleList extends React.Component {
    static propTypes = {
        locales: PropTypes.array.isRequired,
        projectId: PropTypes.number.isRequired
    }

    render() {
        const { locales, projectId } = this.props;
        return (
            <List>
                {locales.map(function(locale, index) {
                    return (
                            <Link
                                key={locale.locale}
                                to={`/projects/${projectId}/locales/${locale.locale}`}
                            >
                            <ListItem
                                primaryText={locale.locale}
                            />
                        </Link>
                    );
                })}
            </List>
        );
    }
}
