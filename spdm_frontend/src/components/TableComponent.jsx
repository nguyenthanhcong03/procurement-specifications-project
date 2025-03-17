import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

const TaleComponent = ({
  columns,
  data,
  pageCount,
  rowCount,
  handleChangePagination,
  enableTopToolbar = false,
  pagination,
  enablePagination = true,
  ...props
}) => {
  // Configure the table using useMaterialReactTable hook
  const table = useMaterialReactTable({
    ...props, // Spread additional props
    columns, // Table columns
    data, // Table data
    pageCount, // Total number of pages
    rowCount, // Total number of rows
    autoResetPageIndex: false, // Prevent auto-resetting page index
    initialState: { pagination }, // Set initial pagination state
    enableSorting: false, // Disable sorting
    enableFilters: false, // Disable filters
    enableColumnActions: false, // Disable column actions
    enableTopToolbar: enableTopToolbar, // Conditionally enable top toolbar
    ...(enablePagination
      ? {
          onPaginationChange: (updater) => {
            // Handle pagination change
            handleChangePagination((old) => (updater instanceof Function ? updater(old) : updater));
          },
          manualPagination: true, // Enable manual pagination control
          muiPaginationProps: {
            color: "primary", // Use primary color for pagination
            rowsPerPageOptions: [5, 10, 20, 30], // Rows per page options
            shape: "rounded", // Rounded pagination buttons
            variant: "outlined", // Outlined pagination buttons
            showRowsPerPage: false, // Show rows per page dropdown
            defaultPage: 1, // Default page index
            page: pagination.pageIndex, // Current page index
          },
        }
      : {}),

    paginationDisplayMode: "pages", // Display pagination as pages
    enableStickyHeader: true, // Enable sticky header
    enableStickyFooter: true, // Enable sticky footer
    muiTableHeadCellProps: {
      align: "center", // Center align header cells
      sx: {
        top: 0,
        zIndex: 9999,
        border: "1px solid rgba(81, 81, 81, .5)", // Add border to header cells
        backgroundColor: "#f5f5f5", // Light gray background for header
        fontWeight: "bold", // Bold font for header
      },
    },
    muiTableBodyCellProps: {
      sx: {
        padding: "8px 10px", // Adjust cell padding
        border: "1px solid rgba(81, 81, 81, .5)", // Add border to body cells
        fontSize: "0.875rem", // Set font size
      },
    },
    muiTableContainerProps: {
      sx: {
        height: "100%",
        borderRadius: "8px", // Add rounded corners
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add subtle shadow
      },
    },
    muiTableProps: {
      sx: {
        height: "100%",
      },
    },
    muiTablePaperProps: {
      sx: {
        height: "100%",
      },
    },
  });

  return <MaterialReactTable table={table} />;
};

export default TaleComponent;
