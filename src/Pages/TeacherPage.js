import React, { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../Context/AppContext";

import styles from "./TeacherPage.module.css";

import TeacherDetails from "../teacher/components/TeacherDetails/TeacherDetails";
import CoursesTaken from "../teacher/components/CoursesTaken/CoursesTaken";
import AttendanceMarked from "../teacher/components/AttendanceMarked/AttendanceMarked";
import GradesMarked from "../teacher/components/GradesMarked/GradesMarked";
import AddHomework from "../teacher/components/Homework/AddHomework";
import ViewHomeworkModal from "../teacher/components/Homework/ViewHomeworkModal";
import UpdateHomeworkModal from "../teacher/components/Homework/UpdateHomeworkModal";

const TeacherPage = () => {
  const { user, logout } = useContext(AppContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Details");
  const sidebarRef = useRef(null);

  // Homework modal states
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleLogout = () => logout();

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsSidebarOpen(false);
  };

  const handleViewHomework = (homework) => {
    setSelectedHomework(homework);
    setIsViewModalOpen(true);
  };

  const handleUpdateHomework = (homework) => {
    setSelectedHomework(homework);
    setIsUpdateModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedHomework(null);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedHomework(null);
  };

  const renderContent = () => {
    switch (activeLink) {
      case "Details":
        return <TeacherDetails teacher={user} />;
      // case "Courses":
      //   return <CoursesTaken teacher={user} />;
      // case "Attendance":
      //   return <AttendanceMarked teacher={user} />;
      // case "Grades":
      //   return <GradesMarked teacher={user} />;
      case "Add Homework":
        return <AddHomework teacher={user} />;
      case "View Homework":
        return (
            <div>
              {/* Pass in handlers for view/update */}
              <ViewHomeworkModal
                  teacher={user}
                  onView={handleViewHomework}
                  onUpdate={handleUpdateHomework}
              />
            </div>
        );
      default:
        return <TeacherDetails teacher={user} />;
    }
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
          isSidebarOpen &&
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target) &&
          !event.target.closest(`.${styles.menuButton}`)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <div className={styles.navbarLeft}>
            <button className={styles.menuButton} onClick={toggleSidebar}>
              ☰
            </button>
            <h1 className={styles.heading}>Teacher Dashboard</h1>
          </div>
          <div className={styles.navbarRight}>
            <span className={styles.username}>{user.teacherName}</span>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>

        <div className={styles.content}>
          {/* Sidebar */}
          <aside
              ref={sidebarRef}
              className={`${styles.sidebar} ${
                  isSidebarOpen ? styles.sidebarOpen : ""
              }`}
          >
            <ul className={styles.sidebarLinks}>
              {[
                "Details",
                // "Courses",
                // "Attendance",
                // "Grades",
                "Add Homework",
                "View Homework",
              ].map((link) => (
                  <li key={link}>
                    <a
                        href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                        className={activeLink === link ? styles.activeLink : ""}
                        onClick={() => handleLinkClick(link)}
                    >
                      {link}
                    </a>
                  </li>
              ))}
            </ul>
          </aside>

          {/* Main content */}
          <main className={styles.mainContent}>{renderContent()}</main>
        </div>

        {/* Global Modals */}
        {isViewModalOpen && selectedHomework && (
            <ViewHomeworkModal
                homework={selectedHomework}
                onClose={closeViewModal}
            />
        )}

        {isUpdateModalOpen && selectedHomework && (
            <UpdateHomeworkModal
                homework={selectedHomework}
                onClose={closeUpdateModal}
            />
        )}
      </div>
  );
};

export default TeacherPage;
