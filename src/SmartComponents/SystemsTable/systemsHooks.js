import React, { useState } from 'react';
import helpers from '../helpers';
import api from '../../api';
import { Spinner } from '@patternfly/react-core';

const useSystemsBulkSelect = (
    id = '',
    entities = {},
    selectEntities,
    bulkSelectDisabled,
    isAddSystemNotifications
) => {
    console.log(id, 'id');
    const [ isLoading, setIsLoading ] = useState(false);

    const setTitle = () => {
        let title;
        title = <React.Fragment>
            <Spinner size="sm" />
        </React.Fragment>;

        return { children: [ title ]};
    };

    const findChecked = () => {
        if (entities && entities.selectedSystemIds) {
            return helpers.findCheckedValue(entities?.total, entities?.selectedSystemIds.length);
        } else {
            return null;
        }
    };

    const checked = findChecked();

    const onBulkSelect = async (event) => {
        let toSelect = [];
        switch (event) {
            case 'none': {
                toSelect = { id: 0, selected: false, bulk: true };
                break;
            }

            case 'page': {
                toSelect = { id: 0, selected: true };
                break;
            }

            case 'all': {
                if (isAddSystemNotifications) {
                    setIsLoading(true);
                    let systemIds = await api.systemFetch(entities?.total);
                    setIsLoading(false);
                    toSelect = { id: 0, selected: true, bulk: true, systemIds };
                } else {
                    toSelect = { id: 0, selected: true, bulk: true };
                }

                break;
            }
        }

        console.log(entities, 'entities');
        //console.log(toSelect, 'toSelect');
        //console.log(selectEntities, 'selectEntities');

        selectEntities(toSelect);
    };

    const getItems = () => {
        return [{
            title: `Select none (0)`,
            onClick: () => {
                onBulkSelect('none');
            }
        }, {
            title: `Select page (${ entities?.count || 0 })`,
            onClick: () => {
                onBulkSelect('page');
            }
        }, {
            title: `Select all (${ entities?.total })`,
            onClick: () => {
                onBulkSelect('all');
            }
        }];
    };

    const bulkCheckboxClick = () => {
        if (entities?.selectedSystemIds?.length) {
            onBulkSelect('none');
        } else {
            onBulkSelect('all');
        }
    };

    return {
        toggleProps: isAddSystemNotifications && isLoading ? setTitle() : null,
        id,
        isDisabled: bulkSelectDisabled || false,
        count: entities?.selectedSystemIds?.length,
        items: getItems(),
        onSelect: () => bulkCheckboxClick(),
        checked
    };
};

export default useSystemsBulkSelect;
