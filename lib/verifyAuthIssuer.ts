import jwtDecode from "jwt-decode";
import { getWellKnownDocument } from "./helpers/getWellKnownDocument";
import { getJwks } from "./helpers/getJwks";
import { jwtVerify } from "jose";
import { importJWK } from 'jose';

/**
 * Parses the incoming webhook request
 * @param authHeader: the auth header given in the request
 * @returns the issuer if the token is valid, undefined if it is not 
 */
 export async function verifyAuthIssuer(authHeader?: string): Promise<string | undefined> {
  if (!authHeader) {
    return undefined;
  }
  const decoded: { iss: string } = await jwtDecode(authHeader);
  if (!decoded.iss) {
    // Has no issuer
    return undefined;
  }
  const solidWellKnown = await getWellKnownDocument(decoded.iss);
  const jwks = await getJwks(solidWellKnown);
  
  try {
    // TODO: keys is hard coded
    await jwtVerify(authHeader, await importJWK(jwks.keys[0]))
  } catch (err: unknown) {
    return undefined;
  }

  return decoded.iss;
}