"use client";

import React from "react";
import Link from "next/link";
import styles from "./menuLink.module.css";
import { usePathname } from "next/navigation";

const MenuLink = ({ item }) => {
  const pathname = usePathname();

  const isActive = pathname === item.path;

  return (
    <Link
      href={item.path}
      className={`${styles.item} ${isActive ? styles.active : ""}`}
    >
      <span className={styles.icon}>{item.icon}</span>
      {item.title}
    </Link>
  );
};

export default MenuLink;
