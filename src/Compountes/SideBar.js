import React from "react";
import { FaHome, FaUser, FaClipboardList, FaLock } from "react-icons/fa"; // Import icons from react-icons
import Logo from "../assets/image/thikse-logo.png";
import "../assets/css/Sidebar.css";



const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("username");
    window.location.href = "/login";
};



const SideBar = () => {
    return (
        <div className="d-flex flex-column vh-100 bgColor" style={{ width: "300px" }}>
            <div className="p-3">
            <img src={Logo} alt="Logo" className="img-fluid mb-2" style={{ Width: "100px" }} />
                <p className="">Attendance Management System</p>
                <ul className="nav flex-column mt-5">
                    <li className="nav-item">
                        <a href="/" className="nav-link text-dark">
                            <FaHome className="me-2" /> <span className="nav-text">Dashboard</span> 
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/attendance" className="nav-link text-dark">
                            <FaClipboardList className="me-2" /> <span className="nav-text">Attendance</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/registeremployee" className="nav-link text-dark">
                            <FaUser className="me-2" /> <span className="nav-text">Register Employee</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link text-dark" onClick={handleLogout}>
                            <FaLock className="me-2" /> <span className="nav-text" style={{color: "red"}} >Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideBar;