// src/pages/sms/SendSmsPage.tsx
import { useMemo, useState } from "react";
import { sendSms } from "../../services/sms.service";

const InputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-gray-400 " +
  "focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand " +
  "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400";

const LabelClass = "text-sm font-medium text-slate-700 dark:text-slate-200";

type StatusState =
  | { type: "success"; text: string }
  | { type: "error"; text: string }
  | null;

const SendSmsPage = () => {
  const [apiKey, setApiKey] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [content, setContent] = useState("");
  const [dltTemplateId, setDltTemplateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);

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
      apiKey.trim().length > 0 &&
      recipients.length > 0 &&
      content.trim().length > 0 &&
      dltTemplateId.trim().length > 0
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
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Failed to send SMS. Please check API Key / inputs.";
      setStatus({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-teal-500">
          Send SMS
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Send single or bulk SMS using your API key and DLT template.
        </p>
      </div>

      {/* Status */}
      {status && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-200"
              : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-200"
          }`}
        >
          {status.text}
        </div>
      )}

      {/* Single Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/40">
        {/* Card Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              SMS Composer
            </h2>
            <p className="mt-0.5 text-xs text-blue-500 dark:text-slate-400">
              Fill all mandatory fields to enable sending.
            </p>
          </div>

          {/* Desktop Send Button */}
          <button
            onClick={handleSend}
            disabled={!isFormValid || loading}
            className={`hidden sm:inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition
              ${
                !isFormValid || loading
                  ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
                  : "bg-brand hover:bg-brand-dark"
              }`}
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
              <label className={LabelClass}>
                API Key <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className={`${InputClass} mt-2`}
                placeholder="Enter API Key"
              />
            </div>

            {/* Recipients */}
            <div>
              <div className="flex items-center justify-between">
                <label className={LabelClass}>
                  Recipients <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {recipients.length} recipient(s)
                </span>
              </div>

              <textarea
                rows={3}
                value={phoneNumbers}
                onChange={(e) => setPhoneNumbers(e.target.value)}
                className={`${InputClass} mt-2 resize-none`}
                placeholder="Comma separated mobile numbers (e.g., 9876543210, 9123456789)"
              />
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center justify-between">
                <label className={LabelClass}>
                  Message <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {content.length} chars • {segments} segment(s)
                </span>
              </div>

              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`${InputClass} mt-2 resize-none`}
                placeholder="Type your message…"
              />
            </div>

            {/* DLT Template */}
            <div>
              <label className={LabelClass}>
                DLT Template ID <span className="text-rose-500">*</span>
              </label>
              <input
                value={dltTemplateId}
                onChange={(e) => setDltTemplateId(e.target.value)}
                className={`${InputClass} mt-2`}
                placeholder="Enter DLT template id"
              />
            </div>
          </div>

          {/* Right: Summary */}
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/40">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Summary
              </h3>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800/60">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Recipients
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {recipients.length}
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800/60">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Chars
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {content.length}
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800/60">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Segments
                  </div>
                  <div className="mt-1 text-lg font-semibold">{segments}</div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Tip: Use comma-separated numbers. Duplicates will be ignored by
                automatically.
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Send Button at Bottom */}
        <div className="sm:hidden border-t border-gray-200 dark:border-slate-700 p-4">
          <button
            onClick={handleSend}
            disabled={!isFormValid || loading}
            className={`w-full inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-sm transition
              ${
                !isFormValid || loading
                  ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
                  : "bg-brand hover:bg-brand-dark"
              }`}
          >
            {loading ? "Sending..." : "Send SMS"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendSmsPage;
