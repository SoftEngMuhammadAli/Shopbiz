"use client";

import React, { useState, useMemo, useEffect } from "react";
import styles from "../../components/dashboard/users/users.module.css";
import { MdAdd } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DELETEUSER, GETUSERS } from "../../lib/services/api.services";
import Pagination from "../../components/dashboard/pagination/Pagination";

const USERS_PER_PAGE = 10;

const UsersPage = () => {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteUser, setDeleteUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await GETUSERS();

        if (isMounted) {
          setUsers(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load users");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE),
  );

  const start = (page - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(start, start + USERS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleDeleteUser = async () => {
    if (!deleteUser?._id) {
      return;
    }

    setDeletingId(deleteUser._id);
    setError("");

    try {
      await DELETEUSER(deleteUser._id);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== deleteUser._id),
      );
      setDeleteUser(null);
    } catch (err) {
      setError(err.message || "Failed to delete user");
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return <p className="p-6">Loading users...</p>;
  }

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
            {paginatedUsers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "16px" }}
                >
                  No users found.
                </td>
              </tr>
            )}

            {paginatedUsers.map((user) => (
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
                    <button
                      className={styles.view}
                      onClick={() =>
                        router.push(`/dashboard/users/${user._id}`)
                      }
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

      {error && <p className="p-4 text-red-500">{error}</p>}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

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
                onClick={handleDeleteUser}
                disabled={deletingId === deleteUser._id}
              >
                {deletingId === deleteUser._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UsersPage;
