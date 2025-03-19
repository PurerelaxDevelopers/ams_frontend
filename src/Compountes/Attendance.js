import React, { useState, useEffect } from "react";
import api from "../Api/ApiService";
import { FaFilter, FaDownload, FaSearch} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import io from "socket.io-client";
import SideBar from "./SideBar";
import "../assets/css/Attendance.css";
import noAttendacne from '../assets/image/nodata1.svg';

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [filters, setFilters] = useState({
        fromDate: "",
        toDate: "",
        employeeId: "",
        employeeName: ""
    });
    const [loading, setLoading] = useState(false);

    const isFilterApplied = Object.values(filters).some(value => value.trim() !== "");

    const socket = io('https://git.thikse.in', { path: '/socket.io' });

    useEffect(() => {
         // Replace with your socket server URL

        socket.on("attendance_tracking_show_data", (data) => {
            setAttendanceData(data);
            console.log("Updated attendance data:", data);
        });

        socket.on("error", (error) => {
            console.error("Socket error:", error);
        });

        socket.emit('get_attendance_tracking_show');

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!filters.fromDate && !filters.toDate && !filters.employeeId && !filters.employeeName) {
            toast.error("Please fill at least one filter field.");
            return;
        }

        try {
            const response = await api.post("/search_the_filter_attendance_reports", filters);
            setAttendanceData(response.data);
            console.log("Filtered attendance data:", response.data);
        } catch (error) {
            toast.error("Error fetching filtered attendance data.");
            console.error("Error fetching filtered attendance data:", error);
        }
    };


    const handleDownload = async () => {

        setLoading(true);
        try {
            const response = await api.post("/download", filters, {
                responseType: "blob", // Important for handling binary data
            });

            // Create a URL for the file and trigger the download
            const url = window.URL.createObjectURL(new Blob([response.data]));
	    console.log(response.data);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "filtered_attendance.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
           
        } catch (error) {
            toast.error("Error fetching filtered attendance data.");
            console.error("Error fetching filtered attendance data:", error);
        }
        finally {
            setLoading(false);
        }

    };
    


    const handleCancel = async () => {
        setFilters({
            fromDate: "",
            toDate: "",
            employeeId: "",
            employeeName: ""
        });

        socket.emit('get_attendance_tracking_show');

    };

    return (
        <div className="d-flex">
            <SideBar />
            <div className="container  mt-3">
                <div className="d-flex justify-content-between mb-3 container-bg p-3">
                <h1 className="text-center text-uppercase" style={{fontFamily:"monospace"}}>Attendance</h1>

                {/* Button to Open Drawer */}
                <div className="d-flex">
                {isFilterApplied && (<button className="button-34-g mb-3 me-2" onClick={handleDownload} disabled={loading}>
                   {loading ? (<div class="spinner-border" style={{width: "20px",  height: "20px"}} role="status"></div>) : (<FaDownload className="me-2" />)} Download         
                </button>)}
                <button className="button-34 mb-3" data-bs-toggle="offcanvas" data-bs-target="#attendanceFilterDrawer">
                    <FaFilter className="me-2" /> Filters
                </button>
                </div>
                </div>

                {/* Bootstrap Offcanvas Drawer */}
                <div className="offcanvas offcanvas-end" tabIndex="-1" id="attendanceFilterDrawer">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title"><FaSearch className="me-2"/> Filter Attendance</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                    </div>
                    <div className="offcanvas-body">
                        
                            <div className="mb-3">
                                <label className="form-label">From Date</label>
                                <input
                                    type="date"
                                    name="fromDate"
                                    value={filters.fromDate}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">To Date</label>
                                <input
                                    type="date"
                                    name="toDate"
                                    value={filters.toDate}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Employee ID</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={filters.employeeId}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter Employee ID"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Employee Name</label>
                                <input
                                    type="text"
                                    name="employeeName"
                                    value={filters.employeeName}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter Employee Name"
                                />
                            </div>
                            <div className="d-flex">
                                <button type="submit" className="btn btn-success w-50 me-3" onClick={handleSearch} data-bs-dismiss="offcanvas">Search</button>
                                <button type="submit" className="btn w-50 " style={{background: "red", color: "white"}} onClick={handleCancel} data-bs-dismiss="offcanvas">Cancel</button>
                            </div>
                        
                    </div>
                </div>

                {/* Table to Display Attendance Data */}
                {attendanceData.length > 0 ? (
                    <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
                    <table className="table table-striped"> 
                        <thead style={{ position: "sticky", top: "0", background: "#618cd8", zIndex: "10" }}>
                            <tr className="text-center">
                                <th style={{background:"#618cd8", color: "white"}}>Date</th>
                                <th style={{background:"#618cd8", color: "white"}}>Employee ID</th>
                                <th style={{background:"#618cd8", color: "white"}}>Employee Name</th>
                                <th style={{background:"#618cd8", color: "white"}}>Logged In</th>
                                <th style={{background:"#618cd8", color: "white"}}>Logged Out</th>
                                <th style={{background:"#618cd8", color: "white"}}>Status</th>
                                <th style={{background:"#618cd8", color: "white"}}>Total Working Hrs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map((record) => (
                                <tr key={record.id}>
                                    <td>{record.Date}</td>
                                    <td>{record.Employee_id}</td>
                                    <td>{record.Employee_Name}</td>
                                    <td>{record.Logged_in}</td>
                                    <td>{record.Logged_out}</td>
                                    <td>
                                        <span className="p-2" style={{ color: record.status === 'Present' ? 'green' : 'red' }}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td>{record.total_work_hrs}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                ) : (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <img src={noAttendacne} alt="No Data" style={{ width: "300px", height: "auto" }} />
                    <p style={{ fontSize: "18px", color: "gray" }}>No records of attendance—perhaps it's a day off?
                    </p>
                </div>
                )}
                
                <ToastContainer />
            </div>
        </div>
    );
};

export default Attendance;
