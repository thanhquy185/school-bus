import React, { useState } from "react";
import { Table } from "antd";
import type { TablePaginationConfig, TableProps, ColumnsType } from "antd/es/table";

type CustomTableProps<T> = {
  columns: ColumnsType<T>;
  data: T[];
  rowKey?: string | ((record: T) => React.Key); // cho phép tự định nghĩa
  loading?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  className?: string;
};

function CustomTable<T>({
  columns,
  data,
  rowKey = "id", // mặc định là "id", nhưng có thể override
  loading = false,
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50, 100],
  className,
}: CustomTableProps<T>) {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: defaultPageSize,
  });

  const handleTableChange: TableProps<T>["onChange"] = (newPagination) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  return (
    <Table<T>
      columns={columns}
      dataSource={data}
      rowKey={rowKey}
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        pageSizeOptions,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} trong tổng số ${total} bản ghi`,
      }}
      onChange={handleTableChange}
      className={className}
    />
  );
}

export default CustomTable;