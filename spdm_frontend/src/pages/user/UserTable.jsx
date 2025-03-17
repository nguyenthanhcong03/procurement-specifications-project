import {useStore} from "../../stores/StoreContext.jsx";
import {observer} from "mobx-react-lite";
import {useEffect} from "react";
import IconButton from "@mui/material/IconButton";
import {PasswordRounded} from "@mui/icons-material";
import PasswordChangePopup from "./PasswordChangePopup.jsx";
import TableComponent from "../../components/TableComponent.jsx";

const UserTable = () => {
    const {
        handleResetPasswordStatus,
        page,
        search,
        handleChangePagination,
        getUserPage,
        setUser,
        isResetPassword,
        handleChangePassword,
    } = useStore().userStore;
    useEffect(() => {
        getUserPage(search);
    }, [])
    const columns = [
            {
                accessorKey: "#",
                header: "#",
                size: 50,
                Cell: (info) => info.row.index + 1,
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                header: "Action",
                id: "action",
                Cell: ({row}) => (
                    <IconButton color="primary" onClick={() => {
                        setUser(row.original)
                        handleResetPasswordStatus()
                    }}>
                        <PasswordRounded/>
                    </IconButton>
                ),
                size: 100,
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: "username",
                header:
                    "Username",
                size:
                    150,
            }
            ,
            {
                accessorKey: "role",
                header:
                    "role",
                size:
                    150,
            }
            ,
        ]
    ;

    return (
        <>
            <TableComponent data={page.rows}
                            columns={columns}
                            pageCount={page.totalPages}
                            rowCount={page.totalRecords}
                            pagination={
                                {
                                    pagination: {
                                        pageSize: search.pageSize,
                                        pageIndex: search.pageIndex,
                                    }
                                }
                            }
                            handleChangePagination={handleChangePagination}
            >
            </TableComponent>
            <PasswordChangePopup handleChangePassword={handleChangePassword} open={isResetPassword} handleChangePasswordStatus={handleResetPasswordStatus}/>
        </>
    )
}
export default observer(UserTable);
