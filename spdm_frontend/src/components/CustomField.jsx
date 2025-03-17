import * as React from 'react';
import {Field} from 'formik';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextField from "@mui/material/TextField";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {Radio, FormControlLabel, RadioGroup, Checkbox, FormControlLabel as MuiFormControlLabel} from "@mui/material";  // Added Checkbox
import {TYPE_FIELD} from "../utils/enum.js";
import {isAfter} from "date-fns";

const CustomField = ({name, label, touched, errors, required = false, type = "text", options = [], ...props}) => {
    const today = new Date();
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Field name={name}>
            {({field, form: {setFieldValue, handleChange}}) => (
                <div className="flex-column-no-gap">
                    {type !== TYPE_FIELD.CHECKBOX && <label
                        htmlFor={name}
                        style={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            alignSelf: "flex-start",
                            color: touched[name] && errors[name] ? "hsl(0, 90%, 40%)" : "black",
                        }}
                    >
                        {label} {required && <span style={{color: "red"}}>*</span>}
                    </label>}

                    {type === TYPE_FIELD.DATE ? (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                value={field.value || undefined}
                                onChange={(value) => {
                                    if (value && isAfter(value, today)) {
                                        setFieldValue(name, today);
                                    } else {
                                        setFieldValue(name, value || "");
                                    }
                                }}
                                format="dd-MM-yyyy"
                                shouldDisableDate={(date) => isAfter(date, today)}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        fullWidth: true,
                                        variant: "outlined",
                                        error: touched[name] && Boolean(errors[name]),
                                        helperText: touched[name] && errors[name],
                                        id: name,
                                        autoComplete: `current-${name}`,
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    ) : type === TYPE_FIELD.INPUT_SEARCH ? (
                        <div className="flex-column-no-gap">
                            <TextField
                                sx={{ml: 1, flex: 1, fontSize: "0.875rem"}}
                                placeholder={label || "Search..."}
                                inputProps={{"aria-label": label || "Search..."}}
                                {...field}
                                onChange={handleChange}
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <IconButton type="submit" sx={{p: "6px"}} aria-label="search">
                                            <SearchIcon sx={{fontSize: "1.2rem"}}/>
                                        </IconButton>
                                    ),
                                }}
                            />
                        </div>
                    ) : type === TYPE_FIELD.RADIO ? (
                        <RadioGroup
                            {...field}
                            name={name}
                            value={field.value || ""}
                            onChange={handleChange}
                            row
                        >
                            {options.map((option) => (
                                <FormControlLabel
                                    key={option.value}
                                    value={option.value}
                                    control={<Radio/>}
                                    label={option.label}
                                />
                            ))}
                        </RadioGroup>
                    ) : type === TYPE_FIELD.CHECKBOX ? ( // Checkbox condition added

                        <MuiFormControlLabel
                            sx={{
                                width: 'fit-content',
                            }}
                            control={
                                <Checkbox
                                    name={name}
                                    {...field}
                                    checked={field.value || false}
                                    onChange={handleChange}
                                    color="primary"
                                />
                            }
                            label={label}
                        />
                    ) : (
                        <TextField
                            {...field}
                            {...props}
                            type={type === TYPE_FIELD.PASSWORD ? (showPassword ? TYPE_FIELD.INPUT : TYPE_FIELD.PASSWORD) : type}
                            size="small"
                            value={field.value || ""}
                            id={name}
                            autoComplete={`current-${name}`}
                            error={touched[name] && Boolean(errors[name])}
                            helperText={touched[name] && errors[name]}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                endAdornment:
                                    type === TYPE_FIELD.PASSWORD ? (
                                        <IconButton onClick={togglePasswordVisibility} edge="end">
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    ) : null,
                            }}
                        />
                    )}
                </div>
            )}
        </Field>
    );
};

export default CustomField;
