import React, { useState } from 'react';
import styles from './StudentDetails.module.css';
import { getProgramName, getDepartmentName } from '../../helpers/helperFunctions';
import { db } from '../../../firebaseConfig';

import { doc, setDoc } from 'firebase/firestore';

function PersonalDetails({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    try {
      // Using stdRegNumber as document ID based on your DB structure
      const userRef = doc(db, 'students', user.stdRegNumber);
      await setDoc(userRef, formData, { merge: true });
      alert('Information updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating document:', error.code, error.message);
      alert(`Failed to update: ${error.message}`);
    }
  };

  const personalDetails = [
    { label: 'Name', value: `${user.firstName} ${user.lastName}` },
    { label: 'Registration Number', value: user.stdRegNumber },
    { label: 'Program', value: getProgramName(user.program) },
    { label: 'Semester', value: user.semester },
    { label: 'Department', value: getDepartmentName(user.department) },
    { label: 'Gender', value: user.gender },
    { label: 'Date of Birth', value: user.dateOfBirth },
  ];

  const contactDetails = [
    { label: 'Email', value: user.email },
    { label: 'Contact Number', value: user.contactNumber },
    {
      label: 'Address',
      value: `House No# ${user.address.houseNo}, Street# ${user.address.street}, ${user.address.town}, ${user.address.city}`,
    },
    { label: "Father's Name", value: user.fatherName },
    { label: "Father's Occupation", value: user.fatherOccupation },
    { label: 'Username', value: user.username },
    { label: 'Password', value: '••••••••' }, // Masked
  ];

  return (
      <div className={styles.detailsSection}>
        <div className={styles.header}>
          <h2>Personal Details & Contact</h2>
          <button className={styles.updateBtn} onClick={() => setIsEditing(true)}>
            Update
          </button>
        </div>

        <div className={styles.tablesContainer}>
          {/* Personal Details Table */}
          <table className={styles.table}>
            <thead>
            <tr>
              <th colSpan="2">Personal Details</th>
            </tr>
            </thead>
            <tbody>
            {personalDetails.map((detail, index) => (
                <tr key={index}>
                  <td><strong>{detail.label}</strong></td>
                  <td>{detail.value}</td>
                </tr>
            ))}
            </tbody>
          </table>

          {/* Contact Details Table */}
          <table className={styles.table}>
            <thead>
            <tr>
              <th colSpan="2">Contact Information</th>
            </tr>
            </thead>
            <tbody>
            {contactDetails.map((detail, index) => (
                <tr key={index}>
                  <td><strong>{detail.label}</strong></td>
                  <td>{detail.value}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {isEditing && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h3>Update Information</h3>
                <div className={styles.form}>
                  <label htmlFor="firstName">First Name</label>
                  <input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />

                  <label htmlFor="lastName">Last Name</label>
                  <input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />

                  <label htmlFor="stdRegNumber">Registration Number</label>
                  <input id="stdRegNumber" name="stdRegNumber" value={formData.stdRegNumber} onChange={handleChange} placeholder="Registration Number" />

                  <label htmlFor="program">Program</label>
                  <input id="program" name="program" value={formData.program} onChange={handleChange} placeholder="Program" />

                  <label htmlFor="semester">Semester</label>
                  <input id="semester" name="semester" value={formData.semester} onChange={handleChange} placeholder="Semester" />

                  <label htmlFor="department">Department</label>
                  <input id="department" name="department" value={formData.department} onChange={handleChange} placeholder="Department" />

                  <label htmlFor="gender">Gender</label>
                  <input id="gender" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" />

                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input id="dateOfBirth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />

                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />

                  <label htmlFor="contactNumber">Contact Number</label>
                  <input id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" />

                  <label htmlFor="address_houseNo">House No</label>
                  <input id="address_houseNo" name="address.houseNo" value={formData.address.houseNo} onChange={handleChange} placeholder="House No" />

                  <label htmlFor="address_street">Street</label>
                  <input id="address_street" name="address.street" value={formData.address.street} onChange={handleChange} placeholder="Street" />

                  <label htmlFor="address_town">Town</label>
                  <input id="address_town" name="address.town" value={formData.address.town} onChange={handleChange} placeholder="Town" />

                  <label htmlFor="address_city">City</label>
                  <input id="address_city" name="address.city" value={formData.address.city} onChange={handleChange} placeholder="City" />

                  <label htmlFor="fatherName">Father's Name</label>
                  <input id="fatherName" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Father's Name" />

                  <label htmlFor="fatherOccupation">Father's Occupation</label>
                  <input id="fatherOccupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} placeholder="Father's Occupation" />

                  <label htmlFor="username">Username</label>
                  <input id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />

                  <label htmlFor="password">Password</label>
                  <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                </div>
                <div className={styles.modalActions}>
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

export default PersonalDetails;
