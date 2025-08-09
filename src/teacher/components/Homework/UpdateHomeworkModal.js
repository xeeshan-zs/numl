import React, { useState } from "react";
import styles from "./UpdateHomeworkModal.css";

export default function UpdateHomeworkModal({ homework, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        ...homework,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!homework) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    ✖
                </button>
                <h2>Update Homework</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div>
                        <label className={styles.label}>Title</label>
                        <input
                            className={styles.input}
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className={styles.label}>Class</label>
                        <input
                            className={styles.input}
                            type="text"
                            name="class"
                            value={formData.class}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className={styles.label}>Due Date</label>
                        <input
                            className={styles.input}
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className={styles.label}>Description</label>
                        <textarea
                            className={styles.input}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                        />
                    </div>

                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.updateButton}>
                            Update
                        </button>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
