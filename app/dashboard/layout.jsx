import React from "react";
import SideBar from "../components/dashboard/sidebar/SideBar";
import NavBar from "../components/dashboard/navbar/NavBar";
import styles from "../components/dashboard/dashboard.module.css";
import Footer from "../components/dashboard/footer/Footer";

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.menu}>
        <SideBar />
      </aside>

      {/* Main Section */}
      <div className={styles.main}>
        <NavBar />

        <div className={styles.page}>
          <main className={styles.content}>{children}</main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
