import type { IncomingMessage, ServerResponse } from "node:http";

import { httpError, receiveArgs } from "../server/index.js";
import { blockchain } from "../blockchain/index.js";
import { ITransaction } from "../blockchain/blockchain.interface.js";

export const newTransactionController = async (req: IncomingMessage, res: ServerResponse) => {
    const transaction: ITransaction = await receiveArgs(req)

    if(!transaction.sender || !transaction.recipient || !transaction.amount) {
        httpError(res, 400, 'Invalid data')
        return
    }

    const { index } = blockchain.SVD_newTransaction(transaction)

    res.statusCode = 201
    res.setHeader('Content-Type', 'text/plain')
    res.end(`Transactions will be added to a block with index: ${index + 1}`)
}