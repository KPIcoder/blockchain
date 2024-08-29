import { SVD_Block } from "./block.class.js";
import { IBlock, IBlockchain, ITransaction } from "./blockchain.interface.js";

export class BlockchainUtils {
  static getLongestNode(nodes: Record<string, IBlockchain>): {
    url: string;
    node: Omit<IBlockchain, "nodes">;
  } {
    let longestChain: IBlock[] = [];
    let maxLength = 0;
    let mempool: ITransaction[] = [];
    let url = "";

    const nodeUrls = Object.keys(nodes);

    for (let i = 0; i < nodeUrls.length; i++) {
      const node = nodes[nodeUrls[i]];
      if (
        node.SVD_chain.length >= maxLength &&
        BlockchainUtils.SVD_validChain(node.SVD_chain as SVD_Block[])
      ) {
        maxLength = node.SVD_chain.length;
        longestChain = node.SVD_chain;
        mempool = node.SVD_currentTransactions;
        url = nodeUrls[i];
      }
    }

    return {
      url,
      node: {
        SVD_currentTransactions: mempool,
        SVD_chain: longestChain,
      },
    };
  }

  static getAllUserTransactions(node: IBlockchain) {
    return node.SVD_chain.map((block) =>
      block.transactions.slice(0, block.transactions.length - 1)
    ).flat();
  }

  static async getAllNodes(
    nodeUrls: Set<string>
  ): Promise<Record<string, IBlockchain>> {
    const nodeUrlsArray = Array.from(nodeUrls);

    const promises = nodeUrlsArray.map((url) => fetch(`${url}/chain`));

    const responses = await Promise.all(promises);
    const nodes = await Promise.all(
      responses.map((response) => response.json() as Promise<IBlockchain>)
    );

    return nodes.reduce((hastTable, node, currentIndex) => {
      hastTable[nodeUrlsArray[currentIndex]] = node;
      return hastTable;
    }, {});
  }

  static SVD_validChain(chain: SVD_Block[]) {
    for (let i = 1; i < chain.length; i++) {
      const previousBlock = chain[i - 1];
      const currentBlock = chain[i];

      if (previousBlock.currentHash !== currentBlock.previousHash) return false;

      // TODO: move PoW to a separate class
      if (!SVD_Block.SVD_isValidProof(currentBlock.currentHash)) return false;
    }

    return true;
  }
}
