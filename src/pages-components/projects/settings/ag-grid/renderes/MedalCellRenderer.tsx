import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';

const MedalCellRenderer = (props: ICellRendererParams) => (
  <span>{new Array(props.value).fill('#').join('')}</span>
);

export default MedalCellRenderer;
