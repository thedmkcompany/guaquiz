"use client";

import { useEffect, useState } from "react";
import SalesChatWidget from "./SalesChatWidget";

export default function SalesChatWidgetClientOnly() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <SalesChatWidget />;
}

