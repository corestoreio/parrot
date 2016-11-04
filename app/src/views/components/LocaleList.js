import React, { PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import { browserHistory } from 'react-router';
import LinearProgress from 'material-ui/LinearProgress';

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
                    const mockPercent = Math.floor(Math.random()*100);
                    return (
                        <Paper key={locale.id} style={{margin: 10}}>
                            <ListItem
                                primaryText={locale.locale}
                                secondaryText={`${mockPercent}% translated`}
                                onClick={() => {
                                    browserHistory.push(`/projects/${projectId}/locales/${locale.locale}`);
                                }}
                            />
                            <LinearProgress mode="determinate" value={mockPercent} />
                        </Paper>
                    );
                })}
            </List>
        );
    }
}
