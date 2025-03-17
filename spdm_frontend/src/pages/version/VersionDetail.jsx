import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import TableComponent from "../../components/TableComponent.jsx";
import { useStore } from "../../stores/StoreContext.jsx";

import { observer } from "mobx-react-lite";
import { convertTimestampToDate } from "../../utils/constant.js";

const VersionDetail = () => {
  const { processName } = useParams();

  const { page, handleChangePagination, getVersionPageByProcess, search, setProcessName } = useStore().versionStore;
  useEffect(() => {
    if (processName) {
      setProcessName(processName);
      getVersionPageByProcess(search, processName);
    }
    console.log(page);
  }, []);

  const columns = [
    {
      accessorKey: "subLabel",
      header: "SubLabel",
      size: 150,
    },
    {
      accessorKey: "data.key1",
      header: "Label Name",
      size: 150,
    },
    {
      accessorKey: "data.processName",
      header: "Diffrent key",
      size: 150,
    },
    {
      accessorKey: "data.comment",
      header: "Previous version",
      size: 150,
    },
    {
      accessorKey: "data.comment",
      header: "Current version",
      size: 150,
    },
  ];
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with subtle animation */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center animate-fade-in">Version detail</h1>

          {/* Filter Section with Glassmorphism Effect */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8 border border-white/20 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col gap-2">
              <div>
                <p>
                  <strong>Process name </strong>
                  {processName}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <p>
                  <strong>Current version </strong>
                  {page?.rows[0]?.data?.versionName}
                </p>
                <p>
                  <strong>Created Date </strong>
                  {convertTimestampToDate(page?.rows[0]?.data?.createdAt)}
                </p>
                <p>
                  <strong>Created by </strong>
                  {page?.rows[0]?.createdBy}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <p>
                  <strong>Previous version </strong>
                  {page?.rows[1]?.data?.versionName}
                </p>
                <p>
                  <strong>Created Date </strong>
                  {convertTimestampToDate(page?.rows[1]?.data?.createdAt)}
                </p>
                <p>
                  <strong>Created by </strong>
                  {page?.rows[1]?.createdBy}
                </p>
              </div>
            </div>
          </div>

          {/* Table Section with Enhanced Styling */}
          <div>
            <h4>Difference between the two versions</h4>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default observer(VersionDetail);
