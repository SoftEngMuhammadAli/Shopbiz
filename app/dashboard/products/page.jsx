import Link from "next/link";
import styles from "../../components/dashboard/products/products.module.css";
import { MdAdd } from "react-icons/md";
import Image from "next/image";
import { deleteProductAction, getProducts } from "../../lib/actions";

const ALLOWED_IMAGE_HOSTS = new Set(["images.unsplash.com"]);

function getSafeImageSrc(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") {
    return "/images/noavatar.png";
  }

  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }

  try {
    const parsed = new URL(imageUrl);
    return ALLOWED_IMAGE_HOSTS.has(parsed.hostname)
      ? imageUrl
      : "/images/noavatar.png";
  } catch {
    return "/images/noavatar.png";
  }
}

const ProductsPage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const query = String(resolvedSearchParams?.q || "").toLowerCase().trim();
  const error = resolvedSearchParams?.error
    ? String(resolvedSearchParams.error)
    : "";

  const response = await getProducts();
  const products = response.success ? response.products || [] : [];

  const filteredProducts = query
    ? products.filter((p) => p.name.toLowerCase().includes(query))
    : products;

  return (
    <section className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Products</h2>

        <div className={styles.searchContainer}>
          <form method="GET" style={{ display: "contents" }}>
            <input
              type="text"
              name="q"
              placeholder="Search for a product..."
              className={styles.search}
              defaultValue={query}
            />
          </form>

          <Link href="/dashboard/products/add" className={styles.addButton}>
            <MdAdd size={20} />
            Add New
          </Link>
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
            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "16px" }}
                >
                  No products found.
                </td>
              </tr>
            )}

            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  <div className={styles.product}>
                    <Image
                      src={getSafeImageSrc(product.imageUrl)}
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
                    <Link
                      className={styles.view}
                      href={`/dashboard/products/${product._id}`}
                    >
                      View
                    </Link>

                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={product._id} />
                      <button className={styles.delete} type="submit">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!response.success && <p className={styles.errorText}>{response.message}</p>}
      {error && <p className={styles.errorText}>{error}</p>}
    </section>
  );
};

export default ProductsPage;
