import { FetchFunction } from "./helpers/fetchFunction";
import { getWellKnownDocument } from "./helpers/getWellKnownDocument";
import { registerSubscription } from "./helpers/registerSubscription";
import { getNotificationChannel } from "./helpers/getNotificationChannel";

/**
 * Creates a webhook subscription
 * @param resourceUri
 * @param options
 */
export async function subscribe(
  resourceUri: string,
  webhookTarget: string,
  options?: {
    fetch?: FetchFunction;
  }
): Promise<{ unsubscribeEndpoint: string }> {
  const wellKnownDocument = await getWellKnownDocument(resourceUri, {
    fetch: options?.fetch,
  });
  const notificationChannel = await getNotificationChannel(wellKnownDocument, {
    fetch: options?.fetch,
  });
  const subscriptionResponse = await registerSubscription(
    notificationChannel,
    resourceUri,
    webhookTarget,
    { fetch: options?.fetch }
  );

  return { unsubscribeEndpoint: subscriptionResponse.unsubscribe_endpoint };
}
