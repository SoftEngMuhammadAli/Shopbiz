"use client";
import React, { useState, useMemo } from "react";
import styles from "../../components/dashboard/products/products.module.css";
import { MdAdd } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";

const products = [
  {
    id: 1,
    name: "iPhone 15",
    price: "$999",
    stock: 23,
    created: "Oct 30 2023",
    img: "/images/product.jpg",
  },
  {
    id: 2,
    name: "MacBook Pro",
    price: "$1999",
    stock: 15,
    created: "Oct 29 2023",
    img: "/images/product.jpg",
  },
  {
    id: 3,
    name: "AirPods",
    price: "$249",
    stock: 54,
    created: "Oct 28 2023",
    img: "/images/product.jpg",
  },
  {
    id: 4,
    name: "Apple Watch",
    price: "$399",
    stock: 32,
    created: "Oct 27 2023",
    img: "/images/product.jpg",
  },
  {
    id: 5,
    name: "iPad Pro",
    price: "$899",
    stock: 12,
    created: "Oct 26 2023",
    img: "/images/product.jpg",
  },
];

const PRODUCTS_PER_PAGE = 2;

const ProductsPage = () => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteProduct, setDeleteProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    start,
    start + PRODUCTS_PER_PAGE,
  );

  return (
    <section className="p-6">
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Products</h2>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search for a product..."
            className={styles.search}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <button
            className={styles.addButton}
            onClick={() => router.push("/dashboard/products/add")}
          >
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
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Created at</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className={styles.product}>
                    <Image
                      src={product.img}
                      alt=""
                      width={40}
                      height={40}
                      className={styles.productImage}
                    />
                    {product.name}
                  </div>
                </td>

                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>{product.created}</td>

                <td>
                  <div className={styles.buttons}>
                    <button
                      className={styles.view}
                      onClick={() =>
                        router.push(`/dashboard/products/${product.id}`)
                      }
                    >
                      View
                    </button>

                    <button
                      className={styles.delete}
                      onClick={() => setDeleteProduct(product)}
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
      {deleteProduct && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Delete Product</h3>

            <p>
              Are you sure you want to delete <b>{deleteProduct.name}</b>?
            </p>

            <div className={styles.modalButtons}>
              <button
                className={styles.cancel}
                onClick={() => setDeleteProduct(null)}
              >
                Cancel
              </button>

              <button
                className={styles.confirmDelete}
                onClick={() => {
                  console.log("Delete product:", deleteProduct.id);
                  setDeleteProduct(null);
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

export default ProductsPage;
