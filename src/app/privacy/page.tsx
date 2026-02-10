// src/app/privacy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – Swaply",
  description: "How Swaply collects, uses, shares, keeps, and deletes data.",
};

export default function PrivacyPage() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 prose prose-zinc">
      <h1>Privacy Policy</h1>
      <p>
        This policy explains what data Swaply collects, how we use it, who we share it with,
        how long we keep it, and how you can delete your account. It applies to our mobile apps
        and to <strong>swaply.cc</strong>.
      </p>

      <h2>Data we collect</h2>
      <ul>
        <li>
          <strong>Account information</strong>: Email and/or phone number for authentication and
          account security. If you choose Google, Facebook, or Apple sign-in, we may receive basic
          profile info (e.g., name, email) from that provider.
        </li>
        <li>
          <strong>User content</strong>: Listings, messages, images, and other information you submit.
        </li>
        <li>
          <strong>Identifiers & device info</strong>: App/device identifiers, basic device and
          network information, and logs used for security and anti-abuse.
        </li>
        <li>
          <strong>Usage data</strong>: Interactions with features (e.g., listing views) to improve
          performance, reliability, and user experience.
        </li>
        <li>
          <strong>Approximate location (optional)</strong>: If you add a city/region to your profile
          or listings. We do not require precise GPS location.
        </li>
      </ul>

      <h2>How we use data</h2>
      <ul>
        <li>Authenticate users and operate core features of the service.</li>
        <li>Detect, prevent, and investigate fraud, spam, and abuse.</li>
        <li>Maintain security, troubleshoot issues, and improve performance and quality.</li>
        <li>Provide support and communicate about service updates when necessary.</li>
        <li>Comply with legal obligations and enforce our terms.</li>
      </ul>

      <h2>Sharing & disclosure</h2>
      <p>
        We do <strong>not sell</strong> your personal data and do not enable cross-site tracking or
        targeted advertising. We may share limited data with service providers strictly to operate
        the service (e.g., hosting, storage, authentication). When you choose to log in with
        Google, Facebook, or Apple, those providers process your data under their own privacy
        policies. We may disclose information if required by law or to protect users and the
        integrity of the service.
      </p>

      <h2>Data retention & deletion</h2>
      <p>
        We keep personal data only as long as necessary for the purposes above and to meet legal
        requirements. You can permanently delete your account in the app:
        <br />
        <strong>Profile → Account → Delete My Account</strong>. Details of what is removed and the
        expected timing are described on our{" "}
        <a href="/delete-account">Delete Account</a> page.
      </p>
      <p>
        After a deletion request, account access is removed immediately and related data is deleted
        or anonymized promptly. Residual copies in system backups may persist for up to 30 days.
        Aggregated or anonymized records that no longer identify you may be retained for security
        and service integrity.
      </p>

      <h2>Security</h2>
      <p>
        We use reasonable technical and organizational measures (including encryption in transit and
        access controls) to protect your data. No method of transmission or storage is 100% secure,
        but we work to safeguard your information.
      </p>

      <h2>International processing</h2>
      <p>
        Our service providers (e.g., hosting, authentication) may process data on servers outside
        your country/region solely to deliver the service, subject to their security and compliance
        practices.
      </p>

      <h2>Children</h2>
      <p>
        Swaply is not directed to children under 13, and we do not knowingly collect their personal
        information.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>Update your profile information in the app at any time.</li>
        <li>
          Delete your account in the app via <em>Profile → Account → Delete My Account</em>, or email
          us from your registered address if you cannot access the app.
        </li>
      </ul>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. We will post the new version here and update the
        effective date below.
      </p>

      <h2>Contact</h2>
      <p>
        Email: <a href="mailto:support@swaply.cc">support@swaply.cc</a>
      </p>

      <p className="text-sm text-zinc-500">Effective date: {today}</p>
    </main>
  );
}
