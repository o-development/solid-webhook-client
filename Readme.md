# Solid Webhook Client

## Installation

```
npm i solid-webhook-client
```

## Usage

```typescript
import { subscribe, unsubscribe, parseIncomingRequest } from "solid-webhook-client";
import { fetch } from "@inrupt/solid-client-authn-js";
import express from "express";
import bodyParser from "body-parser";

const app = express();

app.post("/webhook", bodyParser.json({ type: "application/ld+json" }), async (req, res) => {
  console.log("Webhook request");
  if (await verifyAuthIssuer(req.headers.authorization) === "https://example.pod") {
    console.log("Webhook valid");
    console.log(JSON.parse(req.body));
  } else {
    console.log("This issuer is invalid");
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  // Create the webhook subscription
  subscribe("https://example.pod/resource1", { fetch: fetch });
});
```