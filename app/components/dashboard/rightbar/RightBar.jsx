import React from "react";
import styles from "./rightbar.module.css";

const RightBar = () => {
  return (
    <div className={styles.container}>
      {/* Activity */}
      <div className={styles.card}>
        <div className={styles.title}>Recent Activity</div>

        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <span className={styles.dot}></span>
            <div className={styles.activityText}>
              New user registered
              <div className={styles.time}>2 minutes ago</div>
            </div>
          </div>

          <div className={styles.activityItem}>
            <span className={styles.dot}></span>
            <div className={styles.activityText}>
              Product added
              <div className={styles.time}>10 minutes ago</div>
            </div>
          </div>

          <div className={styles.activityItem}>
            <span className={styles.dot}></span>
            <div className={styles.activityText}>
              Server restarted
              <div className={styles.time}>1 hour ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.card}>
        <div className={styles.title}>Statistics</div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span>Users</span>
            <span className={styles.statValue}>1,204</span>
          </div>

          <div className={styles.statItem}>
            <span>Orders</span>
            <span className={styles.statValue}>532</span>
          </div>

          <div className={styles.statItem}>
            <span>Revenue</span>
            <span className={styles.statValue}>$12,430</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
