import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chip, ChipGroup, ChipGroupToolbarItem } from '@patternfly/react-core';

class BaselinesFilterChips extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chipGroup: [
                { category: 'Baseline name', chips: [ this.props.nameSearch ]}
            ]
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.nameSearch !== prevProps.nameSearch) {
            let newChipGroup = [
                { category: 'Baseline name', chips: [ this.props.nameSearch ]}
            ];

            this.setState({ chipGroup: newChipGroup });
        }
    }

    render() {
        const { chipGroup } = this.state;
        const { clearTextFilter } = this.props;

        return (
            <ChipGroup withToolbar>
                { chipGroup.map(currentGroup => (
                    <ChipGroupToolbarItem key={ currentGroup.category } categoryName={ currentGroup.category }>
                        { currentGroup.chips.map(chip => (
                            <Chip key={ chip } onClick={ clearTextFilter }>
                                { chip }
                            </Chip>
                        )) }
                    </ChipGroupToolbarItem>
                )) }
            </ChipGroup>
        );
    }
}

BaselinesFilterChips.propTypes = {
    nameSearch: PropTypes.string,
    clearTextFilter: PropTypes.func
};

export default BaselinesFilterChips;
