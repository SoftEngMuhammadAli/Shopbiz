"use client";

import React from "react";
import styles from "../../../components/dashboard/users/usersview.module.css";
import Image from "next/image";

const UserView = () => {
  return (
    <div className={styles.container}>
      {/* Avatar */}
      <div className={styles.avatarCard}>
        <Image
          src="/images/noavatar.png"
          alt=""
          width={180}
          height={180}
          className={styles.avatar}
        />
        <h3>Hello</h3>
      </div>

      {/* Details */}
      <div className={styles.details}>
        <h2>User Information</h2>

        <div className={styles.field}>
          <label>Username</label>
          <input value="hello" readOnly />
        </div>

        <div className={styles.field}>
          <label>Email</label>
          <input value="hello@gmail.com" readOnly />
        </div>

        <div className={styles.field}>
          <label>Phone</label>
          <input value="123123" readOnly />
        </div>

        <div className={styles.field}>
          <label>Address</label>
          <textarea readOnly>London</textarea>
        </div>

        <div className={styles.field}>
          <label>Admin</label>
          <select disabled>
            <option>No</option>
          </select>
        </div>

        <button className={styles.updateBtn}>Update</button>
      </div>
    </div>
  );
};

export default UserView;
