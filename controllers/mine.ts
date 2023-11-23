import type { IncomingMessage, ServerResponse } from "node:http";

import { httpError, parseUrl } from "../server/index.js";
import { blockchain } from "../blockchain/index.js";
import { MONTH_OF_BIRTH } from "../constants/student-info.js";

export const mineController = (req: IncomingMessage, res: ServerResponse) => {
  if (req.errored) {
    httpError(res, 400, req.errored.message);
    return;
  }

  const { query } = parseUrl(req.url);

  const minerAddress = query.address as string;

  // miner`s prize
  blockchain.SVD_newTransaction({
    sender: "0", // defined for miners
    recipient: minerAddress,
    amount: MONTH_OF_BIRTH,
  });
  // all logic of calculating PoW is encapsulated in this method
  const newBlock = blockchain.SVD_newBlock();

  console.log(req.url);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(newBlock));
};
