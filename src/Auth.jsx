import { useState } from "react";

function Auth({ onBack }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#25231f]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <button
          onClick={onBack}
          className="text-xl font-semibold tracking-tight"
        >
          roomora
        </button>

        <button
          onClick={onBack}
          className="text-sm text-[#777269] transition hover:text-[#25231f]"
        >
          Back to home
        </button>
      </header>

      {/* Main */}
      <main className="flex min-h-[calc(100vh-90px)] items-center justify-center px-5 py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)] md:grid-cols-2">

          {/* Left image section */}
          <div className="hidden min-h-[620px] md:block">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85"
              alt="Interior design"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right form section */}
          <div className="flex items-center justify-center px-7 py-12 md:px-12">
            <div className="w-full max-w-md">

              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#9b8b72]">
                Roomora
              </p>

              <h1 className="text-4xl font-semibold tracking-tight">
                {isLogin ? "Welcome back." : "Create your account."}
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#777269]">
                {isLogin
                  ? "Sign in to continue designing spaces your way."
                  : "Save your designs and continue creating beautiful spaces."}
              </p>

              {/* Form */}
              <form className="mt-9 space-y-5">
                {!isLogin && (
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Name
                    </label>

                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-[#ddd8cf] bg-[#faf9f6] px-4 py-3.5 text-sm outline-none transition focus:border-[#9b8b72]"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-[#ddd8cf] bg-[#faf9f6] px-4 py-3.5 text-sm outline-none transition focus:border-[#9b8b72]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-[#ddd8cf] bg-[#faf9f6] px-4 py-3.5 text-sm outline-none transition focus:border-[#9b8b72]"
                  />
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-[#9b8b72] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#25231f] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#3a3731]"
                >
                  {isLogin ? "Log in" : "Create account"}
                </button>
              </form>

              {/* Switch */}
              <div className="mt-7 text-center text-sm text-[#777269]">
                {isLogin ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="font-medium text-[#25231f] hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsLogin(true)}
                      className="font-medium text-[#25231f] hover:underline"
                    >
                      Log in
                    </button>
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#e7e2d9]" />
                <span className="text-xs text-[#aaa49a]">OR</span>
                <div className="h-px flex-1 bg-[#e7e2d9]" />
              </div>

              {/* Google */}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-full border border-[#ddd8cf] bg-white px-5 py-3.5 text-sm font-medium transition hover:bg-[#f7f5f0]"
              >
                <span className="text-base font-semibold">G</span>
                Continue with Google
              </button>

              <p className="mt-6 text-center text-xs leading-5 text-[#aaa49a]">
                By continuing, you agree to Roomora's terms and privacy
                policy.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Auth;