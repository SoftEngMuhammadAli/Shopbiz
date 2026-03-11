import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./sidebar.module.css";

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

import favicon from "../../../../app/favicon.ico";

const SideBar = () => {
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
        {
          title: "Report",
          path: "/dashboard/report",
          icon: <MdAnalytics />,
        },
        {
          title: "Teams",
          path: "/dashboard/teams",
          icon: <MdPeople />,
        },
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
        {
          title: "Help",
          path: "/dashboard/help",
          icon: <MdHelp />,
        },
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image
          src={favicon}
          alt="John Doe"
          width={50}
          height={50}
          className={styles.userImage}
        />
        <div className={styles.userDetail}>
          <span className={styles.username}>John Doe</span>
          <span className={styles.userTitle}>Administrator</span>
        </div>
      </div>

      {menuItems.map((cat) => (
        <div key={cat.title} className={styles.cat}>
          <span className={styles.catTitle}>{cat.title}</span>

          <div className={styles.nav}>
            {cat.list.map((item) => (
              <Link key={item.path} href={item.path} className={styles.item}>
                <span className={styles.icon}>{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <button className={styles.logout}>Sign Out</button>
    </div>
  );
};

export default SideBar;
