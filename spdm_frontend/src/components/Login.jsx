import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import * as Yup from "yup";
import AppTheme from "../theme/shared-theme/AppTheme.jsx";
import {NavLink, useNavigate} from "react-router-dom";
import {login} from "../services/authService.js";
import {Field, Form, Formik} from "formik";
import {Alert, Snackbar} from "@mui/material";
import {useState} from "react";
import {toast} from "react-toastify";

const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignInContainer = styled(Stack)(({theme}) => ({
    minHeight: '100%',
    minWidth: '500px',
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

const Login = (props) => {
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = async (data) => {
        try {
            const response = await login(data);
            if (response.status === 200) {
                toast.success('Login successfully');
                window.location.replace('/');
            }
        } catch (e) {
            toast.error('Login failed, please try again!');
        }
    };
    const validationSchema = Yup.object({
        username: Yup.string()
            .required("Username is required")
            .min(3, "Username must be at least 3 characters"),
        password: Yup.string()
            .required("Password is required")
            .min(6, "Password must be at least 6 characters"),
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
            </Snackbar>
            <CssBaseline enableColorScheme/>
            <SignInContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                    >
                        Sign in
                    </Typography>
                    <Formik
                        initialValues={{
                            username: "",
                            password: "",
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
                                    {({field, form}) => (
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <label
                                                htmlFor="username"
                                                style={{
                                                    fontWeight: 'bold',
                                                    fontSize: '14px',
                                                    alignSelf: 'flex-start',
                                                    color: form.touched.username && form.errors.username ? 'hsl(0, 90%, 40%)' : 'black', // Change label color on error
                                                }}
                                            >
                                                Username
                                            </label>
                                            <TextField
                                                {...field}
                                                id="username"
                                                placeholder="Username"
                                                autoComplete="current-username"
                                                error={form.touched.username && Boolean(form.errors.username)}
                                                helperText={form.touched.username && form.errors.username}
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
                                <Button type="submit" fullWidth variant="contained">
                                    Sign in
                                </Button>

                                {/*<Link*/}
                                {/*    component="button"*/}
                                {/*    type="button"*/}
                                {/*    onClick={handleClickOpen}*/}
                                {/*    variant="body2"*/}
                                {/*    sx={{alignSelf: "center"}}*/}
                                {/*>*/}
                                {/*    Forgot your password?*/}
                                {/*</Link>*/}
                            </Box>
                        )}
                    </Formik>
                    <Divider>or</Divider>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <Typography sx={{textAlign: 'center'}}>
                            Don&apos;t have an account?{' '}
                            <NavLink
                                variant="body2"
                                sx={{alignSelf: 'center'}}
                                to={'/register'}>
                                Sign up
                            </NavLink>
                        </Typography>
                    </Box>
                </Card>
            </SignInContainer>
        </AppTheme>
    );
}
export default Login