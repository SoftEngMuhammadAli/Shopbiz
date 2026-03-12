import React from "react";
import styles from "../../../components/dashboard/users/addUser.module.css";
import { addUser } from "../../../lib/actions";

const AddUsersPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <form action={addUser} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className={styles.input}
              minLength={6}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Role</label>
            <select name="role" className={styles.select} required>
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
              <option value="editor">Editor</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Image URL</label>
            <input
              type="text"
              name="img"
              placeholder="Enter image url"
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.button}>
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUsersPage;
