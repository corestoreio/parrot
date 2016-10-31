import React from 'react';

function Root({history, store}) {
    return (
        <h1>Root</h1>
    );
}

Root.propTypes = {
    history: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired
};

export default Root;