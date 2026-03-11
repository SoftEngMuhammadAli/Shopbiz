import React from "react";
import SideBar from "../components/dashboard/sidebar/SideBar";
import NavBar from "../components/dashboard/navbar/NavBar";
import styles from "../components/dashboard/dashboard.module.css";

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <aside className={styles.menu}>
        <SideBar />
      </aside>
      <div className={styles.main}>
        <NavBar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
