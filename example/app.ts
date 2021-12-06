import { subscribe, unsubscribe, parseIncomingRequest } from "../src";
import express from "express";
import {
  getSessionFromStorage,
  getSessionIdFromStorageAll,
  Session,
} from "@inrupt/solid-client-authn-node";
import cookieSession from "cookie-session";

const app = express();
app.use(cookieSession({ keys: ["tempKey"], secure: false }));

// Step 1: Login using Inrupt's client library.
// This is a simplified version of what's required. Go
// to https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/authenticate-nodejs/
// for more information.
app.get("/login", async (req, res) => {
  if (req.session) {
    const authSession = new Session();
    req.session.sessionId = authSession.info.sessionId;
    await authSession.login({
      redirectUrl: `http://localhost:3001/login-redirect`,
      oidcIssuer: "http://localhost:3000",
      clientName: "Webhook Demo app",
      handleRedirect: (redirectUrl) => {
        res.redirect(redirectUrl);
      },
    });
  } else {
    res.sendStatus(500);
  }
});

// Step 2: After logging in you'll automatically be redirected to
// this route. Once the user is properly authenticated, you can call
// "subscribe" to subscribe to a webhook.
app.get("/login-redirect", async (req, res) => {
  if (req.session && typeof req.session.sessionId === "string") {
    const authSession = await getSessionFromStorage(req.session.sessionId);
    if (authSession) {
      await authSession.handleIncomingRedirect(
        `http://localhost:3001${req.url}`
      );
    }
    res.sendStatus(200);

    // Start the subscription v----------------------
  } else {
    res.sendStatus(500);
  }
});

app.get("/webhook", async (req, res) => {
  const parsedData = await parseIncomingRequest(req);

  /*
    Logs:
    {
      object: "https://example.pod/resource1",
      type: "update",
      unsubscribeEndpoint: "https://example.pod/unsubscribe/e0f3fca0-cb35-4c20-8437-72f35"
    }
  */
  console.log(parsedData);

  // Unsubscribe from the webhook
  await unsubscribe(parsedData.unsubscribeEndpoint);

  res.send();
});

app.listen(3001, () => {
  console.info("Listening on 3001");
  // Create the webhook subscription
  // subscribe("https://example.pod/resource1");
});
