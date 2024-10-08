import { IncomingMessage, ServerResponse } from "node:http";
import { parse } from "node:url";

export const receiveArgs = async (req: IncomingMessage) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(Buffer.from(chunk));
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};

export const httpError = (
  res: ServerResponse,
  status: number,
  message: string
) => {
  res.statusCode = status;
  res.end(`"${message}"`);
};

export const parseUrl = (url: string) => parse(url, true);
