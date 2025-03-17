import {useStore} from "../../stores/StoreContext.jsx";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {observer} from "mobx-react-lite";
import {Field, Form, Formik} from "formik";
import Box from "@mui/material/Box";
import {IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import * as React from "react";
import * as Yup from "yup";
import {styled} from "@mui/material/styles";
import BootstrapDialog from "../../components/BootstrapDialog.jsx";
import CustomField from "../../components/CustomField.jsx";

const GraphPopup = () => {
    const {
        isSavePopupOpen,
        handleChangeStatusOpenPopup,
        handleCreateProcess,
    } = useStore().graphStore
    const validationSchema = Yup.object({
        processName: Yup.string()
            .required("Process Name is required"),
        // note: Yup.string()
        //     .required("Note is required")
    });
    return (
        <>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                open={isSavePopupOpen}
                onClose={handleChangeStatusOpenPopup}
            >
                <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                    Create Process
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleChangeStatusOpenPopup}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon/>
                </IconButton>
                <DialogContent dividers>
                    <Formik
                        initialValues={{
                            processName: "",
                            note: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleCreateProcess}
                    >
                        {({errors, touched, handleChange, handleBlur}) => (
                            <Box
                                component={Form}
                                noValidate
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    minWidth: "500px",
                                    gap: 2,
                                }}
                            >
                                <CustomField
                                    name="processName"
                                    label="Process Name"
                                    touched={touched}
                                    errors={errors}
                                />
                                <Button type="submit" fullWidth variant="contained">
                                    Save
                                </Button>
                            </Box>
                        )}
                    </Formik>
                </DialogContent>
            </BootstrapDialog>
        </>
    )
}
export default observer(GraphPopup)