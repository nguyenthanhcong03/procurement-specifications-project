import { useStore } from "../../stores/StoreContext.jsx";
import { Form, Formik } from "formik";
import CustomField from "../../components/CustomField.jsx";
import Button from "@mui/material/Button";
import * as React from "react";
import { TYPE_FIELD } from "../../utils/enum.js";
import { Search } from "@mui/icons-material";

const ProcessFilter = () => {
    const { search, getProcessPage } = useStore().processStore;

    const handleSubmit = (value) => {
        getProcessPage(value);
    };

    return (
        <Formik
            initialValues={{
                pageIndex: 1,
                pageSize: search.pageSize,
                fromDate: null,
                toDate: null,
                search: search.search
            }}
            onSubmit={handleSubmit}
        >
            {({ errors, touched, handleChange, handleBlur }) => (
                <Form>
                    <div className="flex flex-col gap-6">
                        {/* Grid for Input Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Keyword Search Field */}
                            <div>
                                <CustomField
                                    name="search"
                                    label="Keyword"
                                    type={TYPE_FIELD.INPUT}
                                    touched={touched}
                                    errors={errors}
                                    placeholder="Search by keyword..."
                                    className="w-full"
                                />
                            </div>

                            {/* From Date Field */}
                            <div>
                                <CustomField
                                    name="fromDate"
                                    label="Create date from"
                                    type={TYPE_FIELD.DATE}
                                    touched={touched}
                                    errors={errors}
                                    className="w-full"
                                />
                            </div>

                            {/* To Date Field */}
                            <div>
                                <CustomField
                                    name="toDate"
                                    label="Create date to"
                                    type={TYPE_FIELD.DATE}
                                    touched={touched}
                                    errors={errors}
                                    className="w-full"
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
    );
};

export default ProcessFilter;