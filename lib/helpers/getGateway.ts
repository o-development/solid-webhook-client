import { FetchFunction } from "./fetchFunction";
import { WellKnownDocument } from "./getWellKnownDocument";
import crossFetch from "cross-fetch";

export interface GatewayResponse {
  type: string;
  endpoint: string;
  features: string[];
}

export async function getGateway(
  wellKnownDocument: WellKnownDocument,
  options?: { fetch?: FetchFunction }
): Promise<GatewayResponse> {
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
  return gatewayResponse;
}
