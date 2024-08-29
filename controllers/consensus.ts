import type { IncomingMessage, ServerResponse } from "node:http";

import { blockchain } from "../blockchain/index.js";
import { httpError } from "../server/index.js";

export const consensusController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  if (req.errored) {
    httpError(res, 400, req.errored.message);
    return;
  }

  const hasNodeBeenReplaced = await blockchain.SVD_resolveConflicts();

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      message: hasNodeBeenReplaced
        ? "Our chain has been replaced"
        : "Our chain is authoritative",
      chain: blockchain.chain,
    })
  );
};
