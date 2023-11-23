import type { IncomingMessage, ServerResponse } from "node:http";
import { httpError, parseUrl } from "../server/index.js";
import { blockchain } from "../blockchain/index.js";

export const balanceController = (
  req: IncomingMessage,
  res: ServerResponse
) => {
  if (req.errored) {
    httpError(res, 400, req.errored.message);
    return;
  }

  const { query } = parseUrl(req.url);

  const address = query.address as string;

  const balance = blockchain.SVD_getBalance(address);

  res.statusCode = 201;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      successMessage: `Your address is ${address}`,
      balance,
    })
  );
};
