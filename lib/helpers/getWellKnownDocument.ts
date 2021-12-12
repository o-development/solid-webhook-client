import { FetchFunction } from "./fetchFunction";
import crossFetch from "cross-fetch";

export interface WellKnownDocument {
  notification_endpoint: string;
  jwks_endpoint: string;
}

export async function getWellKnownDocument(
  issuer: string,
  options?: { fetch?: FetchFunction }
): Promise<WellKnownDocument> {
  const fetch = options?.fetch || crossFetch;

  // Get the .well-known doucument
  const wellKnownUri = new URL(issuer);
  wellKnownUri.pathname = "/.well-known/solid";
  wellKnownUri.hash = "";
  const wellKnownDocument: WellKnownDocument = await (
    await fetch(wellKnownUri.toString())
  ).json();
  return wellKnownDocument;
}
