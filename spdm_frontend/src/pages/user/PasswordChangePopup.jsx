import {useStore} from "../../stores/StoreContext.jsx";
import DialogTitle from "@mui/material/DialogTitle";
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import {Field, Form, Formik} from "formik";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as React from "react";
import BootstrapDialog from "../../components/BootstrapDialog.jsx";
import {observer} from "mobx-react-lite";
import CustomField from "../../components/CustomField.jsx";
import * as Yup from "yup";
import {RolesEnums, TYPE_FIELD} from "../../utils/enum.js";

const PasswordChangePopup = ({open, handleChangePassword, isReset = false, handleChangePasswordStatus}) => {
    const {
        user,
    } = useStore().userStore;

    const validationSchema = Yup.object().shape({
        ...(isReset
            ? {
                password: Yup.string()
                    .min(6, "Password must be at least 6 characters")
                    .required("Password is required"),
                newPassword: Yup.string()
                    .min(6, "Password must be at least 6 characters")
                    .required("Password is required"),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
                    .required("Confirm password is required"),
            }
            : {
                password: Yup.string()
                    .test('password-test', 'Custom error message based on condition', function (value) {
                        const {password, isChangePassword} = this.parent; // Access other fields like confirmPassword

                        if (isChangePassword) {
                            if (!password || password === '') {
                                return this.createError({message: 'Password is required'});
                            }
                            if (password.length < 6) {
                                return this.createError({message: 'Password must be at least 6 characters'});
                            }
                        }
                        return true;
                    }),

                newPassword: Yup.string()
                    .test('new-password-test', 'Custom error message for new password', function (value) {
                        const {password, isChangePassword} = this.parent; // Access other fields like confirmPassword
                        if (isChangePassword) {
                            if (!value || value === '') {
                                return this.createError({message: 'New password is required'});
                            }
                            if (value.length < 6) {
                                return this.createError({message: 'New password must be at least 6 characters'});
                            }
                            if (value === password) {
                                return this.createError({message: 'New password cannot be the same as the current password'});
                            }
                        }
                        return true;
                    }),

                confirmPassword: Yup.string()
                    .test('confirm-password-test', 'Custom error message for confirm password', function (value) {
                        const {newPassword, isChangePassword} = this.parent;

                        if (isChangePassword) {
                            if (!value || value === '') {
                                return this.createError({message: 'Confirm password is required'});
                            }
                            if (value !== newPassword) {
                                return this.createError({message: 'Passwords must match'});
                            }
                        }
                        return true;
                    })
            }),
    });


    return (
        <BootstrapDialog
            aria-labelledby="customized-dialog-title"
            open={open}
            onClose={handleChangePasswordStatus}
        >
            <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                {isReset ? "Reset password" : "Edit user"}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleChangePasswordStatus}
                sx={(theme) => ({
                    position: "absolute",
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
                        username: user?.username || "",
                        newPassword: "",
                        password: "",
                        confirmPassword: "",
                        role: user?.role,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(value) => {
                        handleChangePassword(value)
                        handleChangePasswordStatus()
                    }}
                >
                    {({values, errors, touched}) => (
                        <Box
                            component={Form}
                            noValidate
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                minWidth: "500px",
                                minHeight: "300px",
                                gap: 2,
                            }}
                        >
                            <CustomField
                                disabled={true}
                                name="username"
                                type="text"
                                label="Username"
                                touched={touched}
                                errors={errors}
                            />
                            {isReset ? (
                                    <>
                                        <CustomField
                                            name="password"
                                            type={TYPE_FIELD.PASSWORD}
                                            label="Password"
                                            touched={touched}
                                            errors={errors}
                                        />
                                        <CustomField
                                            name="newPassword"
                                            type={TYPE_FIELD.PASSWORD}
                                            label="New password"
                                            touched={touched}
                                            errors={errors}
                                        />
                                        <CustomField
                                            name="confirmPassword"
                                            type={TYPE_FIELD.PASSWORD}
                                            label="Confirm password"
                                            touched={touched}
                                            errors={errors}
                                        />
                                    </>
                                ) :
                                <>
                                    <CustomField
                                        name="password"
                                        type="password"
                                        placeholder="••••••"
                                        label="New password"
                                        touched={touched}
                                        errors={errors}
                                    />
                                    <CustomField
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••"
                                        label="Confirm password"
                                        touched={touched}
                                        errors={errors}
                                    />
                                    <CustomField
                                        name="role"
                                        label="Role"
                                        type={TYPE_FIELD.RADIO}
                                        options={Object.entries(RolesEnums).map(([key, value]) => ({
                                            value: key,
                                            label: value
                                        }))}
                                        touched={touched}
                                        errors={errors}
                                    />
                                </>}
                            <Button type="submit" fullWidth variant="contained" sx={{mt: 2}}>
                                Save
                            </Button>
                        </Box>
                    )}
                </Formik>
            </DialogContent>
        </BootstrapDialog>
    )
        ;
};

export default observer(PasswordChangePopup);
