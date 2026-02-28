import { Redis } from "@upstash/redis";
import { Session } from "./types";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const SESSION_TTL = 7200; // 2 hours in seconds
const KEY = (id: string) => `newsletter:session:${id}`;

export async function getSession(sessionId: string): Promise<Session | null> {
  return redis.get<Session>(KEY(sessionId));
}

export async function setSession(session: Session): Promise<void> {
  await redis.set(KEY(session.sessionId), session, { ex: SESSION_TTL });
}

export async function updateSession(
  sessionId: string,
  updates: Partial<Session>
): Promise<Session | null> {
  const session = await getSession(sessionId);
  if (!session) return null;
  const updated: Session = { ...session, ...updates, updatedAt: Date.now() };
  await setSession(updated);
  return updated;
}
