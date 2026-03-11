"use client";

import React from "react";
import Image from "next/image";
import styles from "./navbar.module.css";
import { usePathname } from "next/navigation";

import {
  MdOutlineMessage,
  MdOutlineNotifications,
  MdOutlineSearch,
  MdOutlineWeb,
} from "react-icons/md";

const NavBar = () => {
  const pathName = usePathname();

  const title =
    pathName === "/dashboard"
      ? "Dashboard"
      : pathName.split("/").pop().replace("-", " ");

  return (
    <div className={styles.container}>
      {/* Page Title */}
      <div className={styles.title}>{title}</div>

      {/* Right Section */}
      <div className={styles.right}>
        {/* Search */}
        <div className={styles.search}>
          <MdOutlineSearch className={styles.searchIcon} />
          <input type="text" placeholder="Search..." className={styles.input} />
        </div>
        <div className={styles.icons}>
          <MdOutlineMessage />
          <MdOutlineNotifications />
          <MdOutlineWeb />
        </div>

        <div className={styles.user}>
          <Image
            src="/noavatar.png"
            alt="User Avatar"
            width={32}
            height={32}
            className={styles.avatar}
          />

          <div className={styles.userDetail}>
            <span className={styles.username}>John Doe</span>
            <span className={styles.userTitle}>Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
