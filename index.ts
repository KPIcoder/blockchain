import { SVD_Blockchain } from "./blockchain.js";

const SURNAME = "shchehlov";
const MONTH_OF_BIRTH = 10;
const DAY_OF_BIRTH = 13;
const YEAR_OF_BIRTH = 2003;

const nonce = parseInt(`${DAY_OF_BIRTH}${MONTH_OF_BIRTH}${YEAR_OF_BIRTH}`);

const BlockChain = new SVD_Blockchain(nonce, SURNAME);

const firstBlock = BlockChain.SVD_getLastBlock();

BlockChain.SVD_newBlock(firstBlock.currentHash);

BlockChain.SVD_newTransaction({
  sender: "vlad",
  recipient: "someone",
  amount: 5,
});

const secondBlock = BlockChain.SVD_getLastBlock();

BlockChain.SVD_newBlock(secondBlock.currentHash);

console.log(BlockChain);
