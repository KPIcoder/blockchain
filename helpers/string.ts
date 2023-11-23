import { randomBytes } from "node:crypto";

export const generateRandomString = (length?: number) =>
  randomBytes(length ? length * 4 : 32).toString("hex");
