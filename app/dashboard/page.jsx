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
import layoutStyles from "../components/dashboard/dashboard.module.css";
import RightBar from "../components/dashboard/rightbar/RightBar";

const DashboardPage = () => {
  return (
    <div className={layoutStyles.page}>
      <div style={{ flex: 1, minWidth: 0 }}>
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

      <aside className={layoutStyles.rightbar}>
        <RightBar />
      </aside>
    </div>
  );
};

export default DashboardPage;
