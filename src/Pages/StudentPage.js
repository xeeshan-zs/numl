import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../Context/AppContext';
import StudentDetails from '../student/components/StudentDetails/StudentDetails';
import styles from './StudentPage.module.css';
import { clearLocalStorage } from '../admin/utility/localStorage';
import { useNavigate } from 'react-router-dom';

const StudentPage = () => {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState('details');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleLogout = () => {
    logout();
    clearLocalStorage();
    navigate('/home');
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsSidebarOpen(false); // Close sidebar on mobile after click
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on outside click (mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
          isSidebarOpen &&
          sidebarRef.current &&
          !sidebarRef.current.contains(e.target) &&
          !e.target.closest(`.${styles.menuButton}`)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const side_links = [
    { title: 'Personal Details', link: 'details' },
    { title: 'Fee Summary', link: 'fee' },
    { title: 'Academic Records', link: 'academic' },
    { title: 'Register Course', link: 'register_courses' },
    { title: 'Enrolled Courses', link: 'enrolled_courses' },
    { title: 'Datesheet', link: 'datesheet' },
    { title: 'Result', link: 'external', url: 'https://students.atrons.net/webpages/result' }
  ];

  return (
      <div className={styles.container}>
        {/* Navbar */}
        <header className={styles.navbar}>
          <div className={styles.navbarLeft}>
            <button className={styles.menuButton} onClick={toggleSidebar}>☰</button>
            <h1 className={styles.heading}>Student Dashboard</h1>
          </div>
          <div className={styles.navbarRight}>
            <span className={styles.username}>{user?.stdRegNumber}</span>
            <button className={styles.logoutButton} onClick={handleLogout}>Log out</button>
          </div>
        </header>

        {/* Layout */}
        <div className={styles.content}>
          {/* Sidebar */}
          <aside
              ref={sidebarRef}
              className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
          >
            <ul className={styles.sidebarLinks}>
              {side_links.map((item) =>
                  item.link === 'external' ? (
                      <li key={item.title}>
                        <a href={item.url} target="_self" rel="noopener noreferrer">{item.title}</a>
                      </li>
                  ) : (
                      <li key={item.link}>
                        <a
                            onClick={() => handleLinkClick(item.link)}
                            className={activeLink === item.link ? styles.activeLink : ''}
                        >
                          {item.title}
                        </a>
                      </li>
                  )
              )}
            </ul>
          </aside>

          {/* Main Content */}
          <main className={styles.mainContent}>
            <StudentDetails activeLink={activeLink} />
          </main>
        </div>
      </div>
  );
};

export default StudentPage;
