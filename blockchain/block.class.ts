import { hash } from "../helpers/hash.js";
import { nextBlockIndex } from "../helpers/sequence.js";
import { BlockDTO, IBlock, ITransaction } from "./blockchain.interface.js";

const SECRET = "10"; // defined by task

export class SVD_Block implements IBlock {
  index: number;
  timestamp: number;
  proof: number;
  transactions: ITransaction[];
  currentHash: string;
  previousHash: string;

  constructor(
    transactions: ITransaction[],
    previousHash: string,
    previousProof: number
  ) {
    this.SVD_createBlock(transactions, previousHash, previousProof);
  }

  static hash(block: BlockDTO) {
    const { index, timestamp, proof, previousHash } = block;
    return hash(index + timestamp + proof + previousHash);
  }

  private SVD_proofOfWork(block: BlockDTO) {
    let proof = this.proof;
    let currentHash = SVD_Block.hash(block);

    while (!this.SVD_isValidProof(currentHash)) {
      proof++;
      currentHash = SVD_Block.hash({ ...block, proof });
    }
    return { proof, currentHash };
  }

  private SVD_isValidProof(currentHash: string) {
    return currentHash.endsWith(SECRET);
  }

  private SVD_createBlock(
    transactions: ITransaction[],
    previousHash: string,
    previousProof: number
  ) {
    this.index = nextBlockIndex();
    this.timestamp = Date.now();
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.proof = previousProof;

    const partialBlock: BlockDTO = {
      index: this.index,
      timestamp: this.timestamp,
      previousHash: this.previousHash,
      proof: this.proof,
    };

    const { proof, currentHash } = this.SVD_proofOfWork(partialBlock);

    this.proof = proof;
    this.currentHash = currentHash;
  }
}
