import React from 'react';
import DriftTooltip from '../../DriftTooltip/DriftTooltip';
import { BlueprintIcon, ClockIcon, ServerIcon } from '@patternfly/react-icons';

function makeSelections(content, isSelected, selectedContent) {
    let newSelectedContent = [];
    let exists;

    if (!isSelected) {
        for (let i = 0; i < selectedContent.length; i++) {
            exists = false;
            content.forEach(function(item) {
                if (item.id === selectedContent[i].id) {
                    exists = true;
                }
            });

            if (!exists) {
                newSelectedContent.push(selectedContent[i]);
            }
        }
    } else {
        newSelectedContent = [ ...selectedContent ];
        let selectedContentIds = selectedContent.map(selectedItem => selectedItem.id);

        content.forEach(function(item) {
            if (!selectedContentIds.includes(item.id)) {
                newSelectedContent.push(item);
            }
        });
    }

    return newSelectedContent;
}

function makeHSPSelections(content, selectedContent) {
    let newSelectedContent = [];
    let exists = false;

    selectedContent?.forEach(function(hsp) {
        if (hsp.id !== content.id) {
            if (!content.icon) {
                content.icon = <DriftTooltip content='Historical profile' body={ <ClockIcon /> } />;
            }

            newSelectedContent.push(hsp);
        } else {
            exists = true;
        }
    });

    if (!exists) {
        content.icon = <DriftTooltip content='Historical profile' body={ <ClockIcon /> } />;
        newSelectedContent.push(content);
    }

    return newSelectedContent;
}

function setContent(selectedIds, handleSystemSelection, handleBaselineSelection, handleHSPSelection) {
    let newSelectedSystems = [];
    let newSelectedBaselines = [];

    if (selectedIds.systems.length) {
        newSelectedSystems = selectedIds.systems.map(function(system) {
            return createContent(system.id, 'System', <ServerIcon />, system.display_name);
        }.bind(this));

        handleSystemSelection(newSelectedSystems, true);
    }

    if (selectedIds.baselines.length) {
        newSelectedBaselines = selectedIds.baselines.map(function(baseline) {
            return createContent(baseline.id, 'Baseline', <BlueprintIcon />, baseline.display_name);
        }.bind(this));

        handleBaselineSelection(newSelectedBaselines, true);
    }

    /*eslint-disable camelcase*/
    if (selectedIds.historicalProfiles.length) {
        selectedIds.historicalProfiles.forEach(function(hsp) {
            let content = {
                system_name: hsp.display_name,
                captured_date: hsp.updated,
                id: hsp.id,
                system_id: hsp.system_id
            };

            handleHSPSelection(content);
        });
    }
    /*eslint-enable camelcase*/
}

function createContent (id, content, body, name) {
    return {
        id,
        icon: <DriftTooltip
            content={ content }
            body={ body }
        />,
        name
    };
}

export default {
    makeSelections,
    makeHSPSelections,
    setContent
};
