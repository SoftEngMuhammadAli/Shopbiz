import Link from "next/link";
import Image from "next/image";
import styles from "../../components/dashboard/users/users.module.css";
import { MdAdd } from "react-icons/md";
import { deleteUserAction, getUsers } from "../../lib/actions";

const UsersPage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const query = String(resolvedSearchParams?.q || "")
    .toLowerCase()
    .trim();
  const error = resolvedSearchParams?.error
    ? String(resolvedSearchParams.error)
    : "";

  const response = await getUsers();
  const users = response.success ? response.users || [] : [];

  const filteredUsers = query
    ? users.filter(
        (u) =>
          u.name?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query),
      )
    : users;

  return (
    <section className="p-6">
      <div className={styles.header}>
        <h2 className={styles.title}>Users</h2>

        <div className={styles.searchContainer}>
          <form method="GET" style={{ display: "contents" }}>
            <input
              type="text"
              name="q"
              placeholder="Search for a user..."
              className={styles.search}
              defaultValue={query}
            />
          </form>

          <Link href="/dashboard/users/add" className={styles.addButton}>
            <MdAdd size={20} />
            Add New
          </Link>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created at</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "16px" }}
                >
                  No users found.
                </td>
              </tr>
            )}

            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className={styles.user}>
                    <Image
                      src={user.img || "/images/noavatar.png"}
                      alt=""
                      width={40}
                      height={40}
                      className={styles.userImage}
                    />
                    {user.name}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{user.role}</td>
                <td>
                  <div className={styles.buttons}>
                    <Link
                      href={`/dashboard/users/${user._id}`}
                      className={styles.view}
                    >
                      View
                    </Link>
                    <form action={deleteUserAction}>
                      <input type="hidden" name="id" value={user._id} />
                      <button type="submit" className={styles.delete}>
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!response.success && (
        <p className="p-4 text-red-500">{response.message}</p>
      )}
      {error && <p className="p-4 text-red-500">{error}</p>}
    </section>
  );
};

export default UsersPage;
