"use client";
import React from "react";
import styles from "../../../components/dashboard/products/productView.module.css";
import Image from "next/image";

const ProductView = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imageCard}>
        <Image src="/images/product.jpg" alt="" width={200} height={200} />
      </div>

      <div className={styles.details}>
        <h2>Product Details</h2>

        <div className={styles.field}>
          <label>Name</label>
          <input value="iPhone 15" readOnly />
        </div>

        <div className={styles.field}>
          <label>Price</label>
          <input value="$999" readOnly />
        </div>

        <div className={styles.field}>
          <label>Stock</label>
          <input value="23" readOnly />
        </div>

        <div className={styles.field}>
          <label>Description</label>
          <textarea readOnly>Apple flagship phone</textarea>
        </div>

        <button className={styles.updateBtn}>Update</button>
      </div>
    </div>
  );
};

export default ProductView;
