import ClientRedirect from "./Client";

export const metadata = { robots: { index: false, follow: false }, title: "Opening Swaply…" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main style={{fontFamily:"system-ui", padding:"24px"}}>
      <h1>Opening Swaply…</h1>
      <p>If nothing happens, <a href="cc.swaply.app://login-callback">tap here</a>.</p>
      <small style={{color:"#888"}}>Path: /auth/callback</small>
      <ClientRedirect />
    </main>
  );
}
