import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popover, PopoverPosition } from '@patternfly/react-core';
import SelectedTable from './SelectedTable/SelectedTable';
import EmptyStateDisplay from '../../EmptyStateDisplay/EmptyStateDisplay';
import addSystemModalHelpers from '../redux/helpers';

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

    async componentDidMount() {
        addSystemModalHelpers.setContent({
            systems: this.props.systems,
            baselines: this.props.baselines,
            historicalProfiles: this.props.historicalProfiles
        }, this.props.handleSystemSelection, this.props.handleBaselineSelection, this.props.handleHSPSelection);
    }

    toggleBasket = () => {
        const { toggleBasketVisible } = this.props;

        this.clearDeselected();
        toggleBasketVisible();
    }

    applyChanges = async () => {
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

    displayBodyContent = (isEmpty) => {
        const { entities, selectedSystemContent, selectedBaselineContent, selectedHSPContent } = this.props;
        let bodyContent;

        if (isEmpty) {
            bodyContent = <EmptyStateDisplay
                title='Nothing selected'
                text={ [ 'Select systems and baselines to compare.' ] }
            />;
        } else {
            bodyContent = <SelectedTable
                selectedBaselineContent={ selectedBaselineContent }
                entities={ entities }
                selectedHSPContent={ selectedHSPContent }
                findType={ this.findType }
                handleDeselect={ this.handleDeselect }
                selectedSystemContent={ selectedSystemContent }
            />;
        }

        return bodyContent;
    }

    render() {
        const { isVisible } = this.props;

        return (
            <React.Fragment>
                <span>
                    <Popover
                        id='selected-basket'
                        style={{ minWidth: '500px' }}
                        isVisible={ isVisible }
                        shouldClose={ () => this.toggleBasket() }
                        headerContent={ <div>Selected items ({ this.findSelected() })</div> }
                        footerContent={ <Button
                            key="confirm"
                            variant="primary"
                            onClick={ () => this.applyChanges() }
                            ouiaId="confirm-selected-basket-button"
                        >
                            Apply changes
                        </Button> }
                        position={ PopoverPosition.bottom }
                        bodyContent={ <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            { this.displayBodyContent(this.findSelected() === 0) }
                        </div> }
                    >
                        <a onClick={ () => this.toggleBasket() }>
                            Selected ({ this.findSelected() })
                        </a>
                    </Popover>
                </span>
            </React.Fragment>
        );
    }
}

SelectedBasket.propTypes = {
    baselines: PropTypes.array,
    entities: PropTypes.object,
    handleBaselineSelection: PropTypes.func,
    handleHSPSelection: PropTypes.func,
    handleSystemSelection: PropTypes.func,
    historicalProfiles: PropTypes.array,
    isVisible: PropTypes.bool,
    selectBaseline: PropTypes.func,
    selectedBaselineContent: PropTypes.array,
    selectedHSPContent: PropTypes.array,
    selectedSystemContent: PropTypes.array,
    selectEntity: PropTypes.func,
    selectHistoricProfiles: PropTypes.func,
    systems: PropTypes.array,
    toggleBasketVisible: PropTypes.func
};

export default SelectedBasket;
