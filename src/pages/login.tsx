"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import "primereact/resources/themes/lara-light-blue/theme.css"; // PrimeReact Theme
import "primereact/resources/primereact.min.css"; // PrimeReact Core CSS
import "primeflex/primeflex.css"; // PrimeFlex for styling

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      setMessage(data.message);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f4f4",
        padding: "1rem",
      }}
    >
    {/* <div className="p-d-flex p-jc-center p-ai-center" style={{ minHeight: "100vh", width: "100%" , background: "#f4f4f4" }}> */}
      <Card className="p-shadow-3" style={{ width: "400px", padding: "20px", textAlign: "center" }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="p-fluid">
          <div className="p-field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-inputtext-lg"
            />
          </div>
          <div className="p-field">
            <label htmlFor="password">Password</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              toggleMask
              required
              className="p-inputtext-lg"
            />
          </div>
          <Button label="Login" type="submit" className="p-button-primary p-button-lg p-mt-3" />
        </form>

        {message && <Message severity="error" text={message} className="p-mt-3" />}

        <p className="p-mt-3">
          <a href="/forgot-password" className="p-text-secondary">Forgot Password?</a>
        </p>
      </Card>
    </div>
  );
}
