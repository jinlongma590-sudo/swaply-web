"use client";
import { useEffect } from "react";

export default function ClientRedirect() {
  useEffect(() => {
    try {
      const q = typeof window !== "undefined" ? (window.location.search || "") : "";
      const h = typeof window !== "undefined" ? (window.location.hash   || "") : "";
      const target = `cc.swaply.app://login-callback${q}${h}`;
      window.location.replace(target);
    } catch {}
  }, []);
  return null;
}
