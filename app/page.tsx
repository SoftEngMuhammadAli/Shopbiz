import Link from "next/link";
import styles from "./components/dashboard/home.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.title}>ShopBiz</h1>
        <p className={styles.subtitle}>Select a page to continue.</p>

        <div className={styles.actions}>
          <Link href="/login" className={styles.loginButton}>
            Go to Login
          </Link>

          <Link href="/dashboard" className={styles.dashboardButton}>
            Open Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
