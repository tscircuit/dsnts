import { quoteSExprString } from "./quoteSExprString"

/** Keep conventional bare IDs, quoting delimiters and reserved literal tokens. */
export const formatDsnIdentifier = (value: string): string => {
  if (/^[^\s()"\\;]+$/u.test(value) && !["nil", "#t", "#f"].includes(value)) {
    return value
  }
  return quoteSExprString(value)
}
