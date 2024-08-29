import {
  IBlockchain,
  // IBlockchain,
  ITransaction,
  TransactionDTO,
} from "./blockchain.interface.js";
import { generateRandomString } from "../helpers/string.js";
import { MONTH_OF_BIRTH } from "../constants/student-info.js";
import { SVD_Block } from "./block.class.js";
import { hash } from "../helpers/hash.js";
import { BlockchainUtils } from "./BlockchainUtils.js";

export class SVD_Blockchain {
  // TODO: make sure there is only one mempool
  private SVD_currentTransactions: ITransaction[] = [];
  private SVD_chain: SVD_Block[] = [];
  private nodes = new Set<string>();

  constructor(nonce?: number, secret?: string) {
    // генезис-блок

    const persistedNonce = nonce ?? 13102003;
    const persistedSecret = secret ?? "Shchehlov";

    this.SVD_createGenesisBlock(persistedNonce, persistedSecret);
  }

  public SVD_registerNode(netloc: string) {
    this.nodes.add(netloc);
  }

  // consensus
  public async SVD_resolveConflicts() {
    const nodes = await BlockchainUtils.getAllNodes(this.nodes);
    const newChain = BlockchainUtils.getLongestNode(nodes);
    const mempool = newChain.node.SVD_currentTransactions;
    const otherNodeUrls = Object.keys(nodes).filter(
      (url) => url !== newChain.url
    );

    const authorativeTransactions = BlockchainUtils.getAllUserTransactions(
      newChain.node as IBlockchain
    );

    const authorativeTransactionsHashes = authorativeTransactions.map(
      (t) => t.hash
    );

    console.dir({ authorativeTransactions });

    for (let i = 0; i < otherNodeUrls.length; i++) {
      const node = nodes[otherNodeUrls[i]];
      mempool.push(...node.SVD_currentTransactions);

      const userTransactions = BlockchainUtils.getAllUserTransactions(node);

      console.dir({ userTransactions });

      for (let j = 0; j < userTransactions.length; j++) {
        if (!authorativeTransactionsHashes.includes(userTransactions[j].hash)) {
          mempool.push(userTransactions[j]);
        }
      }
    }

    const hasBeenReplaced =
      newChain.node.SVD_chain.length !== this.SVD_chain.length;

    this.SVD_currentTransactions = mempool;
    this.SVD_chain = newChain.node.SVD_chain as SVD_Block[];

    return hasBeenReplaced;
  }

  public SVD_newBlock() {
    const previousBlock = this.SVD_getLastBlock();

    const newBlock = new SVD_Block(
      this.SVD_currentTransactions,
      previousBlock.currentHash,
      previousBlock.proof
    );

    this.SVD_currentTransactions = [];
    this.SVD_chain.push(newBlock);
    return newBlock;
  }

  public SVD_newTransaction(transactionDto: TransactionDTO) {
    const timestamp = Date.now();
    const transactionHash = hash(
      transactionDto.recipient +
        transactionDto.sender +
        transactionDto.amount +
        timestamp
    );

    const transaction: ITransaction = {
      timestamp,
      hash: transactionHash,
      ...transactionDto,
    };

    this.SVD_currentTransactions.push(transaction);
    return this.SVD_getLastBlock();
  }

  public SVD_getBalance(address: string) {
    const blockchainTransactions = this.SVD_chain.map(
      (block) => block.transactions
    ).flat();

    let balance = 0;

    for (let i = 0; i < blockchainTransactions.length; i++) {
      if (blockchainTransactions[i].recipient === address)
        balance += blockchainTransactions[i].amount;

      if (blockchainTransactions[i].sender === address)
        balance -= blockchainTransactions[i].amount;
    }
    return balance;
  }

  public SVD_getLastBlock() {
    return this.SVD_chain.length > 0
      ? this.SVD_chain[this.SVD_chain.length - 1]
      : null;
  }

  private SVD_createGenesisBlock(nonce: number, secret: string) {
    // imitate miner`s prize
    this.SVD_newTransaction({
      sender: "0",
      recipient: generateRandomString(),
      amount: MONTH_OF_BIRTH,
    });

    const genesisBlock = new SVD_Block(
      this.SVD_currentTransactions,
      secret,
      nonce
    );

    this.SVD_chain = [genesisBlock];
    this.SVD_currentTransactions = [];
  }

  public get chain() {
    return this.SVD_chain;
  }
}
