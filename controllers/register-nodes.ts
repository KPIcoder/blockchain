import type { IncomingMessage, ServerResponse } from "node:http";

import { httpError, receiveArgs } from "../server/index.js";
import { blockchain } from "../blockchain/index.js";

export const registerNodesController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const nodeUrls: string[] = await receiveArgs(req);

  if (!Array.isArray(nodeUrls)) {
    httpError(res, 400, "Invalid data");
    return;
  }

  nodeUrls.forEach((nodeUrl) => blockchain.SVD_registerNode(nodeUrl));

  res.statusCode = 201;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ nodes: nodeUrls }));
};
