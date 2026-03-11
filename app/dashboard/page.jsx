import React from "react";
import styles from "../components/dashboard/card/card.module.css";
import Card from "../components/dashboard/card/Card";
import {
  MdAnalytics,
  MdAttachMoney,
  MdPeople,
  MdShoppingBag,
} from "react-icons/md";
import Chart from "../components/dashboard/chart/Chart";
import Transaction from "../components/dashboard/transactions/Transaction";

const DashboardPage = () => {
  return (
    <div>
      {/* Cards Sections */}
      <section className={styles.container}>
        <div className={styles.cards}>
          <Card title="Total Users" number="1,254" icon={<MdPeople />} />
          <Card title="Revenue" number="$12,430" icon={<MdAttachMoney />} />
          <Card title="Orders" number="534" icon={<MdShoppingBag />} />
          <Card title="Analytics" number="98%" icon={<MdAnalytics />} />
        </div>
      </section>

      {/* Transactions Table Section */}
      <section>
        <Transaction />
      </section>

      {/* Chart Section */}
      <section>
        <Chart />
      </section>
    </div>
  );
};

export default DashboardPage;
