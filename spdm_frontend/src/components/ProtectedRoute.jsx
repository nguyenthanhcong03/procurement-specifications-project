import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ permissions, children }) => {
    if (permissions) {
        toast.warning("You don't have permission!");
        return <Navigate to="/" replace />;
    }
    return children; // Render children if permission is true
};

export default ProtectedRoute;
