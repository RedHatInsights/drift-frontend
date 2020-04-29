import React from 'react';
import { CloseIcon, HistoryIcon } from '@patternfly/react-icons';
import helpers from '../helpers';

/*eslint-disable camelcase*/
describe('helpers', () => {
    it.skip('buildSystemsTableWithSelectedHSP returns selected HSP', () => {
        const rows = [
            { display_name: 'system1', id: 'abcd1234' },
            { display_name: 'system2', id: '1234abcd' }
        ];
        const selectedHSP = {
            captured_date: '2020-08-04T18:23:23+00:00',
            id: 'efgh5678',
            system_id: 'abcd1234'
        };
        const deselectHistoricalProfiles = jest.fn();
        const expected = [
            {
                display_name: 'system1',
                display_selected_hsp:
                    <React.Fragment>
                        <div>system1</div>
                        <div>
                            <HistoryIcon
                                className="active-blue margin-right-5-px"
                                color="currentColor"
                                noVerticalAlign={ false }
                                size="sm"
                            />
                                04 Aug 2020, 18:23 UTC
                            <CloseIcon
                                className="pointer active-blue margin-left-5-px"
                                color="currentColor"
                                noVerticalAlign={ false }
                                onClick={ () => deselectHistoricalProfiles() }
                                size="sm"
                            />
                        </div>
                    </React.Fragment>,
                id: 'abcd1234',
                selected: false
            },
            {
                display_name: 'system2',
                display_selected_hsp: 'system2',
                id: '1234abcd',
                selected: false
            }
        ];

        expect(helpers.buildSystemsTableWithSelectedHSP(rows, selectedHSP, deselectHistoricalProfiles)).toEqual(expected);
    });
});
/*eslint-enable camelcase*/
