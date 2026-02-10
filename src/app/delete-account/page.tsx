// src/app/delete-account/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete My Account – Swaply",
  description:
    "How to delete your Swaply account, what data is removed, and the expected timing.",
};

export default function Page() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main style={{ background: "#EAF4FF", minHeight: "100vh", padding: "32px 0" }}>
      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          background: "white",
          borderRadius: 12,
          padding: 28,
          boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
          lineHeight: 1.6,
          color: "#1F2937",
        }}
      >
        <h1 style={{ fontSize: 28, margin: "4px 0 16px" }}>How to delete my account</h1>
        <p style={{ margin: "8px 0 20px", color: "#374151" }}>
          You can permanently delete your Swaply account at any time from within the app.
        </p>

        <h2 style={{ fontSize: 20, margin: "20px 0 8px" }}>Path in the app</h2>
        <p style={{ margin: "0 0 12px" }}>
          <strong>Profile → Account → Delete My Account</strong>
        </p>
        <p style={{ margin: "0 0 20px" }}>
          After confirming, the deletion request is submitted immediately.
        </p>

        <h2 style={{ fontSize: 20, margin: "20px 0 8px" }}>What gets deleted</h2>
        <p style={{ margin: "0 0 12px" }}>
          We delete or anonymize data directly linked to your user ID, including:
        </p>
        <ul style={{ paddingLeft: 20, margin: "0 0 16px" }}>
          <li>Profile information</li>
          <li>Your listings and related images/attachments</li>
          <li>Favorites / wishlists</li>
          <li>Notifications related to your account</li>
          <li>Listing views and basic activity logs</li>
          <li>Coupons / coupon usages that belong to you</li>
          <li>Pinned ads and search pins created by you</li>
          <li>Referrals and user tasks linked to your ID</li>
          <li>Blocks you created</li>
        </ul>
        <p style={{ margin: "0 0 20px", color: "#4B5563" }}>
          Some records may be retained in aggregated or anonymized form for security, anti-abuse,
          or analytics that do not identify you.
        </p>

        <h2 style={{ fontSize: 20, margin: "20px 0 8px" }}>Timing</h2>
        <ul style={{ paddingLeft: 20, margin: "0 0 16px" }}>
          <li>Account access is removed immediately after you confirm deletion.</li>
          <li>Data removal is processed promptly; residual backups may persist for up to 30 days.</li>
        </ul>

        <h2 style={{ fontSize: 20, margin: "20px 0 8px" }}>If you can’t access the app</h2>
        <p style={{ margin: "0 0 20px" }}>
          Email us from your registered address with subject <em>“Delete my Swaply account”</em>:
          <br />
          <strong>support@swaply.cc</strong>
        </p>

        <h2 style={{ fontSize: 20, margin: "20px 0 8px" }}>Questions</h2>
        <p style={{ margin: 0 }}>
          See our <a href="/privacy">Privacy Policy</a> for how we handle data.
        </p>

        <p style={{ marginTop: 28, fontSize: 13, color: "#6B7280" }}>Last updated: {today}</p>
      </div>
    </main>
  );
}
