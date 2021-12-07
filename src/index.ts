import { IncomingMessage } from "http";
import crossFetch from "cross-fetch";
import { URL } from "url";

interface WellKnownDocument {
  notification_endpoint: string;
}

interface GatewayResponse {
  type: string;
  endpoint: string;
  features: string[];
}

interface SubscriptionResponse {
  type: string;
  target: string;
  unsubscribe_endpoint: string;
}

/**
 * Creates a webhook subscription
 * @param resourceUri
 * @param options
 */
export async function subscribe(
  resourceUri: string,
  webhookTarget: string,
  options?: {
    authenticatedFetch?: (
      input: RequestInfo,
      init?: RequestInit
    ) => Promise<Response>;
  }
): Promise<{ unsubscribeEndpoint: string }> {
  const fetch = options?.authenticatedFetch || crossFetch;

  // Get the .well-known doucument
  const wellKnownUri = new URL(resourceUri);
  wellKnownUri.pathname = "/.well-known/solid";
  wellKnownUri.hash = "";
  const wellKnownDoucment: WellKnownDocument = await (
    await fetch(wellKnownUri.toString())
  ).json();
  console.log("wellKnownDocument");
  console.log(wellKnownDoucment);
  const gatewayResponse: GatewayResponse = await (
    await fetch(wellKnownDoucment.notification_endpoint, {
      method: "post",
      body: JSON.stringify({
        "@context": ["https://www.w3.org/ns/solid/notification/v1"],
        type: ["WebHookSubscription2021"],
        features: ["state"],
      }),
    })
  ).json();
  console.log("GatewayResponse");
  console.log(gatewayResponse);
  const subscriptionResponse: SubscriptionResponse = await (
    await fetch(gatewayResponse.endpoint, {
      method: "post",
      body: JSON.stringify({
        "@context": ["https://www.w3.org/ns/solid/notification/v1"],
        type: "WebHookSubscription2021",
        topic: resourceUri,
        target: webhookTarget,
        state: "opaque-state",
      }),
    })
  ).json();
  console.log("Subscription Response");
  console.log(subscriptionResponse);

  // Get the subscribe document
  return { unsubscribeEndpoint: subscriptionResponse.unsubscribe_endpoint };
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
