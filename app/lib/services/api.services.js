const USERS_ENDPOINT = "/api/users";

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
