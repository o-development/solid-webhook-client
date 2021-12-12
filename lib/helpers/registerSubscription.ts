import { FetchFunction } from "./fetchFunction";
import { GatewayResponse } from "./getGateway";

export interface SubscriptionResponse {
  type: string;
  target: string;
  unsubscribe_endpoint: string;
}

export async function registerSubscription(
  gatewayResponse: GatewayResponse,
  resourceUri: string,
  webhookTarget: string,
  options?: { fetch?: FetchFunction }
): Promise<SubscriptionResponse> {
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
  return subscriptionResponse;
}
