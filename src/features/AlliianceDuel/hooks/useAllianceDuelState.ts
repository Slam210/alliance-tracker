import { useState } from "react";
import type { Member } from "../../../types/member";

export function useAllianceDuelState() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [search, setSearch] = useState("");

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [showPopup, setShowPopup] = useState(false);
  const [showBatchPopup, setShowBatchPopup] = useState(false);

  const [points, setPoints] = useState<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [exception, setException] = useState(false);

  return {
    // state
    selectedDate,
    search,
    selectedMember,
    showPopup,
    points,
    isSubmitting,
    exception,
    showBatchPopup,

    // setters
    setSelectedDate,
    setSearch,
    setSelectedMember,
    setShowPopup,
    setPoints,
    setIsSubmitting,
    setException,
    setShowBatchPopup,
  };
}
