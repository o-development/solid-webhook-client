# Solid Webhook Client

## Installation

```
npm i solid-webhook-client
```

## Usage

```typescript
import { subscribe, unsubscribe, parseIncomingRequest } from "../src";
import express from "express";

const app = express();

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

app.listen(3000, () => {
  // Create the webhook subscription
  subscribe("https://example.pod/resource1");
});
```