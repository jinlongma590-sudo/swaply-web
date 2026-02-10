// src/app/app/page.tsx
import Link from "next/link";

export default function AppPlaceholder() {
  return (
    <main className="min-h-[70vh] grid place-items-center bg-brand-50">
      <div className="mx-auto max-w-xl rounded-2xl bg-white border border-blue-100 px-8 py-10 text-center shadow-soft">
        <h1 className="text-3xl font-extrabold text-brand-900">Swaply Web App</h1>
        <p className="mt-3 text-brand-800/80">
          This is a placeholder for the Flutter Web build that will live at <code>/app/</code>.
        </p>
        <div className="mt-6">
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
