import React from 'react';
import { ExpandableRowContent } from '@patternfly/react-table';
import { inlineEditFormatterFactory, TableTextInput } from '@patternfly/react-inline-edit-extension';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

const makeId = ({ column, rowIndex, columnIndex, name }) =>
    `${column.property}-${rowIndex}-${columnIndex}${name ? `-${name}` : ''}`;

const childEditRenderer = (value, { column, rowIndex, rowData, columnIndex, activeEditId }) => (
    <ExpandableRowContent>
        { rowData.data.modules.map((module, idx) => {
            const inlineStyle = {
                marginLeft: idx && '1em',
                display: 'inline-block',
                width: '48%'
            };

            const id = makeId({ rowIndex, columnIndex, column, name: `module-${idx}` });

            return (
                <TableTextInput
                    id={ id }
                    key={ id }
                    defaultValue={ module }
                    style={ inlineStyle }
                    onBlur={ newValue =>
                        this.onChange(newValue, {
                            rowIndex,
                            moduleIndex: idx
                        })
                    }
                    autoFocus={ activeEditId === id }
                />
            );
        }) }
    </ExpandableRowContent>
);

const parentEditRenderer = (value, { column, rowIndex, columnIndex, activeEditId }) => {
    const id = makeId({ rowIndex, columnIndex, column, name: 'parent-repo' });
    return (
        <TableTextInput
            id={ id }
            key={ id }
            defaultValue={ value }
            onBlur={ newValue =>
                this.onChange(newValue, {
                    rowIndex,
                    columnIndex
                })
            }
            autoFocus={ activeEditId === id }
        />
    );
};

/*eslint-disable react/display-name*/
const textInputFormatter = inlineEditFormatterFactory({
    renderValue: (value, { rowData }) =>
        rowData.hasOwnProperty('parent') ? (
            <ExpandableRowContent>{ rowData.data.modules.filter(a => a).join(', ') }</ExpandableRowContent>
        ) : (
            value
        ),
    renderEdit: (value, { column, columnIndex, rowIndex, rowData }, { activeEditId }) => {
        const renderer = rowData.hasOwnProperty('parent') ? childEditRenderer : parentEditRenderer;
        return renderer(value, { rowData, column, rowIndex, columnIndex, activeEditId });
    }
});
/*eslint-enable react/display-name*/

/*eslint-disable react/jsx-key*/
function renderLoadingRows() {
    let loadingRows = [ ...new Array(5) ].map(() =>
        [ ...new Array(2) ].map(() =>
            <Skeleton size={ SkeletonSize.md } />
        )
    );

    return loadingRows;
}
/*eslint-enable react/jsx-key*/

function renderRows(baselineData) {
    let rows = [];

    if (!baselineData) {
        rows = renderLoadingRows();
    } else {
        baselineData.baseline_facts.forEach(function(fact) {
            let row = [];
            row.push(fact.name);
            row.push(fact.value);
            rows.push({
                cells: row, isOpen: false
            });
        });
    }

    return rows;
}

function renderColumns(baselineData) {
    let columns;

    if (baselineData) {
        columns = [
            {
                title: 'Fact',
                cellFormatters: [ textInputFormatter ]
            },
            {
                title: 'Value',
                cellFormatters: [ textInputFormatter ]
            }
        ];
    } else {
        columns = [ 'Fact', 'Value' ];
    }

    return columns;
}

export default {
    renderLoadingRows,
    renderRows,
    renderColumns
};
