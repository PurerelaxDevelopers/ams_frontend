import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import RegisterEmpolyee from "./Compountes/RegisterEmpolyee";
import Attendance from "./Compountes/Attendance";
import Dashboard from "./Compountes/Dashboard";
import LoginPage from "./Compountes/LoginPage";


const ProtectedRoute = ({ element }) => {
    const isAuthenticated = localStorage.getItem("authToken"); // Check localStorage
    return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const App = () => {
    return (
        
        <div>
        <Routes>
            <Route path="/registeremployee" element={<ProtectedRoute element={<RegisterEmpolyee />} />} />
            <Route path="/attendance" element={<ProtectedRoute element={<Attendance />} />} />
            {/* <Route path="/employee" element={<ProtectedRoute element={<RegisterEmpolyee />} />} /> */}
            <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    </div>
    );
};

export default App;

