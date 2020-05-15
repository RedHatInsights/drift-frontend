import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Chip, ChipGroup, ChipGroupToolbarItem } from '@patternfly/react-core';

import { compareActions } from '../../modules';

export class DriftFilterChips extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chipGroup: [
                { category: 'State', chips: this.setStateChips(this.props.stateFilters) },
                { category: 'Fact name', chips:
                    this.props.factFilter !== ''
                        ? [ this.props.factFilter ]
                        : []
                }
            ]
        };
    }

    componentDidUpdate(prevProps) {
        const { stateFilters, factFilter } = this.props;
        const { chipGroup } = this.state;
        let newStateChips = chipGroup[0];
        let newFactChips = chipGroup[1];
        let newChipGroup;

        if (prevProps !== this.props) {
            if (stateFilters !== prevProps.stateFilters) {
                let filteredChips = [];

                stateFilters.forEach(function(filter) {
                    if (filter.selected) {
                        filteredChips.push(filter.display);
                    }
                });

                newStateChips = { category: 'State', chips: filteredChips };
            }

            if (factFilter !== prevProps.factFilter) {
                newFactChips = { category: 'Name', chips:
                    factFilter !== ''
                        ? [ factFilter ]
                        : []
                };
            }

            newChipGroup = [ newStateChips, newFactChips ];
            this.setState({ chipGroup: newChipGroup });
        }
    }

    setStateChips = (stateFilters) => {
        let stateChips = [];

        stateFilters.forEach(function(filter) {
            if (filter.selected) {
                stateChips.push(filter.display);
            }
        });

        return stateChips;
    }

    removeChip = (chip) => {
        const { stateFilters, addStateFilter, filterByFact } = this.props;

        if (chip === 'Same' || chip === 'Different' || chip === 'Incomplete data') {
            stateFilters.forEach(function(stateFilter) {
                if (stateFilter.display === chip) {
                    addStateFilter(stateFilter);
                }
            });
        } else {
            filterByFact('');
        }
    }

    checkChips = () => {
        const { chipGroup } = this.state;
        const { setIsEmpty } = this.props;
        let isEmpty = true;

        chipGroup.forEach(function(group) {
            if (group.chips.length > 0) {
                isEmpty = false;
            }
        });

        setIsEmpty(isEmpty);
    }

    render() {
        const { chipGroup } = this.state;
        let chipKeyCount = 0;

        this.checkChips();

        return (
            <ChipGroup withToolbar>
                { chipGroup.map(currentGroup => (
                    <ChipGroupToolbarItem key={ currentGroup.category } categoryName={ currentGroup.category }>
                        { currentGroup.chips.map(chip => (
                            <Chip key={ currentGroup.category + chipKeyCount++ } onClick={ () => this.removeChip(chip) }>
                                { chip }
                            </Chip>
                        )) }
                    </ChipGroupToolbarItem>
                )) }
            </ChipGroup>
        );
    }
}

DriftFilterChips.propTypes = {
    factFilter: PropTypes.string,
    stateFilters: PropTypes.array,
    filterByFact: PropTypes.func,
    addStateFilter: PropTypes.func,
    setIsEmpty: PropTypes.func
};

function mapStateToProps(state) {
    return {
        factFilter: state.compareState.factFilter,
        stateFilters: state.compareState.stateFilters
    };
}

function mapDispatchToProps(dispatch) {
    return {
        filterByFact: (filter) => dispatch(compareActions.filterByFact(filter)),
        addStateFilter: (filter) => dispatch(compareActions.addStateFilter(filter))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DriftFilterChips);
