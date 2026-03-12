import Image from "next/image";
import styles from "../../../components/dashboard/users/usersview.module.css";
import { getUserById, updateUserAction } from "@/app/lib/actions";

const UserView = async ({ params, searchParams }) => {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const success = resolvedSearchParams?.success
    ? String(resolvedSearchParams.success)
    : "";
  const error = resolvedSearchParams?.error
    ? String(resolvedSearchParams.error)
    : "";

  const response = await getUserById(id);

  if (!response.success || !response.user) {
    return (
      <div className={styles.container}>
        Error: {response.message || "User not found"}
      </div>
    );
  }

  const user = response.user;

  return (
    <div className={styles.container}>
      <div className={styles.avatarCard}>
        <Image
          src={getSafeImageSrc(user.img)}
          alt=""
          width={180}
          height={180}
          className={styles.avatar}
        />
        <h3>{user.name}</h3>
      </div>

      <form className={styles.details} action={updateUserAction}>
        <h2>User Information</h2>
        <input type="hidden" name="id" value={user._id} />

        <div className={styles.field}>
          <label>Name</label>
          <input name="name" defaultValue={user.name || ""} required />
        </div>

        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            defaultValue={user.email || ""}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Role</label>
          <select name="role" defaultValue={user.role || "client"} required>
            <option value="admin">Admin</option>
            <option value="client">Client</option>
            <option value="editor">Editor</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>Image URL</label>
          <input name="img" defaultValue={user.img || ""} />
        </div>

        <div className={styles.field}>
          <label>New Password (optional)</label>
          <input type="password" name="password" minLength={6} />
        </div>

        <div className={styles.field}>
          <label>Created At</label>
          <input
            value={new Date(user.createdAt).toLocaleString() || ""}
            readOnly
          />
        </div>

        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <button className={styles.updateBtn} type="submit">
          Update
        </button>
      </form>
    </div>
  );
};

export default UserView;
