import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "./firebase";

function Auth({ onBack }) {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    clearMessages();
    setLoading(true);

    try {
      const cleanEmail = email.trim();

      if (!cleanEmail || !password) {
        throw new Error(
          "Please enter your email and password."
        );
      }

      if (!isLogin && !name.trim()) {
        throw new Error("Please enter your name.");
      }

      if (isLogin) {
        // -------------------------
        // LOGIN
        // -------------------------

        await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

        setSuccess("Welcome back to Roomora!");

        setTimeout(() => {
          onBack();
        }, 700);
      } else {
        // -------------------------
        // SIGN UP
        // -------------------------

        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            cleanEmail,
            password
          );

        const user = userCredential.user;

        // Save name in Firebase Authentication
        await updateProfile(user, {
          displayName: name.trim(),
        });

        // Save user profile in Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: name.trim(),
          email: user.email,
          createdAt: serverTimestamp(),
        });

        setSuccess(
          "Your Roomora account has been created!"
        );

        setTimeout(() => {
          onBack();
        }, 700);
      }
    } catch (error) {
      console.error("AUTH ERROR:", error);

      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    clearMessages();
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(
        auth,
        provider
      );

      const user = result.user;

      // Create/update Firestore user profile
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName || "Roomora User",
          email: user.email,
          photoURL: user.photoURL || "",
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      setSuccess("Signed in with Google!");

      setTimeout(() => {
        onBack();
      }, 700);
    } catch (error) {
      console.error(
        "GOOGLE AUTH ERROR:",
        error
      );

      setError(getAuthErrorMessage(error));
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleForgotPassword() {
    clearMessages();

    if (!email.trim()) {
      setError(
        "Enter your email address first."
      );
      return;
    }

    try {
      await sendPasswordResetEmail(
        auth,
        email.trim()
      );

      setSuccess(
        "Password reset email sent. Check your inbox."
      );
    } catch (error) {
      console.error(
        "PASSWORD RESET ERROR:",
        error
      );

      setError(getAuthErrorMessage(error));
    }
  }

  function switchMode() {
    setIsLogin(!isLogin);
    setName("");
    setPassword("");
    clearMessages();
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#25231f]">
      {/* Header */}

      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <button
          onClick={onBack}
          className="text-xl font-semibold tracking-tight transition hover:opacity-70"
        >
          roomora<span className="text-[#9b8b72]">.</span>
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
                {isLogin
                  ? "Welcome back."
                  : "Create your account."}
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#777269]">
                {isLogin
                  ? "Sign in to continue designing spaces your way."
                  : "Save your designs and continue creating beautiful spaces."}
              </p>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="mt-9 space-y-5"
              >
                {!isLogin && (
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
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
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-[#ddd8cf] bg-[#faf9f6] px-4 py-3.5 text-sm outline-none transition focus:border-[#9b8b72]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete={
                      isLogin
                        ? "current-password"
                        : "new-password"
                    }
                    className="w-full rounded-2xl border border-[#ddd8cf] bg-[#faf9f6] px-4 py-3.5 text-sm outline-none transition focus:border-[#9b8b72]"
                  />
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-[#9b8b72] transition hover:text-[#25231f] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Error */}

                {error && (
                  <div className="rounded-2xl bg-[#fff2f0] px-4 py-3 text-sm leading-6 text-red-600">
                    {error}
                  </div>
                )}

                {/* Success */}

                {success && (
                  <div className="rounded-2xl bg-[#f0f8f1] px-4 py-3 text-sm leading-6 text-green-700">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full rounded-full bg-[#25231f] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#3a3731] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Please wait..."
                    : isLogin
                      ? "Log in"
                      : "Create account"}
                </button>
              </form>

              {/* Switch */}

              <div className="mt-7 text-center text-sm text-[#777269]">
                {isLogin ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={switchMode}
                      className="font-medium text-[#25231f] hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={switchMode}
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

                <span className="text-xs text-[#aaa49a]">
                  OR
                </span>

                <div className="h-px flex-1 bg-[#e7e2d9]" />
              </div>

              {/* Google */}

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="flex w-full items-center justify-center gap-3 rounded-full border border-[#ddd8cf] bg-white px-5 py-3.5 text-sm font-medium transition hover:bg-[#f7f5f0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="text-base font-semibold">
                  G
                </span>

                {googleLoading
                  ? "Connecting..."
                  : "Continue with Google"}
              </button>

              <p className="mt-6 text-center text-xs leading-5 text-[#aaa49a]">
                By continuing, you agree to Roomora's terms
                and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// -------------------------
// FIREBASE ERROR MESSAGES
// -------------------------

function getAuthErrorMessage(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "Password should be at least 6 characters.";

    case "auth/invalid-credential":
      return "Incorrect email or password.";

    case "auth/user-not-found":
      return "No account was found with this email.";

    case "auth/wrong-password":
      return "Incorrect email or password.";

    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";

    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in popup.";

    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase Authentication.";

    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";

    default:
      return (
        error.message ||
        "Something went wrong. Please try again."
      );
  }
}

export default Auth;