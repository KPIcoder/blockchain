import { IBlock, ITransaction } from "./blockchain.interface.js";
import { generateRandomString } from "../helpers/string.js";
import { MONTH_OF_BIRTH } from "../constants/student-info.js";
import { SVD_Block } from "./block.class.js";

export class SVD_Blockchain {
  private SVD_currentTransactions: ITransaction[] = [];
  private SVD_chain: IBlock[] = [];

  constructor(nonce?: number, secret?: string) {
    // генезис-блок

    const persistedNonce = nonce ?? 13102003;
    const persistedSecret = secret ?? "Shchehlov";

    this.SVD_createGenesisBlock(persistedNonce, persistedSecret);
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

  public SVD_newTransaction(transaction: ITransaction) {
    this.SVD_currentTransactions.push(transaction);
    return this.SVD_getLastBlock();
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
}
