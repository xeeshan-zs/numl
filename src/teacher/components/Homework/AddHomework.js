import React, { useState, useContext } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { AppContext } from '../../../Context/AppContext';
import classes from './AddHomework.module.css';

const AddHomework = () => {
    const { user } = useContext(AppContext);

    const [formData, setFormData] = useState({
        department: '',
        degree: '',
        semester: '',
        section: '',
        title: '',
        description: '',
        deadline: '',
        submissionLink: '' // NEW FIELD
    });

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, 'homeworks'), {
                ...formData,
                semester: parseInt(formData.semester, 10),
                section: formData.section.toString(),
                createdBy: user.teacherName,
                createdAt: serverTimestamp()
            });

            setSuccessMessage('Homework added successfully!');
            setFormData({
                department: '',
                degree: '',
                semester: '',
                section: '',
                title: '',
                description: '',
                deadline: '',
                submissionLink: ''
            });
        } catch (error) {
            console.error('Error adding homework: ', error);
            alert('Failed to add homework.');
        } finally {
            setLoading(false);
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    return (
        <div className={classes.formContainer}>
            <h2>Add Homework</h2>
            <form onSubmit={handleSubmit} className={classes.homeworkForm}>
                <select name="department" value={formData.department} onChange={handleChange} required>
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                </select>

                <select name="degree" value={formData.degree} onChange={handleChange} required>
                    <option value="">Select Degree</option>
                    <option value="BCS">BCS</option>
                </select>

                <input
                    type="number"
                    name="semester"
                    placeholder="Semester"
                    value={formData.semester}
                    onChange={handleChange}
                    min="1"
                    required
                />

                <select name="section" value={formData.section} onChange={handleChange} required>
                    <option value="">Select Section</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>

                <input
                    type="text"
                    name="title"
                    placeholder="Homework Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Homework Description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    required
                ></textarea>

                {/* New Submission Link Field */}
                <input
                    type="url"
                    name="submissionLink"
                    placeholder="Google Form Submission Link"
                    value={formData.submissionLink}
                    onChange={handleChange}
                />

                <input
                    type="datetime-local"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Add Homework'}
                </button>
            </form>

            {successMessage && <div className={classes.success}>{successMessage}</div>}
        </div>
    );
};

export default AddHomework;
