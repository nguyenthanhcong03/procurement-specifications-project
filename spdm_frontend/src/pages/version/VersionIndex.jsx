import VersionTable from "./VersionTable.jsx";
import {Card, CardContent, CardHeader, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import ProcessFilter from "../process/ProcessFilter.jsx";
import ProcessTable from "../process/ProcessTable.jsx";
import VersionFilter from "./VersionFilter.jsx";

const VersionIndex = () => {
    const {processName} = useParams();
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header with subtle animation */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center animate-fade-in">
                        Version Manager
                        <span className="block text-lg font-normal text-gray-500 mt-2">
                        Manage and monitor your version efficiently
                    </span>
                    </h1>

                    {/* Filter Section with Glassmorphism Effect */}
                    <div
                        className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8 border border-white/20 hover:shadow-xl transition-shadow duration-300">
                        <VersionFilter/>
                    </div>

                    {/* Table Section with Enhanced Styling */}
                    <VersionTable processName={processName}></VersionTable>
                </div>
            </div>
        </>
    )
}
export default VersionIndex;