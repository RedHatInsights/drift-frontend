import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popover, PopoverPosition } from '@patternfly/react-core';
import SelectedTable from './SelectedTable/SelectedTable';

export class SelectedBasket extends Component {
    constructor(props) {
        super(props);

        this.state = {
            systemsToDeselect: [],
            baselinesToDeselect: [],
            hspsToDeselect: []
        };

        this.clearDeselected = () => {
            this.setState({ systemsToDeselect: []});
            this.setState({ baselinesToDeselect: []});
            this.setState({ hspsToDeselect: []});
        };
    }

    onToggle = async () => {
        const { baselinesToDeselect, hspsToDeselect, systemsToDeselect } = this.state;
        const { handleBaselineSelection, handleHSPSelection, selectBaseline, selectEntity, selectHistoricProfiles,
            selectedBaselineContent, selectedHSPContent, toggleBasketVisible } = this.props;

        toggleBasketVisible();

        if (baselinesToDeselect.length) {
            await selectBaseline(baselinesToDeselect, false, 'COMPARISON');
            handleBaselineSelection(selectedBaselineContent.filter(baseline => baselinesToDeselect.includes(baseline.id)), false);
        }

        if (hspsToDeselect.length) {
            hspsToDeselect.forEach(async function(hsp) {
                await handleHSPSelection(selectedHSPContent.find(hspContent => hspContent.id === hsp));
            });

            await selectHistoricProfiles(selectedHSPContent.filter(item => !hspsToDeselect.includes(item.id))
            .map(({ id }) => id));
        }

        systemsToDeselect.forEach(async function(system) {
            await selectEntity(system, false);
        });

        this.clearDeselected();
    };

    findType = (type, id) => {
        const { systemsToDeselect, baselinesToDeselect, hspsToDeselect } = this.state;
        let newArray;

        if (type === 'system') {
            newArray = this.toggleSelected(systemsToDeselect, id);
            this.setState({ systemsToDeselect: newArray });
        } else if (type === 'baseline') {
            newArray = this.toggleSelected(baselinesToDeselect, id);
            this.setState({ baselinesToDeselect: newArray });
        } else {
            newArray = this.toggleSelected(hspsToDeselect, id);
            this.setState({ hspsToDeselect: newArray });
        }
    }

    toggleSelected = (array, id) => {
        let newArray = [];

        if (array.includes(id)) {
            newArray = this.removeId(id, array);
        } else {
            newArray = [ ...array ];
            newArray.push(id);
        }

        return newArray;
    }

    removeId(id, array) {
        let newArray = [];
        array.forEach(function(item) {
            if (id !== item) {
                newArray.push(item);
            }
        });

        return newArray;
    }

    findSelected() {
        const { selectedBaselineContent, selectedHSPContent, selectedSystemContent } = this.props;
        let selectedCount = 0;

        if (selectedSystemContent.length) {
            selectedCount += selectedSystemContent.length + selectedBaselineContent.length + selectedHSPContent.length;
        } else {
            selectedCount += selectedBaselineContent.length + selectedHSPContent.length;
        }

        return selectedCount;
    }

    render() {
        const { entities, isVisible, selectedBaselineContent, selectedHSPContent, selectedSystemContent } = this.props;

        return (
            <React.Fragment>
                <span>
                    <Popover
                        id='selected-basket'
                        isVisible={ isVisible }
                        shouldClose={ () => this.onToggle() }
                        headerContent={ <div>Selected items</div> }
                        position={ PopoverPosition.bottom }
                        bodyContent={ <div style={{ maxHeight: '350px', overflowY: 'scroll' }}>
                            <SelectedTable
                                selectedBaselineContent={ selectedBaselineContent }
                                entities={ entities }
                                selectedHSPContent={ selectedHSPContent }
                                findType={ this.findType }
                                handleDeselect={ this.handleDeselect }
                                selectedSystemContent={ selectedSystemContent }
                            />
                        </div> }
                    >
                        <a onClick={ () => this.onToggle() }>
                            Selected ({ this.findSelected() })
                        </a>
                    </Popover>
                </span>
            </React.Fragment>
        );
    }
}

SelectedBasket.propTypes = {
    handleBaselineSelection: PropTypes.func,
    handleHSPSelection: PropTypes.func,
    entities: PropTypes.object,
    isVisible: PropTypes.bool,
    selectBaseline: PropTypes.func,
    selectedBaselineContent: PropTypes.array,
    selectedHSPContent: PropTypes.array,
    selectedSystemContent: PropTypes.array,
    selectEntity: PropTypes.func,
    selectHistoricProfiles: PropTypes.func,
    toggleBasketVisible: PropTypes.func
};

export default SelectedBasket;
