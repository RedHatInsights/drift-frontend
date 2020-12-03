import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@patternfly/react-core';

export class SelectedBasketCheckbox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isChecked: true
        };
    }

    handleChange = () => {
        const { findType, id, type } = this.props;
        const { isChecked } = this.state;

        findType(type, id);
        this.setState({ isChecked: !isChecked });
    }

    render() {
        const { isChecked } = this.state;

        return (
            <React.Fragment>
                <Checkbox
                    isChecked={ isChecked }
                    onChange={ this.handleChange }
                    aria-label="controlled checkbox example"
                    id="check-1"
                    name="check1"
                />
            </React.Fragment>
        );
    }
}

SelectedBasketCheckbox.propTypes = {
    type: PropTypes.string,
    findType: PropTypes.func,
    id: PropTypes.string
};

export default SelectedBasketCheckbox;
