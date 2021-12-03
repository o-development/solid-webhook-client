import { IncomingMessage } from "http";

/**
 * Creates a webhook subscription
 * @param resourceUri
 * @param options
 */
export function subscribe(
  resourceUri,
  options?: {
    authenticatedFetch?: (
      input: RequestInfo,
      init?: RequestInit
    ) => Promise<Response>;
  }
): Promise<{ unsubscribeEndpoint: string }> {
  throw new Error("Not Implemented");
}

/**
 * Unsubscribe from a resource
 */
export function unsubscribe(unsubscribeEndpoint: string): Promise<void> {
  throw new Error("Not Implemented");
}

/**
 * Parses the incoming webhook request
 */
export function parseIncomingRequest(request: IncomingMessage): Promise<{
  object: string;
  type: "Update" | "Delete";
  unsubscribeEndpoint: string;
}> {
  throw new Error("Not Implemented");
}
