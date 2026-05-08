import { notFound } from "next/navigation";
import { getGuest } from "@/lib/repo";
import GuestInvitationClient from "./client";

export const dynamic = "force-dynamic";

type Params = { token: string };

export default async function GuestInvitationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { token } = await params;
  const guest = getGuest(token);
  if (!guest) notFound();

  return (
    <GuestInvitationClient
      token={guest.id}
      guestName={guest.name}
      invitedCount={guest.invited_count}
    />
  );
}
