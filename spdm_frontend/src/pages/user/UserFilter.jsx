import {Form, Formik} from "formik";
import CustomField from "../../components/CustomField.jsx";
import * as React from "react";
import {Box} from "@mui/material";
import Button from "@mui/material/Button";
import {Search} from "@mui/icons-material";
import {TYPE_FIELD} from "../../utils/enum.js";
import {useStore} from "../../stores/StoreContext.jsx";

const UserFilter = () => {
    const {
        getUserPage,
        search
    } = useStore().userStore;
    return (
        <>
            <Formik
                onSubmit={getUserPage}
                initialValues={{
                    username: null,
                    pageIndex: 1,
                    pageSize: search.pageSize
                }}>
                {({errors, touched, handleChange, handleBlur}) => (
                    <Form>
                        <div className="flex flex-col gap-6">
                            {/* Grid for Input Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {/* Keyword Search Field */}
                                <div>
                                    <CustomField
                                        size={'small'}
                                        name={'username'}
                                        label="Username"
                                        touched={touched}
                                        errors={errors}
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="flex justify-center">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<Search />}
                                    className="w-full sm:w-auto px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                                >
                                    Search
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}
export default UserFilter