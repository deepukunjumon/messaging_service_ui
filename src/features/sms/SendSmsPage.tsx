import { useMemo, useState } from "react";
import { sendSms } from "../../services/sms.service";

const InputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-gray-400 " +
  "focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand " +
  "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400";

const LabelClass = "text-sm font-medium text-slate-700 dark:text-slate-200";

const SendSmsPage = () => {
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

  const handleSend = async () => {
    setLoading(true);
    setStatus(null);

    try {
      await sendSms(
        {
          phoneNumbers: recipients,
          content,
          dlt_template_id: dltTemplateId,
        },
        apiKey,
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
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Send SMS</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Send single or bulk SMS using your API key and DLT template.
          </p>
        </div>

        <button
          onClick={handleSend}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white
                     shadow-sm hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? "Sending..." : "Send SMS"}
        </button>
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

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* API Key */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/40">
            <label className={LabelClass}>API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={`${InputClass} mt-2`}
              placeholder="Enter API Key"
            />
          </div>

          {/* Recipients */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <label className={LabelClass}>Recipients</label>
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
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <label className={LabelClass}>Message</label>
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
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/40">
            <label className={LabelClass}>DLT Template ID</label>
            <input
              value={dltTemplateId}
              onChange={(e) => setDltTemplateId(e.target.value)}
              className={`${InputClass} mt-2`}
              placeholder="Enter DLT template id"
            />
          </div>
        </div>

        {/* Right Summary */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/40">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Summary
            </h2>

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
              backend.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendSmsPage;
