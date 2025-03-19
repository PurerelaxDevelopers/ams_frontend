import React, { useState, useEffect } from "react";
import api from "../Api/ApiService";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal,OverlayTrigger, Popover, Button } from 'react-bootstrap';
import SideBar from "./SideBar";
import { FaUser } from "react-icons/fa";
import "../assets/css/RegisterEmployee.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import noRegister from '../assets/image/no_register.svg';


const validationSchema = Yup.object({
    employee_name: Yup.string().required("Name is required"),
    phone_number: Yup.string().matches(/^\d{10}$/, "Invalid phone number").required("Phone number is required"),
    mail_id: Yup.string().email("Invalid email").required("Mail ID is required"),
    employee_id: Yup.string().required("Employee ID is required"),
    rfid_number: Yup.string().required("RFID Number is required"),
    designation: Yup.string().required("Designation is required"),
});

const RegisterEmpolyee = () => {
    const [formData, setFormData] = useState({
        employee_name: "",
        phone_number: "",
        employee_id: "",
        mail_id: "",
        rfid_number: "",
        designation: ""
    });

    const [errormsg, setErrorMsg] = useState("");

    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [triggerFetch, setTriggerFetch] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await api.get("/listEmployee");
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        fetchEmployees();
    }, [triggerFetch]);

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value
    //     });
    // };

        // const handleSubmit = async (e) => {
        //     e.preventDefault();
        //     try {
        //         const response = await api.post("/registerEmployee", formData);
        //         if (response.data.status === "error") {
        //             toast.error(response.data.message || "Error registering employee.");
        //         } else {
        //             toast.success("Employee registered successfully!");
        //             setEmployees([...employees, response.data.data]);
        //             console.log("Employee registered successfully:", response.data);
        //         }
        //     } catch (error) {
        //         toast.error("Error registering employee.");
        //         console.error("Error registering employee:", error);
        //     }
        // };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await api.post("/registerEmployee", values);
            console.log('line 77', response)
            if (response.data.status === "error") {
                toast.error(response.data.message || "Error registering employee.");
            } else {
                toast.success("Employee registered successfully!");
                resetForm();
                setTriggerFetch(prev => !prev);
                
            }
        } catch (error) {
            toast.error("Error registering employee.");
            console.error("Error registering employee:", error);
        }
        setSubmitting(false);
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setShowModal(true);
    };

    // const handleUpdate = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await api.put(`/updateEmployee`, formData);
            
    //         if (response.status === 200) {
    //             toast.success("Employee updated successfully!");
                
    //             const updatedEmployee = response.data.data; // Correct data extraction
    
    //             setEmployees(employees.map(emp => 
    //                 emp.employee_id === editEmployee.employee_id ? updatedEmployee : emp
    //             ));
                
    //             setShowModal(false);
    //             console.log("Employee updated successfully:", updatedEmployee);
    //         }
    //     } catch (error) {
    //         toast.error("Error updating employee.");
    //         console.error("Error updating employee:", error);
    //     }
    // };

    const handleUpdate = async (values, { setSubmitting }) => {
        setErrorMsg(''); // Clear any previous error messages
        try {
            const response = await api.put(`/updateEmployee`, values);
            
            if (response.data.status === 'error') {
                // If the status is "error", set the error message
                setErrorMsg(response.data.message || 'An error occurred while updating the employee.');
            } else if (response.status === 200) {
                toast.success("Employee updated successfully!");
                
                // Correct data extraction
                // setEmployees(employees.map(emp => 
                //     emp.employee_id === editEmployee.employee_id ? updatedEmployee : emp
                // ));
                
                setShowModal(false);
                setTriggerFetch(prev => !prev);
                console.log("Employee updated successfully:");
            }
        } catch (error) {
            toast.error("Error updating employee.");
            console.error("Error updating employee:", error);
            setErrorMsg('An unexpected error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    

    const handleDelete = async (employee_id) => {
        try {
            await api.delete(`/deleteEmployee/${employee_id}`);
            setEmployees(employees.filter(employee => employee.employee_id !== employee_id));
            toast.success("Employee deleted successfully!");
        } catch (error) {
            toast.error("Error deleting employee.");
            console.error("Error deleting employee:", error);
        }
    };

    const deletePopover = (employee_id) => (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Confirm Delete</Popover.Header>
            <Popover.Body>
                <p>Are you sure you want to delete?</p>
                <Button variant="danger" size="sm" onClick={() => handleDelete(employee_id)}>Yes</Button>{' '}
                <Button variant="secondary" size="sm" onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    document.body.click(); // Close popover
                                                                }}>No</Button>
            </Popover.Body>
        </Popover>
    );

    return (
        <div className="d-flex">
            <SideBar/>
        
        <div className="container mt-3">
        <div className="d-flex justify-content-between mb-3 container-bg p-3">
            <h1 className="text-center text-uppercase" style={{fontFamily:"monospace"}}>Register Employee</h1>
            <button className="button-34 mb-3" data-bs-toggle="offcanvas" data-bs-target="#registerEmployeeOffcanvas">
                        <FaUser className="me-2" /> Add User
            </button>
            </div>
                 {/* Offcanvas Component */}
                 <div className="offcanvas offcanvas-end" tabIndex="-1" id="registerEmployeeOffcanvas" aria-labelledby="registerEmployeeOffcanvasLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="registerEmployeeOffcanvasLabel">Register Employee</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <Formik
                            initialValues={{
                                employee_name: "",
                                phone_number: "",
                                mail_id: "",
                                employee_id: "",
                                rfid_number: "",
                                designation: ""
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="mb-3">
                                        <label className="form-label">Name:</label>
                                        <Field type="text" name="employee_name" className="form-control" />
                                        <ErrorMessage name="employee_name" component="div" className="text-danger" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Phone Number:</label>
                                        <Field type="text" name="phone_number" className="form-control" />
                                        <ErrorMessage name="phone_number" component="div" className="text-danger" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mail ID:</label>
                                        <Field type="text" name="mail_id" className="form-control" />
                                        <ErrorMessage name="mail_id" component="div" className="text-danger" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Employee ID:</label>
                                        <Field type="text" name="employee_id" className="form-control" />
                                        <ErrorMessage name="employee_id" component="div" className="text-danger" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Designation:</label>
                                        <Field type="text" name="designation" className="form-control" />
                                        <ErrorMessage name="designation" component="div" className="text-danger" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">RFID Number:</label>
                                        <Field type="text" name="rfid_number" className="form-control" />
                                        <ErrorMessage name="rfid_number" component="span" className="text-danger" />
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                        {isSubmitting ? "Submitting..." : "Register"}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

                {/* <div className="col-12">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th style={{background:"#618cd8", color: "white", textAlign:"center"}}>Name</th>
                                <th style={{background:"#618cd8", color: "white", textAlign:"center"}}>Employee ID</th>
                                <th style={{background:"#618cd8", color: "white", textAlign:"center"}}>Employee Mail ID</th>
                                <th style={{background:"#618cd8", color: "white", textAlign:"center"}}>Phone Number</th>
                                <th style={{background:"#618cd8", color: "white", textAlign:"center"}}> RFID Number</th>
                                <th style={{background:"#618cd8", color: "white", textAlign:"center"}}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.employee_id}>
                                    <td >{employee.employee_name}</td>
                                    <td>{employee.employee_id}</td>
                                    <td>{employee.mail_id}</td>
                                    <td>{employee.phone_number}</td>
                                    <td>{employee.rfid_number}</td>
                                    <td>
                                        <button className="btn" style={{color: "gray"}} onClick={() => handleEdit(employee)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <OverlayTrigger trigger="click" placement="bottom" overlay={deletePopover(employee.employee_id)} rootClose>
                                            <button className="btn" style={{color: "red"}}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </OverlayTrigger>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> */}

<div className="col-12">
    {employees.length > 0 ? (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th style={{background:"#618cd8", color: "white", textAlign:"center"}}>Name</th>
                    <th style={{background:"#618cd8", color: "white", textAlign:"center"}}>Employee ID</th>
                    <th style={{background:"#618cd8", color: "white", textAlign:"center"}}>Employee Mail ID</th>
                    <th style={{background:"#618cd8", color: "white", textAlign:"center"}}>Phone Number</th>
                    <th style={{background:"#618cd8", color: "white", textAlign:"center"}}>Designation</th>
                    <th style={{background:"#618cd8", color: "white", textAlign:"center"}}>RFID Number</th>
                    <th style={{background:"#618cd8", color: "white", textAlign:"center"}}>Action</th>
                </tr>
            </thead>
            <tbody>
                {employees.map((employee) => (
                    <tr key={employee.employee_id}>
                        <td>{employee.employee_name}</td>
                        <td>{employee.employee_id}</td>
                        <td>{employee.mail_id}</td>
                        <td>{employee.phone_number}</td>
                        <td>{employee.designation}</td>
                        <td>{employee.rfid_number}</td>
                        <td>
                            <button className="btn" style={{color: "gray"}} onClick={() => handleEdit(employee)}>
                                <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <OverlayTrigger trigger="click" placement="bottom" overlay={deletePopover(employee.employee_id)} rootClose>
                                <button className="btn" style={{color: "red"}}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </OverlayTrigger>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <img src={noRegister} alt="No Data" style={{ width: "300px", height: "auto" }} />
            <p style={{ fontSize: "18px", color: "gray" }}>No Employees Listed – Let’s Build Your Dream Team!</p>
        </div>
    )}
</div>

            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Formik
                    initialValues={{employee_name: selectedEmployee?.employee_name || '',
                        phone_number: selectedEmployee?.phone_number || '',
                        employee_id: selectedEmployee?.employee_id || '',
                        mail_id: selectedEmployee?.mail_id || '',
                        rfid_number: selectedEmployee?.rfid_number || ''}}
                        
                    validationSchema={validationSchema}
                    onSubmit={handleUpdate}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-3">
                                <label className="form-label">Name:</label>
                                <Field
                                    type="text"
                                    name="employee_name"
                                    className="form-control"
                                />
                                <ErrorMessage name="employee_name" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Phone Number:</label>
                                <Field
                                    type="text"
                                    name="phone_number"
                                    className="form-control"
                                />
                                <ErrorMessage name="phone_number" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Employee ID:</label>
                                <Field
                                    type="text"
                                    name="employee_id"
                                    className="form-control"
                                    disabled
                                    readOnly
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mail ID:</label>
                                <Field
                                    type="text"
                                    name="mail_id"
                                    className="form-control"
                                />
                                <ErrorMessage name="mail_id" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">RFID Number:</label>
                                <Field
                                    type="text"
                                    name="rfid_number"
                                    className="form-control"
                                />
                                <ErrorMessage name="rfid_number" component="div" className="text-danger" />
                            </div>
                            {errormsg && (
                                <div className="alert alert-danger" role="alert">
                                    {errormsg}
                                </div>
                            )}
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'Update'}
                            </button>
                        </Form>
                    )}
                </Formik>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </div>
       
    );
};

export default RegisterEmpolyee;