import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import AppTheme from "../theme/shared-theme/AppTheme.jsx";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {
    Alert,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Radio,
    RadioGroup,
    Snackbar
} from "@mui/material";
import {RolesEnums} from "../utils/enum.js";
import {NavLink} from "react-router-dom";
import {register} from "../services/authService.js";
import {useState} from "react";
import {HttpStatusCode} from "axios";
import {toast} from "react-toastify";

const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignUpContainer = styled(Stack)(({theme}) => ({
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

const Register = (props) => {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = async (formData) => {
        const response = await register(formData)
        if (response?.status === HttpStatusCode.Ok) {
            toast.success('Register successfully');
            window.location.replace('/login');
        } else if (response?.status === HttpStatusCode.InternalServerError) {
            toast.error(response.data.message.errors.username.join(", "));
        } else {
            toast.error('Register failed!');
        }
    };
    const validationSchema = Yup.object({
        username: Yup.string()
            .required("Username is required")
            .min(3, "Username must be at least 3 characters"),
        password: Yup.string()
            .required("Password is required")
            .min(6, "Password must be at least 6 characters"),
        rePassword: Yup.string()
            .required("Confirm Password is required")
            .min(6, "Confirm Password must be at least 6 characters")
            .oneOf([Yup.ref('password'), null], "Confirm Passwords must match with Password"), // Add this line to validate password match
    });
    return (
        <AppTheme {...props}>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity={alert.type}
                    sx={{width: '100%'}}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
            <CssBaseline enableColorScheme/>
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                    >
                        Sign up
                    </Typography>
                    <Formik
                        initialValues={{
                            username: "",
                            password: "",
                            rePassword: "",
                            role: RolesEnums.USER
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({errors, touched, handleChange, handleBlur}) => (
                            <Box
                                component={Form}
                                noValidate
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "100%",
                                    gap: 2,
                                }}
                            >
                                <Field name="username">
                                    {({field}) => (
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <label
                                                htmlFor="username"
                                                style={{
                                                    fontWeight: 'bold',
                                                    fontSize: '14px',
                                                    alignSelf: 'flex-start',
                                                    color: touched.username && errors.username ? 'hsl(0, 90%, 40%)' : 'black', // Change label color on error
                                                }}
                                            >
                                                Username
                                            </label>
                                            <TextField
                                                {...field}
                                                id="username"
                                                placeholder="Username"
                                                autoComplete="current-username"
                                                error={touched.username && Boolean(errors.username)}
                                                helperText={touched.username && errors.username}
                                                fullWidth
                                                variant="outlined"
                                            />
                                        </div>
                                    )}
                                </Field>
                                <Field name="password">
                                    {({field}) => (
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <label htmlFor="password" style={{
                                                fontWeight: 'bold',
                                                fontSize: '14px',
                                                alignSelf: 'flex-start',
                                                color: touched.password && Boolean(errors.password) ? 'hsl(0, 90%, 40%)' : 'black', // Change label color on error
                                            }}>Password</label>
                                            <TextField
                                                {...field}
                                                id="password"
                                                type="password"
                                                placeholder="••••••"
                                                autoComplete="current-password"
                                                error={touched.password && Boolean(errors.password)}
                                                helperText={touched.password && errors.password}
                                                fullWidth
                                                variant="outlined"
                                            />
                                        </div>
                                    )}
                                </Field>
                                <Field name="rePassword">
                                    {({field}) => (
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <label htmlFor="rePassword" style={{
                                                fontWeight: 'bold',
                                                fontSize: '14px',
                                                alignSelf: 'flex-start',
                                                color: touched.rePassword && Boolean(errors.rePassword) ? 'hsl(0, 90%, 40%)' : 'black', // Change label color on error
                                            }}>Confirm Password</label>
                                            <TextField
                                                {...field}
                                                id="rePassword"
                                                type="password"
                                                placeholder="••••••"
                                                autoComplete="re-password"
                                                error={touched.rePassword && Boolean(errors.rePassword)}
                                                helperText={touched.rePassword && errors.rePassword}
                                                fullWidth
                                                variant="outlined"
                                            />
                                        </div>
                                    )}
                                </Field>
                                <Button type="submit" fullWidth variant="contained">
                                    Sign in
                                </Button>
                            </Box>
                        )}
                    </Formik>
                    <Divider>
                        <Typography sx={{color: 'text.secondary'}}>or</Typography>
                    </Divider>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <Typography sx={{textAlign: 'center'}}>
                            Already have an account?{' '}
                            <NavLink
                                variant="body2"
                                sx={{alignSelf: 'center'}}
                                to={'/login'}>
                                Sign in
                            </NavLink>
                        </Typography>
                    </Box>
                </Card>
            </SignUpContainer>
        </AppTheme>
    );
}
export default Register
