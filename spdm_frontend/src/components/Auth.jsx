import { Component, Fragment } from "react";
import {Navigate, Outlet} from "react-router-dom";

class Auth extends Component {
    state = {
        getUserComplete: false,
        isAuthenticated: false,
    };

    componentDidMount() {
        const user = JSON.parse(sessionStorage.getItem("currentUser"));
        if (user?.token) {
            this.setState({ getUserComplete: true, isAuthenticated: true });
        } else {
            this.setState({ getUserComplete: true, isAuthenticated: false });
        }
    }

    render() {
        const { getUserComplete, isAuthenticated } = this.state;

        if (!getUserComplete) {
            // Show a loading state while checking authentication
            return <div>Loading...</div>;
        }

        if (!isAuthenticated) {
            // Redirect unauthenticated users to login
            return <Navigate to="/login" replace />;
        }

        // Render the child components for authenticated users
        return <Outlet />; // Render child routes dynamically
    }
}

export default Auth;
