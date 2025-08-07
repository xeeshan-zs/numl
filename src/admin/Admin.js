import React, { useContext, useEffect, useRef, useState } from 'react';


import AddStudent from './components/AddStudent/AddStudent';
import AddProgram from './components/AddProgram/AddProgram';
import AddCourse from './components/AddCourse/AddCourse';
import AddTeacher from './components/AddTeacher/AddTeacher';
import AddAdmin from './components/AddAdmin/AddAdmin';
import AddDepartment from './components/AddDepartment/AddDepartment';
import StudentList from './components/AddStudent/StudentsList';
import AddExam from './components/AddExam/AddExam';

import { clearLocalStorage } from './utility/localStorage';
import { AppContext } from '../Context/AppContext';

import classes from './Admin.module.css';

function Admin() {
  const { logout, user } = useContext(AppContext);
  const [activeComponent, setActiveComponent] = useState('view-students');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const { adminName } = user;

  const renderComponent = () => {
    switch (activeComponent) {
      case 'students':
        return <AddStudent />;
      case 'programs':
        return <AddProgram />;
      case 'courses':
        return <AddCourse />;
      case 'teachers':
        return <AddTeacher />;
      case 'admins':
        return <AddAdmin />;
      case 'departments':
        return <AddDepartment />;
      case 'view-students':
        return <StudentList />;
      case 'exams':
        return <AddExam />;
      default:
        return <StudentList />;
    }
  };

  const handleLogout = () => {
    clearLocalStorage();
    logout();
  };

  const sideLinks = [
    { link: 'view-students', label: 'View Students' },
    { link: 'students', label: 'Add Students' },
    { link: 'admins', label: 'Add Admins' },
    { link: 'programs', label: 'Add Programs' },
    { link: 'courses', label: 'Add Courses' },
    { link: 'exams', label: 'Add Exams' },
    { link: 'teachers', label: 'Add Teachers' },
    { link: 'departments', label: 'Add Departments' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
          isSidebarOpen &&
          sidebarRef.current &&
          !sidebarRef.current.contains(e.target) &&
          !e.target.closest(`.${classes.menuButton}`)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  return (
      <div className={classes.container}>
        {/* Navbar */}
        <header className={classes.navbar}>
          <div className={classes.navbarLeft}>
            <button className={classes.menuButton} onClick={toggleSidebar}>☰</button>
            <h1 className={classes.heading}>Admin Dashboard</h1>
          </div>
          <div className={classes.navbarRight}>
            <span className={classes.username}>{adminName || 'ADMIN_123'}</span>
            <button className={classes.logoutButton} onClick={handleLogout}>Logout</button>
          </div>
        </header>

        {/* Layout */}
        <div className={classes.content}>
          {/* Sidebar */}
          <aside
              ref={sidebarRef}
              className={`${classes.sidebar} ${isSidebarOpen ? classes.sidebarOpen : ''}`}
          >
            <ul className={classes.sidebarLinks}>
              {sideLinks.map((item) => (
                  <li
                      key={item.link}
                      className={activeComponent === item.link ? classes.activeLink : ''}
                      onClick={() => {
                        setActiveComponent(item.link);
                        setIsSidebarOpen(false); // Close sidebar on click (mobile)
                      }}
                  >
                    {item.label}
                  </li>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <main className={classes.mainContent}>
            {renderComponent()}
          </main>
        </div>
      </div>
  );
}

export default Admin;
