import { FetchFunction } from "./fetchFunction";
import crossFetch from "cross-fetch";
import { NotificationChannel } from "./getNotificationChannel";

export interface SubscriptionResponse {
  type: string;
  target: string;
  unsubscribe_endpoint: string;
}

export async function registerSubscription(
  notificationChannel: NotificationChannel,
  resourceUri: string,
  webhookTarget: string,
  options?: { fetch?: FetchFunction }
): Promise<SubscriptionResponse> {
  const fetch = options?.fetch || crossFetch;
  const subscriptionResponse: SubscriptionResponse = await (
    await fetch(notificationChannel.endpoint, {
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
