"use client";

import { signOut } from "next-auth/react";
import styles from "./sidebar.module.css";

const LogoutButton = ({ onBeforeLogout }) => {
  const handleLogout = async () => {
    onBeforeLogout?.();
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <button type="button" className={styles.logout} onClick={handleLogout}>
      Sign Out
    </button>
  );
};

export default LogoutButton;
