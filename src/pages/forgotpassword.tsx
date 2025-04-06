import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/forgotpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (data.resetToken) {
      setResetToken(data.resetToken);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <form onSubmit={handleForgotPassword}>
        <div className="mb-4">
          <Label htmlFor="email">Enter your email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Send Reset Link</Button>
      </form>
      {message && <p className="mt-4">{message}</p>}
      {resetToken && (
        <div className="mt-4">
          <p>Your reset token (demo only):</p>
          <code className="break-all">{resetToken}</code>
        </div>
      )}
    </div>
  );
}
