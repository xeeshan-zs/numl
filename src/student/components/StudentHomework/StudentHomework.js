import React, { useEffect, useState, useContext } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { AppContext } from '../../../Context/AppContext';
import styles from './StudentHomework.css';

const StudentHomework = () => {
    const { user } = useContext(AppContext);
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'deadline', direction: 'asc' });

    const departmentMap = {
        CS: 'Computer Science',
        EE: 'Electrical Engineering',
        ME: 'Mechanical Engineering',
    };

    useEffect(() => {
        if (!user) return;

        const fetchHomeworks = async () => {
            setLoading(true);
            setError('');

            try {
                const filters = [];
                if (user.degree) filters.push(where('degree', '==', user.degree.trim()));

                const mappedDepartment = user.department ? departmentMap[user.department.trim()] || user.department.trim() : undefined;
                if (mappedDepartment) filters.push(where('department', '==', mappedDepartment));

                let semester = user.semester;
                if (typeof semester === 'string') semester = semester.trim();
                if (semester) filters.push(where('semester', '==', Number(semester)));

                if (user.section) filters.push(where('section', '==', user.section.trim()));

                const q = query(collection(db, 'homeworks'), ...filters);
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setHomeworks(data);
            } catch (err) {
                console.error('Error fetching homeworks:', err);
                setError('Failed to load homeworks. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchHomeworks();
    }, [user]);

    const sortedHomeworks = [...homeworks].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === 'deadline') {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
        } else {
            aVal = String(aVal).toLowerCase();
            bVal = String(bVal).toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    if (loading) return <p className={styles.message}>Loading homeworks...</p>;
    if (error) return <p className={styles.messageError}>{error}</p>;
    if (homeworks.length === 0) return <p className={styles.message}>No homeworks assigned for your class.</p>;

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Your Homeworks</h2>
            <div className={styles.tableWrapper}>
                <table className={styles.homeworkTable}>
                    <thead>
                    <tr>
                        <th onClick={() => requestSort('title')}>
                            Title {sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th>Description</th>
                        <th onClick={() => requestSort('deadline')}>
                            Deadline {sortConfig.key === 'deadline' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th>Submission Link</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedHomeworks.map(hw => (
                        <tr key={hw.id}>
                            <td>{hw.title}</td>
                            <td>{hw.description}</td>
                            <td className={new Date(hw.deadline) < new Date() ? styles.overdue : ''}>
                                {hw.deadline}
                            </td>
                            <td>
                                {hw.submissionLink ? (
                                    <a href={hw.submissionLink} target="_blank" rel="noreferrer" className={styles.submissionLink}>
                                        Submit
                                    </a>
                                ) : '—'}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentHomework;
