const USERS_ENDPOINT = "/api/users";
const PRODUCTS_ENDPOINT = "/api/products";

async function handleApiResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

export async function GETUSERS() {
  const response = await fetch(USERS_ENDPOINT, {
    method: "GET",
    cache: "no-store",
  });

  const data = await handleApiResponse(response);
  return data.users || [];
}

export async function DELETEUSER(userId) {
  if (!userId) {
    throw new Error("User id is required");
  }

  const response = await fetch(`${USERS_ENDPOINT}/${userId}`, {
    method: "DELETE",
  });

  return handleApiResponse(response);
}

export async function GETUSER(userId) {
  if (!userId) {
    throw new Error("User id is required");
  }

  const response = await fetch(`${USERS_ENDPOINT}/${userId}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await handleApiResponse(response);
  return data.user;
}

export async function GETPRODUCTS() {
  const response = await fetch(PRODUCTS_ENDPOINT, {
    method: "GET",
    cache: "no-store",
  });

  const data = await handleApiResponse(response);
  return data.products || [];
}

export async function GETPRODUCT(productId) {
  if (!productId) {
    throw new Error("Product id is required");
  }

  const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await handleApiResponse(response);
  return data.product;
}

export async function DELETEPRODUCT(productId) {
  if (!productId) {
    throw new Error("Product id is required");
  }

  const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}`, {
    method: "DELETE",
  });

  return handleApiResponse(response);
}

export async function CREATEPRODUCT(payload) {
  const response = await fetch(PRODUCTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleApiResponse(response);
}
