import UserTable from "./UserTable.jsx";
import {Card, CardContent, CardHeader, Typography} from "@mui/material";
import UserFilter from "./UserFilter.jsx";
import ProcessFilter from "../process/ProcessFilter.jsx";
import ProcessTable from "../process/ProcessTable.jsx";

const UserIndex = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with subtle animation */}
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center animate-fade-in">
                    User Manager
                    <span className="block text-lg font-normal text-gray-500 mt-2">
                        Manage and monitor your users efficiently
                    </span>
                </h1>

                {/* Filter Section with Glassmorphism Effect */}
                <div
                    className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8 border border-white/20 hover:shadow-xl transition-shadow duration-300">
                    <UserFilter/>
                </div>

                {/* Table Section with Enhanced Styling */}
                <UserTable/>
            </div>
        </div>
    );
};

export default UserIndex;
