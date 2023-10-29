import { DAY_OF_BIRTH, MONTH_OF_BIRTH, YEAR_OF_BIRTH, SURNAME } from "../constants/student-info.js";
import { SVD_Blockchain } from "./blockchain.class.js";

const nonce = parseInt(`${DAY_OF_BIRTH}${MONTH_OF_BIRTH}${YEAR_OF_BIRTH}`);

export const blockchain = new SVD_Blockchain(nonce, SURNAME);

