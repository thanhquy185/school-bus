import { useState, useMemo, useEffect } from "react";
import type { TablePaginationConfig } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";

// Custom Pagination Props
export function CustomPaginationProps<T>(
  data: T[],
  pageSize: number = 10,
  pageSizeOptions: number[] = [1, 10, 20, 30, 40, 50],
  sortThreshold: number = 1000 // ngưỡng chuyển sang gọi API
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend" | null>(null);

  const currentItems = useMemo(() => {
    let items = [...data];

    const shouldSortLocally = data.length < sortThreshold;

    if (shouldSortLocally && sortField && sortOrder) {
      items.sort((a, b) => {
        const aValue = (a as any)[sortField];
        const bValue = (b as any)[sortField];

        if (typeof aValue === "string") {
          return sortOrder === "ascend"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortOrder === "ascend" ? aValue - bValue : bValue - aValue;
      });
    }

    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage, sortField, sortOrder]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: any,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) => {
    if (!Array.isArray(sorter)) {
      setSortField((sorter.field as string) || null);
      setSortOrder(sorter.order || null);
    }

    if (pagination.current !== currentPage) {
      setCurrentPage(pagination.current!);
    }

    if (pagination.pageSize !== itemsPerPage) {
      setItemsPerPage(pagination.pageSize!);
      setCurrentPage(1);
    }
  };

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [data]);

  return {
    currentItems,
    handleTableChange,
    paginationProps: {
      current: currentPage,
      pageSize: itemsPerPage,
      total: data.length,
      showSizeChanger: true,
      pageSizeOptions: pageSizeOptions,
    },
    sortField,
    sortOrder,
  };
}