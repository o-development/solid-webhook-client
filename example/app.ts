import { subscribe, unsubscribe, verifyAuthIssuer } from "../lib";
import path from "path";
import express, { Request, Response } from "express";
import {
  getSessionFromStorage,
  Session,
} from "@inrupt/solid-client-authn-node";
import cookieSession from "cookie-session";
import bodyParser from "body-parser";

const PORT = 3001;
const LOCAL_ORIGIN = `http://localhost:${PORT}`;
const POD_ORIGIN = `http://localhost:3000`;
const RESOURCE_NAME = "test.ttl";
const RESOURCE_CONTAINER = "/jackson/profile/";
const RESOURCE_PATH = `${RESOURCE_CONTAINER}${RESOURCE_NAME}`;

const app = express();
app.use(cookieSession({ keys: ["tempKey"], secure: false }));

app.get("/", (req, res) => {
  renderDashboard(res);
});

let unsubscribeUris: string[] = [];

// Step 1: Login using Inrupt's client library.
// This is a simplified version of what's required. Go
// to https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/authenticate-nodejs/
// for more information.
app.get("/login", async (req, res) => {
  if (req.session) {
    const authSession = new Session();
    req.session.sessionId = authSession.info.sessionId;
    await authSession.login({
      redirectUrl: `${LOCAL_ORIGIN}/login-redirect`,
      oidcIssuer: POD_ORIGIN,
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
  const authSession = await getAuthSession(req);
  await authSession.handleIncomingRedirect(`${LOCAL_ORIGIN}${req.url}`);
  renderDashboard(res);
});

app.get("/create", async (req, res) => {
  const authSession = await getAuthSession(req);
  await authSession.fetch(`${POD_ORIGIN}${RESOURCE_CONTAINER}`, {
    method: "post",
    headers: {
      "content-type": "text/turtle",
      slug: RESOURCE_NAME,
      link: `http://www.w3.org/ns/ldp#Resource; rel="type"`,
    },
    body: "<http://example.org/#spiderman> <http://www.perceive.net/schemas/relationship/enemyOf> <http://example.org/#green-goblin> .",
  });
  console.log("Created Document");
  renderDashboard(res);
});

app.get("/subscribe", async (req, res) => {
  const authSession = await getAuthSession(req);
  const { unsubscribeEndpoint } = await subscribe(
    `${POD_ORIGIN}${RESOURCE_CONTAINER}`,
    `${LOCAL_ORIGIN}/webhook`,
    { fetch: authSession.fetch }
  );
  unsubscribeUris.push(unsubscribeEndpoint);
  console.log("Subscribed to Resource");
  renderDashboard(res);
});

app.get("/update", async (req, res) => {
  const authSession = await getAuthSession(req);
  await authSession.fetch(`${POD_ORIGIN}${RESOURCE_PATH}`, {
    method: "patch",
    headers: {
      "content-type": "application/sparql-update",
    },
    body: "INSERT DATA { <http://example.org/#spiderman> <http://www.perceive.net/schemas/relationship/enemyOf> <http://example.org/#electro> . }",
  });
  console.log("Updated Document");
  renderDashboard(res);
});

app.get("/delete", async (req, res) => {
  const authSession = await getAuthSession(req);
  await authSession.fetch(`${POD_ORIGIN}${RESOURCE_PATH}`, {
    method: "delete",
  });
  console.log("Deleted Document");
  renderDashboard(res);
});

app.get("/unsubscribe", async (req, res) => {
  const authSession = await getAuthSession(req);
  console.log("Unsubscribe");
  await Promise.all(
    unsubscribeUris.map(async (unsubscribeUri) => {
      await unsubscribe(unsubscribeUri, {
        authenticatedFetch: authSession.fetch,
      });
    })
  );
  unsubscribeUris = [];
  console.log("Unsubscribed from all");
  renderDashboard(res);
});

// When a change happens to the file, this route will be called
app.post(
  "/webhook",
  bodyParser.json({ type: "application/ld+json" }),
  async (req, res) => {
    console.log("Webhook request");
    if ((await verifyAuthIssuer(req.headers.authorization)) === POD_ORIGIN) {
      console.log("Webhook valid");
      console.log(req.body);
    } else {
      console.log("This issuer is invalid");
    }

    res.sendStatus(200);
  }
);

app.listen(3001, () => {
  console.info("Listening on 3001");
});

function renderDashboard(res: Response): void {
  res.sendFile("./dashboard.html", {
    root: path.join(__dirname),
  });
}

async function getAuthSession(req: Request): Promise<Session> {
  if (req.session && req.session.sessionId) {
    const authSession = await getSessionFromStorage(req.session.sessionId);
    if (!authSession) {
      throw new Error("No session available");
    }
    return authSession;
  } else {
    throw new Error("No session available");
  }
}
