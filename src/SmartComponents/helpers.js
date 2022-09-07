import React from 'react';
import { CloseIcon, HistoryIcon, ServerIcon } from '@patternfly/react-icons';
import moment from 'moment';
import DriftTooltip from './DriftTooltip/DriftTooltip';
import baselinesTableHelpers from './BaselinesTable/redux/helpers';
import editBaselineHelpers from './BaselinesPage/EditBaselinePage/EditBaseline/helpers';
import { downloadFile } from '@redhat-cloud-services/frontend-components-utilities/helpers';

function findSelectedOnPage(rows, selectedSystemIds) {
    let selectedSystems = [];

    rows.forEach(function(row) {
        if (selectedSystemIds.includes(row.id)) {
            row.selected = true;
        }

        if (row.selected) {
            selectedSystems.push({
                id: row.id,
                name: row.display_name,
                icon: <DriftTooltip
                    content='System'
                    body={ <ServerIcon /> }
                />
            });
        }
    });

    return selectedSystems;
}

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
                        className='pointer not-active margin-left-5-px'
                        onClick={ () => deselectHistoricalProfiles() }
                    />
                </div>
            </React.Fragment>;
        }
    });
    /*eslint-enable camelcase*/

    return rows;
}

function downloadHelper(data) {
    let filename;
    let file;

    if (data.exportType === 'baseline list') {
        filename = 'baseline-list-export';
        if (data.type === 'csv') {
            file = baselinesTableHelpers.convertListToCSV(data.exportData);
        } else if (data.type === 'json') {
            file = baselinesTableHelpers.convertListToJSON(data.exportData);
        }
    } else if (data.exportType === 'baselines data') {
        filename = 'baseline-data-export';
        if (data.type === 'csv') {
            file = editBaselineHelpers.convertDataToCSV(data.exportData, data.baselineRowData);
        } else if (data.type === 'json') {
            file = JSON.stringify(editBaselineHelpers.convertDataToJSON(data.exportData));
        }
    }

    if (file === undefined) {
        return 'failure';
    }

    let today = new Date();
    filename += today.toISOString();

    downloadFile(file, filename, data.type);
    return 'success';
}

export default {
    findSelectedOnPage,
    findCheckedValue,
    paginateData,
    buildSystemsTableWithSelectedHSP,
    downloadHelper
};
