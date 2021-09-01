import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { AgGridColumnProps } from 'ag-grid-react';
import {
  ColumnApi,
  GridApi,
  GridReadyEvent,
  RowClickedEvent,
  RowSelectedEvent,
} from 'ag-grid-community';
import API from 'api';
import PageLayout from 'layouts/PageLayout';
import { DataGrid, DataGridToolbar } from 'components';
import { Button, Input } from 'antd';
import useConfirm from 'hooks/useConfirm';
import useNotification from 'hooks/useNotification';
import { useModal } from 'contexts/ModalProvider';
import { useDrawer } from 'contexts/DrawerProvider';
import LinkCellRenderer from 'pages-components/projects/settings/ag-grid/renderes/LinkCellRenderer';
import MedalCellRenderer from 'pages-components/projects/settings/ag-grid/renderes/MedalCellRenderer';

const { Search } = Input;

function AgGridPage() {
  const { showModal, closeModal } = useModal();
  const { showDrawer, closeDrawer } = useDrawer();
  const { showConfirm } = useConfirm();
  const { showNotification } = useNotification();

  const { data } = useQuery('winners', API.agGrid.winners.list);

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null);

  const [deleteDisabled, setDeleteDisabled] = useState<boolean>(true);

  const columns: AgGridColumnProps[] = useMemo(
    () => [
      {
        field: 'athlete',
        minWidth: 200,
        sortable: true,
        filter: true,
        tooltipField: 'athlete',
        tooltipComponentParams: { color: '#ececec' },
        cellRenderer: 'LinkCellRenderer',
        cellRendererParams: {
          onClickLink: (data: any) => {
            import(
              'pages-components/projects/settings/ag-grid/DetailDrawer'
            ).then(({ default: Component }) => {
              showDrawer({
                component: Component,
                drawerProps: {
                  onClose: () => {},
                  onSubmit: (values: any) => {
                    console.log('submitted ', values);
                    showNotification({
                      description: `${values.athlete} saved successfully`,
                    });
                    closeDrawer();
                  },
                  data: data,
                },
              });
            });
          },
        },
      },
      {
        field: 'age',
        sortable: true,
        filter: true,
        colId: 'params',
        cellRenderer: (params) => params.value,
      },
      {
        field: 'country',
        minWidth: 150,
        sortable: true,
        filter: true,
        tooltipField: 'country',
      },
      {
        field: 'year',
        sortable: true,
        filter: true,
      },
      {
        field: 'date',
        sortable: true,
        filter: true,
      },
      {
        field: 'sport',
        minWidth: 150,
        sortable: true,
        filter: true,
      },
      {
        field: 'gold',
        sortable: true,
        filter: true,
        cellRenderer: 'MedalCellRenderer',
      },
      {
        field: 'silver',
        sortable: true,
        filter: true,
        cellRenderer: 'MedalCellRenderer',
      },
      {
        field: 'bronze',
        sortable: true,
        filter: true,
        cellRenderer: 'MedalCellRenderer',
      },
      {
        field: 'total',
        sortable: true,
        filter: true,
        minWidth: 250,
      },
    ],
    [closeDrawer, showDrawer, showNotification]
  );

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const handleFilter = (e: any) => {
    // TODO: debounce
    console.log('search', e);
    gridApi?.setQuickFilter(e);
  };

  const handleRowSelected = (e: RowSelectedEvent) => {
    const selectedRows = gridApi?.getSelectedRows();
    const newValue = selectedRows && selectedRows.length > 0;
    setDeleteDisabled(!newValue);
  };

  const handleRowClicked = (e: RowClickedEvent) => {};

  const handleAddClick = () => {
    import('pages-components/projects/settings/ag-grid/AddDataModal').then(
      ({ default: Component }) => {
        showModal({
          component: Component,
          modalProps: {
            onOk: (values: any) => {
              // TODO: api call
              closeModal();
              showNotification({
                description: `${values.athlete} added successfully`,
              });
            },
          },
        });
      }
    );
  };

  const handleDeleteClick = () => {
    showConfirm({
      content: 'Delete?',
      onOk: () => {
        const selectedRows = gridApi?.getSelectedRows();
        const ids = selectedRows?.map((row) => row.athlete);

        showNotification({
          type: 'success',
          description: `${ids?.length} item(s) deleted successfully`,
        });
      },
    });
  };

  return (
    <PageLayout>
      <DataGridToolbar
        actions={
          <>
            <Button
              disabled={deleteDisabled}
              type="primary"
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
            <Button onClick={handleAddClick}>Add</Button>
          </>
        }
        search={
          <Search
            placeholder="input search text"
            onSearch={handleFilter}
            css={{ width: 300 }}
            allowClear
            enterButton
          />
        }
      />
      <DataGrid
        columns={columns}
        rowData={data || []}
        frameworkComponents={{
          LinkCellRenderer,
          MedalCellRenderer,
        }}
        onGridReady={onGridReady}
        onRowSelected={handleRowSelected}
        onRowClicked={handleRowClicked}
      />
    </PageLayout>
  );
}

export default AgGridPage;
