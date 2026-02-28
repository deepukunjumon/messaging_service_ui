import { useMemo, useState, useEffect, useRef } from "react";
import { sendMail } from "../../services/mail.service";
import { theme } from "../../styles/theme";

const SendMailPage = () => {
  /* -------------------- Theme Detection -------------------- */
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
    "w-full rounded-lg border px-4 py-2.5 text-sm transition-all outline-none focus:ring-2 placeholder:text-gray-400 dark:placeholder:text-slate-400";
  const LabelClass = "text-sm font-medium";

  /* -------------------- State -------------------- */
  const [apiKey, setApiKey] = useState("");
  const [toStr, setToStr] = useState("");
  const [ccStr, setCcStr] = useState("");
  const [bccStr, setBccStr] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<
    { name: string; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -------------------- Helpers -------------------- */
  const strToEmails = (str: string) =>
    str
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e.length > 0 && e.includes("@"));

  const toList = useMemo(() => strToEmails(toStr), [toStr]);
  const ccList = useMemo(() => strToEmails(ccStr), [ccStr]);
  const bccList = useMemo(() => strToEmails(bccStr), [bccStr]);

  const totalRecipients = toList.length + ccList.length + bccList.length;
  const contentSizeKB = useMemo(
    () => Math.round((content.length / 1024) * 10) / 10,
    [content],
  );
  const isFormValid = useMemo(
    () => apiKey.trim() && toList.length && subject.trim() && content.trim(),
    [apiKey, toList.length, subject, content],
  );

  /* -------------------- File Upload -------------------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        setAttachments((prev) => [
          ...prev,
          { name: file.name, content: base64 },
        ]);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* -------------------- Send -------------------- */
  const handleSend = async () => {
    if (!isFormValid || loading) return;
    setLoading(true);
    setStatus(null);

    try {
      await sendMail(
        {
          to: toList,
          cc: ccList,
          bcc: bccList,
          subject: subject.trim(),
          body: content.trim(),
          attachments,
        },
        apiKey.trim(),
      );

      setStatus({ type: "success", text: "Email sent successfully." });
      setApiKey("");
      setToStr("");
      setCcStr("");
      setBccStr("");
      setSubject("");
      setContent("");
      setAttachments([]);
    } catch (e: any) {
      setStatus({
        type: "error",
        text: e?.response?.data?.message || "Failed to send Email.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: isDark ? colors.text : colors.primary }}
        >
          Send Email
        </h1>
        <p className="mt-1 text-sm" style={{ color: colors.muted }}>
          Send transactional or bulk emails using your API key.
        </p>
      </div>

      {/* Status */}
      {status && (
        <div
          className="rounded-lg border px-4 py-3 text-sm"
          style={{
            backgroundColor:
              status.type === "success" ? colors.surface : colors.surface,
            borderColor:
              status.type === "success" ? colors.primary : colors.primaryDark,
            color: colors.text,
          }}
        >
          {status.text}
        </div>
      )}

      {/* Main Card */}
      <div
        className="rounded-2xl border shadow-sm"
        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      >
        {/* Header */}
        <div
          className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: colors.border }}
        >
          <div>
            <h2
              className="text-sm font-semibold"
              style={{ color: colors.text }}
            >
              Email Composer
            </h2>
            <p className="mt-0.5 text-xs" style={{ color: colors.primary }}>
              Fill all mandatory fields to enable sending.
            </p>
          </div>

          {/* Desktop Send */}
          <button
            onClick={handleSend}
            disabled={!isFormValid || loading}
            className="hidden sm:inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition"
            style={{
              backgroundColor:
                !isFormValid || loading ? colors.border : colors.primary,
              cursor: !isFormValid || loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-3">
          {/* Left */}
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
                className={InputClass + " mt-2"}
                style={
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                    "--tw-ring-color": `${colors.primary}66`,
                  } as any
                }
                placeholder="Enter API Key"
              />
            </div>

            {/* Recipients */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={LabelClass} style={{ color: colors.text }}>
                  To (Recipients) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={toStr}
                  onChange={(e) => setToStr(e.target.value)}
                  placeholder="john@example.com, jane@example.com"
                  className={InputClass + " mt-2 resize-none"}
                  style={
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                      "--tw-ring-color": `${colors.primary}66`,
                    } as any
                  }
                />
              </div>

              <div>
                <label className={LabelClass} style={{ color: colors.text }}>
                  CC
                </label>
                <input
                  type="text"
                  value={ccStr}
                  onChange={(e) => setCcStr(e.target.value)}
                  placeholder="cc@example.com"
                  className={InputClass + " mt-2"}
                  style={
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                      "--tw-ring-color": `${colors.primary}66`,
                    } as any
                  }
                />
              </div>

              <div>
                <label className={LabelClass} style={{ color: colors.text }}>
                  BCC
                </label>
                <input
                  type="text"
                  value={bccStr}
                  onChange={(e) => setBccStr(e.target.value)}
                  placeholder="bcc@example.com"
                  className={InputClass + " mt-2"}
                  style={
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                      "--tw-ring-color": `${colors.primary}66`,
                    } as any
                  }
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className={LabelClass} style={{ color: colors.text }}>
                Subject <span className="text-rose-500">*</span>
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={InputClass + " mt-2"}
                style={
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                    "--tw-ring-color": `${colors.primary}66`,
                  } as any
                }
              />
            </div>

            {/* Body */}
            <div>
              <label className={LabelClass} style={{ color: colors.text }}>
                Body <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={InputClass + " mt-2 resize-none"}
                style={
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                    "--tw-ring-color": `${colors.primary}66`,
                  } as any
                }
              />
            </div>

            {/* Attachments */}
            <div>
              <label className={LabelClass} style={{ color: colors.text }}>
                Attachments
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1 rounded-full text-xs border"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                  >
                    <span className="truncate max-w-[120px]">{file.name}</span>
                    <button
                      onClick={() =>
                        setAttachments((prev) =>
                          prev.filter((_, i) => i !== idx),
                        )
                      }
                      className="hover:text-rose-500 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-1.5 border-2 border-dashed rounded-full text-xs transition-all"
                  style={{
                    borderColor: colors.border,
                    color: colors.muted,
                  }}
                >
                  + Add File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            <div
              className="rounded-xl border p-4"
              style={{
                backgroundColor: colors.surface,
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
                  { label: "Recipients", value: totalRecipients },
                  { label: "Attachments", value: attachments.length },
                  { label: "Size (KB)", value: contentSizeKB },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg p-3"
                    style={{ backgroundColor: colors.surface }}
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
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.muted,
                }}
              >
                Tip: Use comma-separated email addresses.
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
                !isFormValid || loading ? colors.border : colors.primary,
            }}
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMailPage;
