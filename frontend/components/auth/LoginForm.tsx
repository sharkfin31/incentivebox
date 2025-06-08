import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { theme } from "../../utils/theme";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { resetPassword } from "../../services/supabase";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const { signIn } = useAuth();
  const { addNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      addNotification("error", "Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { success, error } = await signIn(email, password);

      if (success) {
        addNotification("success", "Successfully logged in");
      } else {
        addNotification("error", error || "Failed to log in");
      }
    } catch (err) {
      addNotification("error", "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      addNotification("error", "Please enter your email address");
      return;
    }

    setIsResetting(true);

    try {
      const { success, error } = await resetPassword(email);

      if (success) {
        addNotification(
          "success",
          "Password reset email sent. Please check your inbox."
        );
      } else {
        addNotification(
          "error",
          error?.message || "Failed to send reset email"
        );
      }
    } catch (err) {
      addNotification("error", "An unexpected error occurred");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "24px",
        backgroundColor: "white",
        borderRadius: theme.borderRadius.xl,
        boxShadow: theme.shadows.md,
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: theme.colors.neutral[800],
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        Log In
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: "500",
              color: theme.colors.neutral[700],
            }}
          >
            Email
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: "100%",
                padding: "10px 12px 10px 36px",
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.neutral[300]}`,
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              required
            />
            <FiMail
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: theme.colors.neutral[500],
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: "500",
              color: theme.colors.neutral[700],
            }}
          >
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "10px 12px 10px 36px",
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.neutral[300]}`,
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              required
            />
            <FiLock
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: theme.colors.neutral[500],
              }}
            />
          </div>
        </div>

        <div
          style={{
            textAlign: "right",
            marginBottom: "24px",
          }}
        >
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={isResetting}
            style={{
              background: "none",
              border: "none",
              color: theme.colors.primary.main,
              fontSize: "14px",
              cursor: isResetting ? "not-allowed" : "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            {isResetting ? "Sending..." : "Forgot password?"}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: theme.colors.primary.main,
            color: "white",
            border: "none",
            borderRadius: theme.borderRadius.md,
            fontSize: "16px",
            fontWeight: "500",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            opacity: isSubmitting ? 0.7 : 1,
            transition: "all 0.2s ease",
          }}
        >
          {isSubmitting ? (
            "Logging in..."
          ) : (
            <>
              <FiLogIn /> Log In
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
