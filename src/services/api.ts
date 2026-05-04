import type { Member } from "../types/member";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

async function post<T>(body: unknown): Promise<T> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    console.error("Non-JSON response:", text);
    throw new Error("Server returned invalid JSON");
  }
}

export async function getMembers(): Promise<Member[]> {
  const data = await post<{ members: Member[] }>({
    action: "getMembers",
  });

  return data.members;
}

export async function addMember(name: string, nickname?: string) {
  return post({
    action: "addMember",
    name,
    nickname,
  });
}

export async function updateStatus(id: string, status: string) {
  return post({
    action: "updateStatus",
    id,
    status,
  });
}

export async function renameMember(
  id: string,
  name?: string,
  nickname?: string,
) {
  return post({
    action: "renameMember",
    id,
    name,
    nickname,
  });
}
