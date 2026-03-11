import React from "react";
import Image from "next/image";
import styles from "./transaction.module.css";

const transactions = [
  {
    id: 1,
    name: "John Doe",
    img: "/images/noavatar.png",
    status: "pending",
    date: "14.02.2023",
    amount: "$3,200",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    img: "/images/noavatar.png",
    status: "success",
    date: "13.02.2023",
    amount: "$1,450",
  },
  {
    id: 3,
    name: "Michael Brown",
    img: "/images/noavatar.png",
    status: "failed",
    date: "12.02.2023",
    amount: "$720",
  },
  {
    id: 4,
    name: "Emily Davis",
    img: "/images/noavatar.png",
    status: "pending",
    date: "11.02.2023",
    amount: "$980",
  },
  {
    id: 5,
    name: "Daniel Wilson",
    img: "/images/noavatar.png",
    status: "success",
    date: "10.02.2023",
    amount: "$2,540",
  },
];

const Transaction = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Latest Transactions</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Status</td>
            <td>Date</td>
            <td>Amount</td>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>
                <div className={styles.user}>
                  <Image
                    src={t.img}
                    alt={t.name}
                    width={40}
                    height={40}
                    className={styles.userImage}
                  />
                  {t.name}
                </div>
              </td>

              <td>
                <span className={`${styles.status} ${styles[t.status]}`}>
                  {t.status}
                </span>
              </td>

              <td>{t.date}</td>
              <td>{t.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transaction;
