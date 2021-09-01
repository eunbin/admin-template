import React, { useCallback } from 'react';
import { ICellRendererParams } from 'ag-grid-community';

interface Props extends ICellRendererParams {
  onClickLink: (data: any) => void;
}

const LinkCellRenderer = (props: Props) => {
  const cellValue = props.valueFormatted ? props.valueFormatted : props.value;

  const handleClick = useCallback(() => {
    const data = props?.node.data;
    props?.onClickLink(data);
  }, [props]);

  return <a onClick={handleClick}>{cellValue}</a>;
};

export default LinkCellRenderer;
