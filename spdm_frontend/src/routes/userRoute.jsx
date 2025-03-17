import React from "react";
import UserIndex from "../pages/user/UserIndex.jsx";
import {isAdmin} from "../utils/constant.js";


const userRoute = [
    {
        path: "/users",
        element: <UserIndex/>,
        permissions: isAdmin()
    },
]
export default userRoute