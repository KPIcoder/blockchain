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
}
