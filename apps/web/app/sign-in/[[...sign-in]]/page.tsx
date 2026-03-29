import { SignIn } from "@clerk/nextjs";
import { hasClerkPublishableKey } from "@/lib/clerk-config";

export default function SignInPage() {
  if (!hasClerkPublishableKey) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="panel w-full max-w-xl p-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-950">Clerk not configured</h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
            Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to enable sign in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <SignIn />
    </div>
  );
}
