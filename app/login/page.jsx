import React from "react";
import styles from "../components/login/login.module.css";

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Please login to your account</p>

        <form className={styles.form}>
          <input type="email" placeholder="Email" className={styles.input} />

          <input
            type="password"
            placeholder="Password"
            className={styles.input}
          />

          <button className={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
