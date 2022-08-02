import { FetchFunction } from "./fetchFunction";
import { WellKnownDocument } from "./getWellKnownDocument";
import crossFetch from "cross-fetch";
import assert from "assert";

export interface NotificationChannel {
  type: string;
  endpoint: string;
  features: string[];
}

export interface GatewayResponse {
  notificationChannel: NotificationChannel[];
}

export async function getNotificationChannel(
  wellKnownDocument: WellKnownDocument,
  options?: { fetch?: FetchFunction }
): Promise<NotificationChannel> {
  const fetch = options?.fetch || crossFetch;
  const gatewayResponse: GatewayResponse = await (
    await fetch(wellKnownDocument.notification_endpoint, {
      method: "post",
      body: JSON.stringify({
        "@context": ["https://www.w3.org/ns/solid/notification/v1"],
        type: ["WebHookSubscription2021"],
        features: ["state"],
      }),
    })
  ).json();
  assert(
    Array.isArray(gatewayResponse.notificationChannel),
    "Invalide Gateway Response"
  );
  const notificationChannel = gatewayResponse.notificationChannel.find(
    (channel) => {
      return channel.type === "WebHookSubscription2021" && channel.endpoint;
    }
  );
  assert(
    notificationChannel,
    "This Pod is not compatible with WebHookSubscription2021"
  );
  return notificationChannel;
}
