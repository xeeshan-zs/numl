import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import studentIcon from "../assets/student.png";
import classes from "./LoginPage.module.css";

export default function SignupForm() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        stdRegNumber: "",
        department: "",
        program: "",
        semester: "",
        section: "",
        username: "",
        password: ""
    });

    const [regNumberError, setRegNumberError] = useState("");
    const [isRegNumberValid, setIsRegNumberValid] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Trim trailing spaces for username
        if (name === "username") {
            setFormData((prev) => ({ ...prev, [name]: value.replace(/\s+$/, "") }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };


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

        // Prepare data with "nil" defaults
        const fullData = {
            ...formData,
            gender: "nil",
            dateOfBirth: "nil",
            cnic: "nil",
            contactNumber: "nil",
            email: "nil",
            fatherName: "nil",
            fatherOccupation: "nil",
            address: {
                city: "nil",
                houseNo: "nil",
                street: "nil",
                town: "nil"
            },
            feeSummary: [],
            prevAcademicRecord: []
        };

        try {
            await setDoc(doc(db, "students", formData.stdRegNumber), fullData);
            alert("Student registered successfully!");
            navigate("/login");
        } catch (error) {
            console.error("Error registering student: ", error);
            alert("Failed to register student.");
        }
    };

    return (
        <div className={classes.container}>
            <header className={classes.loginHeader}>
                <img src={studentIcon} alt="icon-of-students" />
                <div className={classes.myHead}>
                    <h1>National University of Modern Languages</h1>
                    <h3>LAHORE CAMPUS</h3>
                </div>
            </header>

            <div className={classes.formWrapper}>
                <h2 className={classes.heading}>STUDENT SIGNUP</h2>
                <form onSubmit={handleSubmit} className={classes.form}>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required className={classes.input} />
                    <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required className={classes.input} />

                    <input
                        name="stdRegNumber"
                        value={formData.stdRegNumber}
                        onChange={handleChange}
                        onBlur={checkRegNumber}
                        placeholder="Roll Number"
                        required
                        className={classes.input}
                    />
                    {regNumberError && (
                        <p style={{ color: "red", fontSize: "0.85rem", marginTop: "-10px" }}>{regNumberError}</p>
                    )}

                    <select name="department" value={formData.department} onChange={handleChange} required className={classes.input}>
                        <option value="">Select Department</option>
                        <option value="CS">Computer Science</option>
                    </select>

                    <select name="program" value={formData.program} onChange={handleChange} required className={classes.input}>
                        <option value="">Select Program</option>
                        <option value="BCS">BS Computer Science</option>
                        <option value="BSE">BS Software Engineering</option>
                    </select>

                    <select name="section" value={formData.section} onChange={handleChange} required className={classes.input}>
                        <option value="">Select Section</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                    </select>

                    <select name="semester" value={formData.semester} onChange={handleChange} required className={classes.input}>
                        <option value="">Select Semester</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>

                    <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required className={classes.input} />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className={classes.input} />

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
