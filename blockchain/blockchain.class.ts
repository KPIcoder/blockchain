import { IBlock, ITransaction } from "./blockchain.interface.js";
import { generateRandomString } from "../helpers/string.js";
import { hash } from "../helpers/hash.js";
import { MONTH_OF_BIRTH } from "../constants/student-info.js";

export class SVD_Blockchain {
  private SVD_currentTransactions: ITransaction[] = [];
  private SVD_chain: IBlock[] = [];

  constructor(nonce?: number, secret?: string) {
    // генезис-блок

    const persistedNonce = nonce ?? 13102003;
    const persistedSecret = secret ?? "Shchehlov";

    
    this.SVD_createGenesisBlock(persistedNonce, persistedSecret);
  }

  static SVD_hashBlock(block: IBlock) {
    const { index, timestamp, proof, previousHash } = block;
    const currentHash = hash(index + timestamp + proof + previousHash);
    block.currentHash = currentHash;
    return currentHash;
  }

  public SVD_newBlock(previousHash?: string) {
    const previousBlock = this.SVD_getLastBlock();

    const partialBlock: Omit<IBlock, "currentHash"> = {
      index: previousBlock.index + 1,
      timestamp: Date.now(),
      transactions: this.SVD_currentTransactions,
      proof: previousBlock.proof,
      previousHash:
        previousHash ||
        SVD_Blockchain.SVD_hashBlock(this.SVD_chain[this.SVD_chain.length - 1]),
    };

    const newBlock = this.SVD_proofOfWork({ ...partialBlock, currentHash: "" });

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

  public SVD_proofOfWork(block: IBlock) {
    while (!this.SVD_isValidProof(block)) {
      block.proof++;
    }
    return block;
  }

  protected SVD_isValidProof(block: IBlock) {
    const SECRET = "10"; // defined by task
    const guessHash = SVD_Blockchain.SVD_hashBlock(block);
    return guessHash.endsWith(SECRET);
  }

  private SVD_createGenesisBlock(nonce: number, secret: string) {
    
    // miner`s prize
    this.SVD_newTransaction({
      sender: '0',
      recipient: generateRandomString(),
      amount: MONTH_OF_BIRTH
    })

    const partialBlock: Omit<IBlock, "previousHash" | "currentHash"> = {
      index: this.SVD_chain.length,
      timestamp: Date.now(),
      transactions: this.SVD_currentTransactions,
      proof: nonce,
    };

    const initialHash = SVD_Blockchain.SVD_hashBlock({
      ...partialBlock,
      previousHash: secret,
      currentHash: "",
    });

    const genesisBlock: IBlock = {
      ...partialBlock,
      previousHash: secret,
      currentHash: initialHash,
    };

    this.SVD_chain = [genesisBlock];
    this.SVD_currentTransactions = []
  }
}
