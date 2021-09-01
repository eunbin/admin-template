import React from 'react';
import { AgGridColumn, AgGridColumnProps, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  RowClickedEvent,
} from 'ag-grid-community';
import { CustomTooltip } from 'components';

interface Props {
  columns: AgGridColumnProps[];
  rowData: any[];
  onGridReady?: any;
  onRowClicked?: (event: RowClickedEvent) => void;
  onRowSelected?: (event: RowClickedEvent) => void;
  frameworkComponents?: any;
}

function DataGrid({
  columns,
  rowData,
  onGridReady,
  onRowClicked,
  onRowSelected,
  frameworkComponents,
}: Props) {
  const renderColumns = () =>
    columns?.map((column) => (
      <AgGridColumn
        key={column.field}
        {...column}
        tooltipComponentParams={{ color: '#ececec' }}
      />
    ));

  return (
    <div css={{ width: '100%', height: '100%' }}>
      <div className="example-wrapper">
        <div
          id="myGrid"
          css={{
            height: '100%',
            width: '100%',
          }}
          className="ag-theme-alpine"
        >
          <AgGridReact
            defaultColDef={{
              flex: 1,
              minWidth: 100,
              resizable: true,
              headerCheckboxSelection: isFirstColumn,
              checkboxSelection: isFirstColumn,
              tooltipComponent: 'CustomTooltip',
            }}
            frameworkComponents={{
              ...frameworkComponents,
              CustomTooltip,
            }}
            tooltipShowDelay={0}
            rowData={rowData}
            rowSelection="multiple"
            suppressRowClickSelection
            onGridReady={onGridReady}
            onRowClicked={onRowClicked}
            onRowSelected={onRowSelected}
          >
            {renderColumns()}
          </AgGridReact>
        </div>
      </div>
    </div>
  );
}

function isFirstColumn(
  params:
    | CheckboxSelectionCallbackParams
    | HeaderCheckboxSelectionCallbackParams
) {
  const displayedColumns = params.columnApi.getAllDisplayedColumns();
  return displayedColumns[0] === params.column;
}

export default DataGrid;
