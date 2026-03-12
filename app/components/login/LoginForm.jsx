"use client";

import { signIn } from "next-auth/react";
import styles from "./login.module.css";

const LoginForm = ({ error }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.field}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.field}>
        <input
          type="password"
          name="password"
          placeholder="Password"
          className={styles.input}
          required
          minLength={6}
        />
      </div>

      <button className={styles.button} type="submit">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
