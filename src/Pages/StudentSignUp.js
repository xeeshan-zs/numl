import React, { useState } from "react";
import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import studentIcon from '../assets/student.png';
import classes from "./LoginPage.module.css"; // same style as login

export default function SignupForm() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        cnic: "",
        contactNumber: "",
        email: "",
        password: "",
        fatherName: "",
        fatherOccupation: "",
        department: "",
        program: "",
        section: "",
        semester: "",
        stdRegNumber: "",
        username: "",
        address: {
            city: "",
            houseNo: "",
            street: "",
            town: ""
        },
        feeSummary: [],
        prevAcademicRecord: []
    });

    const [regNumberError, setRegNumberError] = useState("");
    const [isRegNumberValid, setIsRegNumberValid] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("address.")) {
            const key = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, [key]: value }
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Check registration number uniqueness
    const checkRegNumber = async () => {
        if (!formData.stdRegNumber.trim()) return;

        try {
            const docRef = doc(db, "students", formData.stdRegNumber);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setRegNumberError("This registration number is already registered.");
                setIsRegNumberValid(false);
            } else {
                setRegNumberError("");
                setIsRegNumberValid(true);
            }
        } catch (error) {
            console.error("Error checking reg number:", error);
            setRegNumberError("Error checking registration number.");
            setIsRegNumberValid(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isRegNumberValid) {
            alert("Please enter a unique registration number before signing up.");
            return;
        }

        try {
            await setDoc(doc(db, "students", formData.stdRegNumber), formData);
            alert("Student registered successfully!");
            navigate("/login");
        } catch (error) {
            console.error("Error registering student: ", error);
            alert("Failed to register student.");
        }
    };

    return (
        <div className={classes.container}>
            {/* HEADER */}
            <header className={classes.loginHeader}>
                <img src={studentIcon} alt="icon-of-students" />
                <div className={classes.myHead}>
                    <h1>National University of Modern Languages</h1>
                    <h3>LAHORE CAMPUS</h3>
                </div>
            </header>

            {/* FORM */}
            <div className={classes.formWrapper}>
                <h2 className={classes.heading}>STUDENT SIGNUP</h2>
                <form onSubmit={handleSubmit} className={classes.form}>
                    {/* Basic Info */}
                    <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required className={classes.input} />
                    <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required className={classes.input} />
                    <select name="gender" value={formData.gender} onChange={handleChange} required className={classes.input}>
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>
                    <label>Date of Birth:
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className={classes.input} />
                    </label>
                    {/* CNIC & Contact */}
                    <input name="cnic" value={formData.cnic} onChange={handleChange} placeholder="CNIC" required className={classes.input} />
                    <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" required className={classes.input} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className={classes.input} />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className={classes.input} />

                    {/* Father Info */}
                    <input name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Father Name" className={classes.input} />
                    <input name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} placeholder="Father Occupation" className={classes.input} />

                    {/* Academic Info */}
                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        className={classes.input}
                    >
                        <option value="">Select Department</option>
                        <option value="CS">Computer Science</option>

                    </select>

                    <select
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        required
                        className={classes.input}
                    >
                        <option value="">Select Program</option>
                        <option value="BCS">BS Computer Science</option>
                        <option value="BSE">BS Software Engineering</option>

                    </select>

                    <select
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        required
                        className={classes.input}
                    >
                        <option value="">Select Section</option>
                        <option value="1">A</option>
                        <option value="2">B</option>
                    </select>

                    <input
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        placeholder="Semester"
                        required
                        className={classes.input}
                    />

                    {/* Registration Number with validation */}
                    <input
                        name="stdRegNumber"
                        value={formData.stdRegNumber}
                        onChange={handleChange}
                        onBlur={checkRegNumber}
                        placeholder="Student Reg Number"
                        required
                        className={classes.input}
                    />
                    {regNumberError && (
                        <p style={{ color: "red", fontSize: "0.85rem", marginTop: "-10px" }}>
                            {regNumberError}
                        </p>
                    )}

                    <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required className={classes.input} />

                    {/* Address */}
                    <h3 style={{ marginTop: "10px", textAlign: "center" }}>Address</h3>
                    <input name="address.city" value={formData.address.city} onChange={handleChange} placeholder="City" className={classes.input} />
                    <input name="address.houseNo" value={formData.address.houseNo} onChange={handleChange} placeholder="House No" className={classes.input} />
                    <input name="address.street" value={formData.address.street} onChange={handleChange} placeholder="Street" className={classes.input} />
                    <input name="address.town" value={formData.address.town} onChange={handleChange} placeholder="Town" className={classes.input} />

                    {/* Buttons */}
                    <div className={classes.buttonGroup}>
                        <button type="submit" className={classes.button} disabled={!isRegNumberValid}>
                            SIGN UP
                        </button>
                        <button type="button" className={`${classes.button} ${classes.signupButton}`} onClick={() => navigate("/login")}>
                            BACK TO LOGIN
                        </button>
                    </div>
                </form>
            </div>

            {/* FOOTER */}
            <footer className={classes.loginFooter}>
                <p>All rights reserved.</p>
                <p>
                    Developed by{" "}
                    <a href="https://github.com/xeeshan-zs" target="_self" rel="noopener noreferrer">
                        Zeeshan Sarfraz
                    </a>
                </p>
            </footer>
        </div>
    );
}
