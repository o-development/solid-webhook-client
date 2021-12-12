import { FetchFunction } from "./helpers/fetchFunction";
import { getWellKnownDocument } from "./helpers/getWellKnownDocument";
import { getGateway } from "./helpers/getGateway";
import { registerSubscription } from "./helpers/registerSubscription";

/**
 * Creates a webhook subscription
 * @param resourceUri
 * @param options
 */
 export async function subscribe(
  resourceUri: string,
  webhookTarget: string,
  options?: {
    fetch?: FetchFunction 
  }
): Promise<{ unsubscribeEndpoint: string }> {
  const wellKnownDocument = await getWellKnownDocument(resourceUri, { fetch: options?.fetch });
  const gatewayResponse = await getGateway(wellKnownDocument, { fetch: options?.fetch });
  const subscriptionResponse = await registerSubscription(gatewayResponse, resourceUri, webhookTarget, { fetch: options?.fetch });
  
  return { unsubscribeEndpoint: subscriptionResponse.unsubscribe_endpoint };
}