import { mount } from '@cypress/react';
import React from 'react';
import DriftTooltip from './DriftTooltip';

describe('DriftTooltip', () => {
    it('renders correctly', () => {
        mount(<DriftTooltip content={ <p>Hidden text</p> } body={ <span>Text</span> }/>);

        cy.get('span').click();
        cy.get('.pf-c-tooltip').should('have.text', 'Hidden text');
    });
});
