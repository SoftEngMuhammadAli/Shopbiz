import Image from "next/image";
import styles from "../../../components/dashboard/products/productView.module.css";
import { getProductById, updateProductAction } from "@/app/lib/actions";

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

const ProductView = async ({ params, searchParams }) => {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const success = resolvedSearchParams?.success
    ? String(resolvedSearchParams.success)
    : "";
  const error = resolvedSearchParams?.error
    ? String(resolvedSearchParams.error)
    : "";

  const response = await getProductById(id);

  if (!response.success || !response.product) {
    return (
      <div className={styles.container}>
        Error: {response.message || "Product not found"}
      </div>
    );
  }

  const product = response.product;

  return (
    <div className={styles.container}>
      <div className={styles.imageCard}>
        <Image
          src={getSafeImageSrc(product.imageUrl)}
          alt={product.name || "Product image"}
          width={200}
          height={200}
        />
      </div>

      <form className={styles.details} action={updateProductAction}>
        <h2>Product Details</h2>
        <input type="hidden" name="id" value={product._id} />

        <div className={styles.field}>
          <label>Name</label>
          <input name="name" defaultValue={product.name || ""} required />
        </div>

        <div className={styles.field}>
          <label>Price</label>
          <input
            type="number"
            name="price"
            defaultValue={String(product.price ?? "")}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className={styles.field}>
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            defaultValue={String(product.stock ?? "")}
            min="0"
            step="1"
            required
          />
        </div>

        <div className={styles.field}>
          <label>Category</label>
          <input
            name="category"
            defaultValue={product.category || ""}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Image URL</label>
          <input
            name="imageUrl"
            defaultValue={product.imageUrl || ""}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Description</label>
          <textarea
            name="description"
            defaultValue={product.description || ""}
            required
          />
        </div>

        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <button className={styles.updateBtn} type="submit">
          Update
        </button>
      </form>
    </div>
  );
};

export default ProductView;
