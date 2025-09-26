import React from "react";
import { Table } from "antd";
import type { TablePaginationConfig, TableProps } from "antd";
import type { SorterResult } from "antd/es/table/interface";

// Generic component: T là kiểu dữ liệu mỗi dòng
type CustomTableActionsProps<T> = {
  columns: TableProps<T>["columns"];
  rowKey: (record: T) => React.Key;
  data: T[];
  loading?: boolean;
  pagination?: {
    current?: number;
    pageSize?: number;
    total?: number;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
  };
  className?: string;
  onChange?: (
    pagination: TablePaginationConfig,
    _filters: any,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) => void;
};

const CustomTableActions = <T,>({
  columns,
  rowKey,
  loading = false,
  data,
  pagination,
  className,
  onChange,
}: CustomTableActionsProps<T>) => {
  return (
    <Table<T>
      columns={columns}
      rowKey={rowKey}
      dataSource={data}
      loading={loading}
      pagination={pagination}
      className={className}
      onChange={onChange}
    />
  );
};

export default CustomTableActions;