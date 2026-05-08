"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SaveTheDate from "@/components/SaveTheDate";
import Envelope from "@/components/Envelope";
import Invitation from "@/components/Invitation";
import { eventConfig } from "@/lib/event";

type Stage = "save" | "envelope" | "invitation";

export default function GuestInvitationClient({
  token,
  guestName,
  invitedCount,
}: {
  token: string;
  guestName: string;
  invitedCount: number;
}) {
  const [stage, setStage] = useState<Stage>("save");

  return (
    <AnimatePresence mode="wait">
      {stage === "save" && (
        <motion.div
          key="save"
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7 }}
        >
          <SaveTheDate
            onContinue={() => setStage("envelope")}
            personalGreeting={guestName}
          />
        </motion.div>
      )}
      {stage === "envelope" && (
        <motion.div
          key="envelope"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6 }}
        >
          <Envelope
            onOpen={() => setStage("invitation")}
            initials={eventConfig.initials}
            recipient={guestName}
          />
        </motion.div>
      )}
      {stage === "invitation" && (
        <motion.div
          key="invitation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Invitation
            guest={{ token, name: guestName, invitedCount }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
