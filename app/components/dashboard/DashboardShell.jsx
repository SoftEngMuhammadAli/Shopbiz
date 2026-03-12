"use client";

import { useState } from "react";
import SideBar from "./sidebar/SideBar";
import NavBar from "./navbar/NavBar";
import Footer from "./footer/Footer";
import styles from "./dashboard.module.css";

const DashboardShell = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className={styles.container}>
      <aside
        className={`${styles.menu} ${isSidebarOpen ? styles.menuOpen : ""}`}
      >
        <SideBar onNavigate={closeSidebar} />
      </aside>

      {isSidebarOpen && (
        <button
          type="button"
          className={styles.menuOverlay}
          onClick={closeSidebar}
          aria-label="Close sidebar"
        />
      )}

      <div className={styles.main}>
        <NavBar onMenuToggle={toggleSidebar} />
        <div className={styles.page} onClick={closeSidebar}>
          <main className={styles.content}>{children}</main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardShell;
