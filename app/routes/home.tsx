import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Layout } from "~/components/Layout";
import { UserPanel } from "~/components/UserPanel";
import { requireUserId } from "~/utils/auth.server";
import { getOtherUsers } from "~/utils/users.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const users = await getOtherUsers(userId);
  console.dir(users);
  return json({ users });
};

export default function Home() {
  const { users } = useLoaderData();
  console.log("users: ", users);
  return (
    <Layout>
      <div className="h-full flex">
        <UserPanel {...{ users }} />
      </div>
    </Layout>
  );
}
