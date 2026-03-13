"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./sidebar.module.css";
import LogoutButton from "./LogoutButton";
import { usePathname } from "next/navigation";

import {
  MdAnalytics,
  MdAttachMoney,
  MdDashboard,
  MdHelp,
  MdPeople,
  MdSettings,
  MdShoppingBag,
  MdSupervisedUserCircle,
  MdWork,
} from "react-icons/md";

const SideBar = ({ onNavigate }) => {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Pages",
      list: [
        { title: "Dashboard", path: "/dashboard", icon: <MdDashboard /> },
        {
          title: "Users",
          path: "/dashboard/users",
          icon: <MdSupervisedUserCircle />,
        },
        {
          title: "Products",
          path: "/dashboard/products",
          icon: <MdShoppingBag />,
        },
        {
          title: "Transaction",
          path: "/dashboard/transactions",
          icon: <MdAttachMoney />,
        },
      ],
    },
    {
      title: "Analytics",
      list: [
        { title: "Revenue", path: "/dashboard/revenue", icon: <MdWork /> },
        { title: "Report", path: "/dashboard/report", icon: <MdAnalytics /> },
        { title: "Teams", path: "/dashboard/teams", icon: <MdPeople /> },
      ],
    },
    {
      title: "User",
      list: [
        {
          title: "Settings",
          path: "/dashboard/settings",
          icon: <MdSettings />,
        },
        { title: "Help", path: "/dashboard/help", icon: <MdHelp /> },
      ],
    },
  ];

  return (
    <div className={styles.container}>
      {/* User Profile */}
      <div className={styles.user}>
        <Image
          src="/images/noavatar.png"
          alt="User avatar"
          width={50}
          height={50}
          className={styles.userImage}
        />
        <div className={styles.userDetail}>
          <span className={styles.username}>John Doe</span>
          <span className={styles.userTitle}>Administrator</span>
        </div>
      </div>

      {/* Menu */}
      {menuItems.map((cat) => (
        <div key={cat.title} className={styles.cat}>
          <span className={styles.catTitle}>{cat.title}</span>

          <div className={styles.nav}>
            {cat.list.map((item) => {
              const isActive =
                item.path === "/dashboard"
                  ? pathname === item.path
                  : pathname === item.path ||
                    pathname.startsWith(`${item.path}/`);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`${styles.item} ${isActive ? styles.active : ""}`}
                  onClick={onNavigate}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* Logout */}
      <LogoutButton onBeforeLogout={onNavigate} />
    </div>
  );
};

export default SideBar;
