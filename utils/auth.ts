import { Session } from "next-auth";

const authorized = process.env.AUTHORIZED_GITHUB_USERNAMES!;

export const isEditorUser = (session: Session | null): boolean =>
  authorized.split(",").includes(session?.user?.name || "");
