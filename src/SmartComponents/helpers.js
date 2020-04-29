import React from 'react';
import { CloseIcon, HistoryIcon } from '@patternfly/react-icons';
import moment from 'moment';

function findCheckedValue(total, selected) {
    if (selected === total && total > 0) {
        return true;
    } else if (selected > 0 && selected < total) {
        return null;
    } else {
        return false;
    }
}

function paginateData(data, selectedPage, itemsPerPage) {
    let paginatedData = [];

    if (data === null || !data.length) {
        return [];
    }

    for (let i = 0; i < data.length; i++) {
        if (Math.ceil((i + 1) / itemsPerPage) === selectedPage) {
            paginatedData.push(data[i]);
        }
    }

    return paginatedData;
}

function buildSystemsTableWithSelectedHSP (rows, selectedHSP, deselectHistoricalProfiles) {
    /*eslint-disable camelcase*/
    rows.forEach((row) => {
        row.selected = false;
        row.display_selected_hsp = row.display_name;
        if (selectedHSP.system_id === row.id) {
            row.display_selected_hsp = <React.Fragment>
                <div>
                    { row.display_name }
                </div>
                <div>
                    <HistoryIcon className='active-blue margin-right-5-px' />
                    {
                        moment.utc(selectedHSP.captured_date).format('DD MMM YYYY, HH:mm UTC')
                    }
                    <CloseIcon
                        className='pointer active-blue margin-left-5-px'
                        onClick={ () => deselectHistoricalProfiles() }
                    />
                </div>
            </React.Fragment>;
        }
    });
    /*eslint-enable camelcase*/

    return rows;
}

export default {
    findCheckedValue,
    paginateData,
    buildSystemsTableWithSelectedHSP
};
