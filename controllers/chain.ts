import type { IncomingMessage, ServerResponse } from "node:http";

import { blockchain } from "../blockchain/index.js";
import { httpError } from "../server/index.js";

export const chainController = (req: IncomingMessage, res: ServerResponse) => {
  if (req.errored) {
    httpError(res, 400, req.errored.message);
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(blockchain));
};
