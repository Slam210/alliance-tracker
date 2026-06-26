export async function apiRequest<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Request failed");
  }

  return data;
}

export async function apiJson<T>(
  url: string,
  method: string = "GET",
  body?: unknown,
): Promise<T> {
  return apiRequest<T>(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}
