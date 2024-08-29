export interface IBlock {
  index: number;
  timestamp: number;
  transactions: ITransaction[];
  proof: number;
  currentHash: string;
  previousHash: string;
}

export interface ITransaction {
  sender: string;
  recipient: string;
  amount: number;
  timestamp: number;
  hash: string;
}

export interface IBlockchain {
  SVD_currentTransactions: ITransaction[];
  SVD_chain: IBlock[];
  nodes: Set<string>;
}

export type TransactionDTO = Omit<ITransaction, "timestamp" | "hash">;

export type BlockDTO = Omit<IBlock, "currentHash" | "transactions">;
