import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../assets/css/loginPage.css";
import LogoImg from "../assets/image/thikse-logo.png";
import api from "../Api/ApiService";
import { toast, ToastContainer } from "react-toastify";

const LoginPage = () => {
    const initialValues = {
        email_id: "",
        password: "",
    };

    const [loading, setLoading] = useState(false);

    const [errormsg, setErrorMsg] = useState(""); 

    const validationSchema = Yup.object({
        email_id: Yup.string().email("Invalid email format").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    });

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await api.post("/login", values);
    
            if (response.data.status === "error") {
                toast.error(response.data.message || "Error on Login....");
                setErrorMsg(response.data.message || "Error on Login....");
            } else {
                toast.success(response.data.message || "Login Successfully....");
    
                // Store user data in localStorage
                localStorage.setItem("authToken", "true"); // Set authentication flag
                localStorage.setItem("userEmail", response.data.user.email); // Store email
                localStorage.setItem("username", response.data.user.username); // Store username
                
                // Redirect user after login (optional)
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            alert("Login Failed");
        }
        finally
        {
            setLoading(false);
        }
    };
    

    return (
        <section className="d-flex justify-content-center align-items-center vh-100 home">
            <div className="container">
                <div className="row d-flex align-items-center">
                    {/* Left Side - Image */}
                    <div className="col-md-6 justify-content-center">
                        <img src={LogoImg} alt="Login Illustration" className="img-fluid" />
                        <h3 className="text-center">Attendance Management System</h3>
                    </div>

                    {/* Right Side - Login Card */}
                    <div className="col-md-6 d-flex justify-content-center">
                        <div className="card p-4 card-img" style={{ width: "100%", maxWidth: "500px" }}>
                            <h2 className="text-center mb-4">Login</h2>
                            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                                {() => (
                                    <Form>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <Field type="email" name="email_id" className="form-control" placeholder="Enter your email" />
                                            <ErrorMessage name="email_id" component="div" className="text-danger" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Password</label>
                                            <Field type="password" name="password" className="form-control" placeholder="Enter your password" />
                                            <ErrorMessage name="password" component="div" className="text-danger" />
                                        </div>
                                        {errormsg && (
                                <div className="alert text-center text-danger" role="alert">
                                    {errormsg}
                                </div>
                            )}
                                        <div className="d-grid">
                                            <button type="submit" className="submit" disabled={loading}>{loading && (<div class="spinner-border" style={{width: "20px",  height: "20px"}} role="status"></div>)}Login Now</button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                            
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </section>
    );
};

export default LoginPage;
