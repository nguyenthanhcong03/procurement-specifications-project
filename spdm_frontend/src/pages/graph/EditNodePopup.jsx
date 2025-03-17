import {useStore} from "../../stores/StoreContext.jsx";
import * as Yup from "yup";
import DialogTitle from "@mui/material/DialogTitle";
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import {Field, Form, Formik} from "formik";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as React from "react";
import BootstrapDialog from "../../components/BootstrapDialog.jsx";
import {observer} from "mobx-react-lite";
import CustomField from "../../components/CustomField.jsx";
import {consoleLogStoreValue} from "../../utils/constant.js";
import {TYPE_NODE} from "../../utils/enum.js";

const EditNodePopup = () => {
    const {
        isEditNodePopupOpen,
        handleCloseEditNodePopup,
        handleSaveNode,
        nodeSelected
    } = useStore().graphStore
    return (
        <>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                open={isEditNodePopupOpen}
                onClose={handleCloseEditNodePopup}
            >
                <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                    Edit Node
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseEditNodePopup}
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
                            ...nodeSelected
                        }}
                        onSubmit={handleSaveNode}
                    >
                        {({values, errors, touched, handleChange, handleBlur}) => (
                            <Box
                                component={Form}
                                noValidate
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    minWidth: "500px",
                                    minHeight: "fit-content",
                                    gap: 2,
                                }}
                            >
                                {values.label === TYPE_NODE.Label1.name && (
                                    <>
                                        <CustomField
                                            name="properties.comment"
                                            label="Comment"
                                            touched={touched}
                                            errors={errors}
                                        />
                                    </>
                                )}
                                {values.label !== TYPE_NODE.Label1.name && (
                                    <>
                                        <CustomField
                                            name="properties.sublabel"
                                            label="SUBLABEL"
                                            touched={touched}
                                            errors={errors}
                                        />
                                        <CustomField
                                            name="properties.key1"
                                            label="NAME"
                                            touched={touched}
                                            errors={errors}
                                        />
                                        <CustomField
                                            name="properties.key2"
                                            label="VALUE"
                                            touched={touched}
                                            errors={errors}
                                        />
                                        <CustomField
                                            name="properties.key3"
                                            label="UNIT"
                                            touched={touched}
                                            errors={errors}
                                        />
                                    </>
                                )}
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

export default observer(EditNodePopup);