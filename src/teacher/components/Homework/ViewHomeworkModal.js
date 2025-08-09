import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import {
    collection,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";
import "./ViewHomeworkModal.css";

const TeacherPage = () => {
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editHomework, setEditHomework] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchHomeworks = async () => {
        try {
            const snapshot = await getDocs(collection(db, "homeworks"));
            const data = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            }));
            setHomeworks(data);
        } catch (error) {
            console.error("Error fetching homeworks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHomeworks();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this homework?")) {
            await deleteDoc(doc(db, "homeworks", id));
            fetchHomeworks();
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editHomework) return;

        const docRef = doc(db, "homeworks", editHomework.id);
        await updateDoc(docRef, {
            title: editHomework.title,
            description: editHomework.description,
            deadline: editHomework.deadline,
            degree: editHomework.degree,
            department: editHomework.department,
            semester: editHomework.semester,
            section: editHomework.section,
            submissionLink: editHomework.submissionLink || "",
        });

        setShowModal(false);
        setEditHomework(null);
        fetchHomeworks();
    };

    const filteredHomeworks = homeworks.filter((hw) => {
        const term = searchTerm.toLowerCase();
        return (
            hw.title?.toLowerCase().includes(term) ||
            hw.createdBy?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="teacher-container">
            <div className="teacher-header">
                <h1>HomeWorks</h1>
                <input
                    type="text"
                    className="search-box"
                    placeholder="Search Homework..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : filteredHomeworks.length === 0 ? (
                <p>No matching homeworks found.</p>
            ) : (
                <table className="teacher-table">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Submission Link</th>
                        <th>Created By</th>
                        <th>Created At</th>
                        <th>Deadline</th>
                        <th>Degree</th>
                        <th>Department</th>
                        <th>Semester</th>
                        <th>Section</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredHomeworks.map((hw) => (
                        <tr key={hw.id}>
                            <td>{hw.title}</td>
                            <td>{hw.description}</td>
                            <td>
                                {hw.submissionLink ? (
                                    <a href={hw.submissionLink} target="_blank" rel="noreferrer">
                                        Open Link
                                    </a>
                                ) : (
                                    "N/A"
                                )}
                            </td>
                            <td>{hw.createdBy}</td>
                            <td>
                                {hw.createdAt?.seconds
                                    ? new Date(hw.createdAt.seconds * 1000).toLocaleString()
                                    : "N/A"}
                            </td>
                            <td>{hw.deadline}</td>
                            <td>{hw.degree}</td>
                            <td>{hw.department}</td>
                            <td>{hw.semester}</td>
                            <td>{hw.section}</td>
                            <td>
                                <button
                                    className="update-btn"
                                    onClick={() => {
                                        setEditHomework(hw);
                                        setShowModal(true);
                                    }}
                                >
                                    Update
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(hw.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Update Homework</h2>
                        <form onSubmit={handleUpdate}>
                            <label>
                                Title:
                            <input
                                type="text"
                                placeholder="Title"
                                value={editHomework.title || ""}
                                onChange={(e) =>
                                    setEditHomework({ ...editHomework, title: e.target.value })
                                }
                                required
                            /></label>

                            <label>Description:
                            <textarea
                                placeholder="Description"
                                value={editHomework.description || ""}
                                onChange={(e) =>
                                    setEditHomework({ ...editHomework, description: e.target.value })
                                }
                                required
                            ></textarea></label>

                            <label>
                            Submission Link:
                            <input
                                type="text"
                                placeholder="Submission Link"
                                value={editHomework.submissionLink || ""}
                                onChange={(e) =>
                                    setEditHomework({ ...editHomework, submissionLink: e.target.value })
                                }
                            /></label>

                            <label>Deadline:
                            <input
                                type="text"
                                placeholder="Deadline"
                                value={editHomework.deadline || ""}
                                onChange={(e) =>
                                    setEditHomework({ ...editHomework, deadline: e.target.value })
                                }
                                required
                            /></label>

                            <label> Degree:
                            <input
                                type="text"
                                placeholder="Degree"
                                value={editHomework.degree || ""}
                                onChange={(e) =>
                                    setEditHomework({ ...editHomework, degree: e.target.value })
                                }
                                required
                            /></label>

                            <label>Department:
                            <input
                                type="text"
                                placeholder="Department"
                                value={editHomework.department || ""}
                                onChange={(e) =>
                                    setEditHomework({ ...editHomework, department: e.target.value })
                                }
                                required
                            /></label>

                            <label> Semester:
                            <input
                                type="number"
                                placeholder="Semester"
                                value={editHomework.semester || ""}
                                onChange={(e) =>
                                    setEditHomework({ ...editHomework, semester: e.target.value })
                                }
                                required
                            /></label>

                            <label> Section:
                            <input
                                type="text"
                                placeholder="Section"
                                value={editHomework.section || ""}
                                onChange={(e) =>
                                    setEditHomework({ ...editHomework, section: e.target.value })
                                }
                                required
                            /></label>


                            <div className="modal-actions">
                                <button type="submit" className="save-btn">
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherPage;
