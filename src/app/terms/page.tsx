import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service – Swaply",
  description: "Terms of Service for Swaply - Peer-to-peer marketplace platform in Zimbabwe.",
};

export default function TermsPage() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 prose prose-zinc">
      <h1>Terms of Service</h1>
      <p className="text-zinc-600">
        Last Updated: {today}
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using Swaply ("Service"), you agree to be bound by these Terms of Service.
        If you do not agree, you may not use the Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        Swaply is a peer-to-peer marketplace platform that enables users to list, browse, and trade
        second-hand goods and services in Zimbabwe.
      </p>

      <h2>3. User Accounts</h2>
      <ul>
        <li>You must provide accurate information when creating an account</li>
        <li>You are responsible for maintaining the confidentiality of your account credentials</li>
        <li>You must be at least 13 years old to use the Service</li>
        <li>You may not create multiple accounts for fraudulent purposes</li>
      </ul>

      <h2>4. User Responsibilities</h2>
      <ul>
        <li>List items accurately with clear descriptions and images</li>
        <li>Comply with all applicable local laws and regulations</li>
        <li>Do not list prohibited items (weapons, illegal substances, stolen goods, etc.)</li>
        <li>Treat other users with respect in communications</li>
        <li>Do not engage in fraudulent, misleading, or deceptive practices</li>
      </ul>

      <h2>5. Transactions and Payments</h2>
      <ul>
        <li>Swaply facilitates connections but is not a party to transactions</li>
        <li>Users are responsible for negotiating terms, inspections, and payments</li>
        <li>Swaply does not handle payments directly; users arrange payment methods</li>
        <li>Disputes between users should be resolved directly between parties</li>
      </ul>

      <h2>6. Intellectual Property</h2>
      <ul>
        <li>You retain ownership of content you create (listings, messages, images)</li>
        <li>By posting content, you grant Swaply a license to display and distribute it</li>
        <li>Swaply trademarks, logos, and service marks belong to Swaply</li>
      </ul>

      <h2>7. Prohibited Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Violate any laws or third-party rights</li>
        <li>Post false, misleading, or deceptive content</li>
        <li>Harass, threaten, or intimidate other users</li>
        <li>Use the Service for unauthorized commercial purposes</li>
        <li>Attempt to circumvent security measures</li>
      </ul>

      <h2>8. Termination</h2>
      <p>
        Swaply may suspend or terminate your account if you violate these Terms. You may delete your
        account at any time via <strong>Profile → Account → Delete My Account</strong>.
      </p>

      <h2>9. Disclaimer of Warranties</h2>
      <p>
        The Service is provided "as is" without warranties of any kind. Swaply does not guarantee the
        quality, safety, or legality of listed items.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Swaply shall not be liable for any indirect,
        incidental, or consequential damages arising from your use of the Service.
      </p>

      <h2>11. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use after changes constitutes acceptance.
      </p>

      <h2>12. Governing Law</h2>
      <p>
        These Terms shall be governed by the laws of Zimbabwe.
      </p>

      <h2>13. Contact Information</h2>
      <p>
        For questions about these Terms, contact:{" "}
        <a href="mailto:swaply@swaply.cc">swaply@swaply.cc</a>
      </p>
    </main>
  );
}