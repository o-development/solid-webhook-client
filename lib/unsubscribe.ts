import crossFetch from "cross-fetch";

/**
 * Unsubscribe from a resource
 */
 export async function unsubscribe(
  unsubscribeEndpoint: string,
  options?: {
    authenticatedFetch?: (
      input: RequestInfo,
      init?: RequestInit
    ) => Promise<Response>;
  }
): Promise<void> {
  const fetch = options?.authenticatedFetch || crossFetch;
  await (
    await fetch(unsubscribeEndpoint, { method: "DELETE" })
  ).text();
}
