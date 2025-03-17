import ProcessTable from "./ProcessTable.jsx";
import ProcessFilter from "./ProcessFilter.jsx";

const ProcessIndex = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with subtle animation */}
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center animate-fade-in">
                    Process Manager
                    <span className="block text-lg font-normal text-gray-500 mt-2">
                        Manage and monitor your processes efficiently
                    </span>
                </h1>

                {/* Filter Section with Glassmorphism Effect */}
                <div
                    className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8 border border-white/20 hover:shadow-xl transition-shadow duration-300">
                    <ProcessFilter/>
                </div>

                {/* Table Section with Enhanced Styling */}
                <ProcessTable/>
            </div>
        </div>
    );
};

export default ProcessIndex;