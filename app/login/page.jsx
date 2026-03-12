import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import styles from "../components/login/login.module.css";
import LoginForm from "../components/login/LoginForm";
import { authOptions } from "@/app/auth";

const ERROR_MESSAGES = {
  CredentialsSignin: "Invalid email or password",
  AccessDenied: "Access denied",
  Configuration: "Auth configuration error",
  Verification: "Verification failed",
  Default: "Login failed",
};

const LoginPage = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  const resolvedSearchParams = await searchParams;
  const errorKey = String(resolvedSearchParams?.error || "");
  const error = errorKey
    ? ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.Default
    : "";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Please login to your account</p>
        <LoginForm error={error} />
      </div>
    </div>
  );
};

export default LoginPage;
