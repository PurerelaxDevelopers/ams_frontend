import React, { useState, useEffect } from 'react';
import api from "../Api/ApiService";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import io from "socket.io-client";
import SideBar from './SideBar';
import "../assets/css/Dashboard.css";
import SearchingImg from "../assets/image/searching2.jpg";

const Dashboard = () => {
    const [attendanceData, setAttendanceData] = useState({
        Date: "",
        Present_Employees: [],
        Total_Absent_Count: 0,
        Total_Employee_Count: 0,
        Total_Present_Count: 0
    });

    // useEffect(() => {
    //     const fetchAttendanceData = async () => {
    //         try {
    //             const response = await api.get("/attendance_dashboard");
    //             setAttendanceData(response.data);
    //         } catch (error) {
    //             toast.error("Error fetching attendance data.");
    //             console.error("Error fetching attendance data:", error);
    //         }
    //     };

    //     fetchAttendanceData();
    // }, []);


    useEffect(() => {
        // const socket = io("http://127.0.0.1:5000"); // Replace with your socket server URL
        const socket = io('https://git.thikse.in', { path: '/socket.io' });

        socket.on("attendance_dashboard_data", (data) => {
            setAttendanceData(data);
            console.log("Updated dashboard data:", data);
        });

        console.log(attendanceData);

        socket.on("error", (error) => {
            console.error("Socket error:", error);
        });

        // Request dashboard data from the server
        socket.emit('get_attendance_dashboard');

        const intervalId = setInterval(() => {
            socket.emit('get_attendance_dashboard');
        }, 3000); // 5 seconds interval

        return () => {
            clearInterval(intervalId);
            socket.disconnect();
        };
    }, []);

    return (
        <div className="d-flex">
        <SideBar />
        <div className="container mt-5">
            <h1 className="">Dashboard</h1>
            <div className="row mt-3">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <div className='d-flex justify-content-around'>
                            <h5 className="card-title">Total Employees</h5>
                            <p className="card-text">{attendanceData.Total_Employee_Count}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                        <div className='d-flex justify-content-around'>
                            <h5 className="card-title">Total Absent Today</h5>
                            <p className="card-text">{attendanceData.Total_Absent_Count}</p>
                        
                        </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <div className='d-flex justify-content-around'>
                            <h5 className="card-title">Total Present Today</h5>
                            <p className="card-text">{attendanceData.Total_Present_Count}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className='col-md-6'>
                </div>
                <div className="col-md-6 mt-3">
                    <h5 className='text-center'>Present Employees - <span style={{color: "green"}}>{attendanceData.Date}</span></h5>
                    <div className="table-responsive">
                            {attendanceData.Present_Employees.length > 0 ? (
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Employee ID</th>
                                            <th>Employee Name</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceData.Present_Employees.map((employee, index) => (
                                            <tr key={index}>
                                                <td>{employee.employee_id}</td>
                                                <td>{employee.employee_name}</td>
                                                <td>{employee.time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center">
                                    <img src={SearchingImg} alt="No Data" className="img-fluid" style={{ maxWidth: "300px" }} />
                                    <p>Nobody’s on duty right now. Stay tuned!</p>
                                </div>
                            )}
                        </div>
                </div>
            </div>  
            <ToastContainer />
        </div>
        </div>
    );
}

export default Dashboard;
