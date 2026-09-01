import type { Metadata } from "next";
import TripApp from "@/components/trip/TripApp";
import "./trip.css";

export const metadata: Metadata = {
  title: "תאילנד 2026 — מסלול, מפה וכשרות",
  description:
    "מתכנן מסלול לתאילנד 24.9–11.10: מפה אינטראקטיבית של אטרקציות, בתי חב\"ד ומסעדות כשרות, זמני שבת וחג, וטיפים תרמילאיים.",
};

export default function Page() {
  return <TripApp />;
}
