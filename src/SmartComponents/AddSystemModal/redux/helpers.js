import React from 'react';
import DriftTooltip from '../../DriftTooltip/DriftTooltip';
import { ClockIcon } from '@patternfly/react-icons';

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

export default {
    makeSelections,
    makeHSPSelections
};
