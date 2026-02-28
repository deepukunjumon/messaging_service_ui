import { useMemo, useState, useEffect } from "react";
import { sendSms } from "../../services/sms.service";
import { theme } from "../../styles/theme";

const SendSmsPage = () => {
  // Theme state detection
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark")),
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const colors = {
    primary: theme.brand.primary.DEFAULT,
    primaryDark: theme.brand.primary.dark,
    text: isDark ? theme.brand.text.dark : theme.brand.text.primary,
    muted: theme.brand.text.muted,
    border: isDark ? theme.brand.border.dark : theme.brand.border.light,
    surface: isDark ? theme.brand.surface.dark : theme.brand.surface.light,
    background: isDark
      ? theme.brand.background.dark
      : theme.brand.background.light,
  };

  const InputClass =
    "w-full rounded-lg border px-4 py-2.5 text-sm transition-all outline-none focus:ring-2 " +
    "placeholder:text-gray-400 dark:placeholder:text-slate-400";

  const LabelClass = "text-sm font-medium";

  const [apiKey, setApiKey] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [content, setContent] = useState("");
  const [dltTemplateId, setDltTemplateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const recipients = useMemo(() => {
    return phoneNumbers
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
  }, [phoneNumbers]);

  const segments = useMemo(() => {
    if (!content) return 0;
    return Math.ceil(content.length / 160);
  }, [content]);

  const isFormValid = useMemo(() => {
    return (
      apiKey.trim() &&
      recipients.length &&
      content.trim() &&
      dltTemplateId.trim()
    );
  }, [apiKey, recipients.length, content, dltTemplateId]);

  const handleSend = async () => {
    if (!isFormValid || loading) return;
    setLoading(true);
    setStatus(null);
    try {
      await sendSms(
        {
          phoneNumbers: recipients,
          content: content.trim(),
          dlt_template_id: dltTemplateId.trim(),
        },
        apiKey.trim(),
      );
      setStatus({ type: "success", text: "SMS sent successfully." });
    } catch (e: any) {
      setStatus({
        type: "error",
        text: e?.response?.data?.message || "Failed to send SMS.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: isDark ? colors.text : colors.primary }}
        >
          Send SMS
        </h1>
        <p className="mt-1 text-sm" style={{ color: colors.muted }}>
          Send single or bulk SMS using your API key and DLT template.
        </p>
      </div>

      {/* Status */}
      {status && (
        <div
          className="rounded-lg border px-4 py-3 text-sm"
          style={{
            backgroundColor: status.type === "success" ? "#ecfdf5" : "#fff1f2",
            borderColor: status.type === "success" ? "#a7f3d0" : "#fecdd3",
            color: status.type === "success" ? "#065f46" : "#9f1239",
          }}
        >
          {status.text}
        </div>
      )}

      {/* Single Card */}
      <div
        className="rounded-2xl border shadow-sm"
        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      >
        {/* Card Header */}
        <div
          className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: colors.border }}
        >
          <div>
            <h2
              className="text-sm font-semibold"
              style={{ color: colors.text }}
            >
              SMS Composer
            </h2>
            <p className="mt-0.5 text-xs" style={{ color: colors.primary }}>
              Fill all mandatory fields to enable sending.
            </p>
          </div>

          {/* Desktop Send Button */}
          <button
            onClick={handleSend}
            disabled={!isFormValid || loading}
            className="hidden sm:inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition"
            style={{
              backgroundColor:
                !isFormValid || loading
                  ? isDark
                    ? "#334155"
                    : "#cbd5e1"
                  : colors.primary,
              cursor: !isFormValid || loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending..." : "Send SMS"}
          </button>
        </div>

        {/* Card Body */}
        <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-3">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* API Key */}
            <div>
              <label className={LabelClass} style={{ color: colors.text }}>
                API Key <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className={`${InputClass} mt-2`}
                style={
                  {
                    ...{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                    "--tw-ring-color": `${colors.primary}66`,
                  } as any
                }
                placeholder="Enter API Key"
              />
            </div>

            {/* Recipients */}
            <div>
              <div className="flex items-center justify-between">
                <label className={LabelClass} style={{ color: colors.text }}>
                  Recipients <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs" style={{ color: colors.muted }}>
                  {recipients.length} recipient(s)
                </span>
              </div>
              <textarea
                rows={3}
                value={phoneNumbers}
                onChange={(e) => setPhoneNumbers(e.target.value)}
                className={`${InputClass} mt-2 resize-none`}
                style={
                  {
                    ...{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                    "--tw-ring-color": `${colors.primary}66`,
                  } as any
                }
                placeholder="Comma separated mobile numbers"
              />
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center justify-between">
                <label className={LabelClass} style={{ color: colors.text }}>
                  Message <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs" style={{ color: colors.muted }}>
                  {content.length} chars • {segments} segment(s)
                </span>
              </div>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`${InputClass} mt-2 resize-none`}
                style={
                  {
                    ...{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                    "--tw-ring-color": `${colors.primary}66`,
                  } as any
                }
                placeholder="Type your message…"
              />
            </div>

            {/* DLT Template */}
            <div>
              <label className={LabelClass} style={{ color: colors.text }}>
                DLT Template ID <span className="text-rose-500">*</span>
              </label>
              <input
                value={dltTemplateId}
                onChange={(e) => setDltTemplateId(e.target.value)}
                className={`${InputClass} mt-2`}
                style={
                  {
                    ...{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                    "--tw-ring-color": `${colors.primary}66`,
                  } as any
                }
                placeholder="Enter DLT template id"
              />
            </div>
          </div>

          {/* Right: Summary */}
          <div className="space-y-4">
            <div
              className="rounded-xl border p-4"
              style={{
                backgroundColor: isDark ? "transparent" : "#ffffff",
                borderColor: colors.border,
              }}
            >
              <h3
                className="text-sm font-semibold"
                style={{ color: colors.text }}
              >
                Summary
              </h3>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Recipients", value: recipients.length },
                  { label: "Chars", value: content.length },
                  { label: "Segments", value: segments },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg p-3"
                    style={{ backgroundColor: isDark ? "#1e293b" : "#f8fafc" }}
                  >
                    <div className="text-xs" style={{ color: colors.muted }}>
                      {item.label}
                    </div>
                    <div
                      className="mt-1 text-lg font-semibold"
                      style={{ color: colors.text }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="mt-4 rounded-lg border p-3 text-xs"
                style={{
                  backgroundColor: isDark ? "#0b1219" : "#ffffff",
                  borderColor: colors.border,
                  color: colors.muted,
                }}
              >
                Tip: Use comma-separated numbers. Duplicates will be ignored
                automatically.
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Send Button */}
        <div
          className="sm:hidden border-t p-4"
          style={{ borderColor: colors.border }}
        >
          <button
            onClick={handleSend}
            disabled={!isFormValid || loading}
            className="w-full inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-sm transition"
            style={{
              backgroundColor:
                !isFormValid || loading
                  ? isDark
                    ? "#334155"
                    : "#cbd5e1"
                  : colors.primary,
            }}
          >
            {loading ? "Sending..." : "Send SMS"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendSmsPage;
