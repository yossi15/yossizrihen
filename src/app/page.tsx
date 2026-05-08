"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Envelope from "@/components/Envelope";
import Invitation from "@/components/Invitation";
import { eventConfig } from "@/lib/event";

export default function Home() {
  const [opened, setOpened] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!opened ? (
        <motion.div
          key="envelope"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6 }}
        >
          <Envelope onOpen={() => setOpened(true)} initials={eventConfig.initials} />
        </motion.div>
      ) : (
        <motion.div
          key="invitation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Invitation />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
