import {observer} from "mobx-react-lite";
import TableComponent from "../../components/TableComponent.jsx";
import {useStore} from "../../stores/StoreContext.jsx";
import IconButton from "@mui/material/IconButton";
import {AccountTree, Details, DetailsSharp} from "@mui/icons-material";
import {convertTimestampToDate, formatDate} from "../../utils/constant.js";
import {Tooltip} from "@mui/material";
import DialogComponent from "../../components/DialogComponent.jsx";
import VersionIndex from "../version/VersionIndex.jsx";
import {useEffect} from "react";

const ProcessTable = () => {
    const {
        page,
        search,
        handleChangePagination,
        getProcessPage
    } = useStore().processStore
    useEffect(() => {
        getProcessPage(search)
    }, []);
    const columns = [
        {
            accessorKey: "#",
            header: "#",
            size: 10,
            Cell: (info) => info.row.index + 1,
            muiTableBodyCellProps: {
                align: 'center',
            },
        },
        {
            header: "Detail",
            id: "detail",
            Cell: ({row}) => (
                <>
                    <Tooltip title="Detail">
                        <IconButton onClick={() => handleEdit(row)} color="primary">
                            <DetailsSharp/>
                        </IconButton>
                    </Tooltip>
                </>

            ),
            muiTableBodyCellProps: {
                align: 'center',
            },
            size: 50,
        },
        {
            header: "Versions",
            id: "versions",
            Cell: ({row}) => (
                <>
                    <Tooltip title="Retrieve version list">
                        <IconButton onClick={() => handleOpenVersionListPopup(row)} color="primary">
                            <AccountTree/>
                        </IconButton>
                    </Tooltip>
                </>

            ),

            muiTableBodyCellProps: {
                align: 'center',
            },
            size: 50,
        },
        {
            accessorKey: "data.processName",
            header: "Process name",
            size: 150,
        }, {
            header: "Created date",
            size: 150,
            Cell: ({row}) => {
                return convertTimestampToDate(row.original.data.createdAt)
            },
            muiTableBodyCellProps: {
                align: 'center',
            },
        }, {
            accessorKey: 'createdBy',
            header: "Created by",
            size: 50,
        },

    ];
    const handleEdit = (row) => {
        window.location.replace(`/${row.original.data.processName}/last-version`)
    };
    const handleOpenVersionListPopup = (row) => {
        window.location.replace(`/version/${row.original.data.processName}`)
    }
    return (
        <>
            <TableComponent data={page.rows}
                            columns={columns}
                            pageCount={page.totalPages}
                            rowCount={page.totalRecords}
                            handleChangePagination={handleChangePagination}
                            pagination={
                                {
                                    pagination: {
                                        pageSize: search.pageSize,
                                        pageIndex: search.pageIndex,
                                    }
                                }
                            }
            ></TableComponent>;
        </>
    )
}
export default observer(ProcessTable);