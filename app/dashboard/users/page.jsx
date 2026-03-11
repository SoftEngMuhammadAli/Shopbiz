"use client";
import React, { useState, useMemo } from "react";
import styles from "../../components/dashboard/users/users.module.css";
import { MdAdd } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";

const users = [
  {
    id: 1,
    name: "hello",
    email: "hello@gmail.com",
    role: "client",
    created: "Oct 30 2023",
    img: "/images/noavatar.png",
  },
  {
    id: 2,
    name: "jane",
    email: "janedoe@gmail.com",
    role: "client",
    created: "Oct 29 2023",
    img: "/images/noavatar.png",
  },
  {
    id: 3,
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    created: "Oct 28 2023",
    img: "/images/noavatar.png",
  },
  {
    id: 4,
    name: "Sarah Smith",
    email: "sarah@example.com",
    role: "editor",
    created: "Oct 27 2023",
    img: "/images/noavatar.png",
  },
  {
    id: 5,
    name: "Emma Brown",
    email: "emma@example.com",
    role: "manager",
    created: "Oct 26 2023",
    img: "/images/noavatar.png",
  },
];

const USERS_PER_PAGE = 2;

const UsersPage = () => {
  const router = useRouter(); // ✅ correct usage

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteUser, setDeleteUser] = useState(null);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const start = (page - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(start, start + USERS_PER_PAGE);

  return (
    <section className="p-6">
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Users</h2>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search for a user..."
            className={styles.search}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <button className={styles.addButton}>
            <MdAdd size={20} />
            Add New
          </button>
        </div>
      </div>

      {/* Table */}
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
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className={styles.user}>
                    <Image
                      src={user.img}
                      alt=""
                      width={40}
                      height={40}
                      className={styles.userImage}
                    />
                    {user.name}
                  </div>
                </td>

                <td>{user.email}</td>
                <td>{user.created}</td>
                <td>{user.role}</td>

                <td>
                  <div className={styles.buttons}>
                    <button
                      className={styles.view}
                      onClick={() => router.push(`/dashboard/users/${user.id}`)}
                    >
                      View
                    </button>

                    <button
                      className={styles.delete}
                      onClick={() => setDeleteUser(user)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* Delete Modal */}
      {deleteUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Delete User</h3>

            <p>
              Are you sure you want to delete <b>{deleteUser.name}</b>?
            </p>

            <div className={styles.modalButtons}>
              <button
                className={styles.cancel}
                onClick={() => setDeleteUser(null)}
              >
                Cancel
              </button>

              <button
                className={styles.confirmDelete}
                onClick={() => {
                  console.log("Delete user:", deleteUser.id);
                  setDeleteUser(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UsersPage;
