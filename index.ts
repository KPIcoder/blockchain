import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

import { newTransactionController } from "./controllers/new-transaction.js";
import { chainController } from "./controllers/chain.js";
import { mineController } from "./controllers/mine.js";

const PORT = 3001

const routes = [
  { route: '/transaction/new', method: 'POST', action: newTransactionController},
  { route: '/mine', method: 'GET', action: mineController },
  { route: '/chain', method: 'GET', action: chainController },
]

createServer((req: IncomingMessage, res: ServerResponse) => {
  const matchingRoute = routes.find(r => r.route === req.url && r.method === req.method);

  if (matchingRoute) {
      matchingRoute.action(req, res);
  } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
  }
}).listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
