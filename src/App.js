import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Routes } from './Routes';
import './App.scss';

class App extends Component {

    componentDidMount () {
        insights.chrome.init();
        insights.chrome.identifyApp('drift');
    }

    componentWillUnmount () {
        this.appNav();
        this.buildNav();
    }

    render () {
        return (
            <Routes childProps={ this.props } />
        );
    }
}

App.propTypes = {
    history: PropTypes.object
};

export default withRouter (connect()(App));
