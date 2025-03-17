import { useStore } from "../../stores/StoreContext.jsx";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import EditIcon from "@mui/icons-material/Edit"; // Import Material UI Edit Icon
import DetailsIcon from "@mui/icons-material/Details";
import IconButton from "@mui/material/IconButton";
import TableComponent from "../../components/TableComponent.jsx";
import { convertTimestampToDate, formatDate } from "../../utils/constant.js";

const VersionTable = ({ processName }) => {
  const { page, handleChangePagination, getVersionPageByProcess, search, setProcessName } = useStore().versionStore;
  useEffect(() => {
    if (processName) {
      setProcessName(processName);
      getVersionPageByProcess(search, processName);
    }
  }, []);
  const columns = [
    {
      accessorKey: "#",
      header: "#",
      size: 10,
      Cell: (info) => info.row.index + 1,
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      header: "Action",
      id: "action",
      Cell: ({ row }) => (
        <>
          <IconButton onClick={() => handleEdit(row)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleViewDetails(row)} color="primary">
            <DetailsIcon />
          </IconButton>
        </>
      ),
      size: 100,
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      header: "Create Date",
      size: 150,
      Cell: ({ row }) => {
        return convertTimestampToDate(row.original.data.createdAt);
      },
    },
    {
      accessorKey: "createdBy",
      header: "Created by",
      size: 150,
    },
    {
      accessorKey: "data.versionName",
      header: "Version Name",
      size: 150,
    },
    {
      accessorKey: "data.processName",
      header: "Process Name",
      size: 150,
    },
    {
      accessorKey: "data.comment",
      header: "Comment",
      size: 150,
    },
  ];
  const handleEdit = (row) => {
    window.location.replace(`/${row?.original?.data.processName}/${row?.original?.data.versionName}`);
  };
  const handleViewDetails = (row) => {
    console.log("row data:", row.original);

    const processName = row?.original?.data?.processName;
    const versionId = row?.original?.id; // Đảm bảo ID của version đúng
    if (!processName || !versionId) {
      console.error("Thiếu dữ liệu processName hoặc versionId");
      return;
    }

    window.location.replace(`/version/${processName}/${versionId}`);
  };
  return (
    <>
      <TableComponent
        data={page.rows}
        columns={columns}
        pageCount={page.totalPages}
        rowCount={page.totalRecords}
        pagination={{
          pagination: {
            pageSize: search.pageSize,
            pageIndex: search.pageIndex,
          },
        }}
        handleChangePagination={handleChangePagination}
      />
    </>
  );
};

export default observer(VersionTable);
