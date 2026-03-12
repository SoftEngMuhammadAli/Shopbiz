"use client";
import React, { useState, useMemo, useEffect } from "react";
import styles from "../../components/dashboard/products/products.module.css";
import { MdAdd } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Pagination from "../../components/dashboard/pagination/Pagination";

const PRODUCTS_PER_PAGE = 10;

const ProductsPage = () => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Fetch products error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async () => {
    try {
      await fetch(`/api/products/${deleteProduct._id}`, {
        method: "DELETE",
      });

      setProducts((prev) => prev.filter((p) => p._id !== deleteProduct._id));

      setDeleteProduct(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  const totalPages =
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;

  const start = (page - 1) * PRODUCTS_PER_PAGE;

  const paginatedProducts = filteredProducts.slice(
    start,
    start + PRODUCTS_PER_PAGE,
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  if (loading) {
    return <p className="p-6">Loading products...</p>;
  }

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
              <tr key={product._id}>
                <td>
                  <div className={styles.product}>
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={40}
                      height={40}
                      className={styles.productImage}
                    />
                    {product.name}
                  </div>
                </td>

                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>{new Date(product.createdAt).toLocaleDateString()}</td>

                <td>
                  <div className={styles.buttons}>
                    <button
                      className={styles.view}
                      onClick={() =>
                        router.push(`/dashboard/products/${product._id}`)
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

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

              <button className={styles.confirmDelete} onClick={handleDelete}>
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
