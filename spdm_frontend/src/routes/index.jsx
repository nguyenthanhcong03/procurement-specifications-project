import Login from "../components/Login.jsx";
import Register from "../components/SignUp.jsx";
import Layout from "../components/Layout.jsx";
import Auth from "../components/Auth.jsx";
import graphRoute from "./graphRoute.jsx";
import versionRoute from "./versionRoute.jsx";
import userRoute from "./userRoute.jsx";
import processRoute from "./processRoute.jsx";

const routes = [
    // Public Routes
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    // Protected Routes (Inside Auth)
    {
        element: <Auth />, // Auth wrapper
        children: [
            {
                path: "/",
                element: <Layout />,
                children: [
                    ...graphRoute,
                    ...versionRoute,
                    ...userRoute,
                    ...processRoute
                ]
            }
        ]
    }
];

export default routes;
