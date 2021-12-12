import { JWK } from "jose";
import fetch from "cross-fetch";
import { WellKnownDocument } from "./getWellKnownDocument";

export interface JwksResponse {
  keys: JWK[];
}

export async function getJwks(wellKnownDocument: WellKnownDocument): Promise<JwksResponse> {
  return (await fetch(wellKnownDocument.jwks_endpoint)).json();
}