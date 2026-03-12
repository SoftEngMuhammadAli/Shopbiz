"use client";

import React from "react";
import styles from "./pagination.module.css";

const Pagination = ({ page, totalPages, onPageChange }) => {
  const safeTotalPages = Math.max(1, totalPages);

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>

      <span>
        Page {page} / {safeTotalPages}
      </span>

      <button
        type="button"
        disabled={page >= safeTotalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
