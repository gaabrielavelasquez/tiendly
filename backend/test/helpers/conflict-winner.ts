import assert from "node:assert/strict";
import { BusinessError } from "../../src/identity/domain/access.ts";

// Either contender may win. Unexpected rejections must never count as conflicts.
export async function conflictWinner<T>(attempts: [Promise<T>, Promise<T>]): Promise<T> {
  const results = await Promise.allSettled(attempts);
  const winners = results.filter(result => result.status === "fulfilled");
  const losers = results.filter(result => result.status === "rejected");
  assert.equal(winners.length, 1, "Exactly one write must succeed.");
  assert.equal(losers.length, 1, "Exactly one write must be rejected.");
  assert.ok(losers[0].reason instanceof BusinessError, "The losing write must report a business conflict.");
  assert.equal(losers[0].reason.code, "conflict");
  return winners[0].value;
}
