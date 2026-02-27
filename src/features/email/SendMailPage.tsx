import { useMemo, useState, useRef } from "react";
import { sendMail } from "../../services/mail.service";
import { Chip } from "../../components/Chip";

const InputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-gray-400 " +
  "focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 " +
  "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 transition-all";

const LabelClass = "text-sm font-medium text-slate-700 dark:text-slate-200";

type StatusState = { type: "success" | "danger"; text: string } | null;
type Attachment = { name: string; content: string };

const SendMailPage = () => {
  const [apiKey, setApiKey] = useState("");
  const [toStr, setToStr] = useState("");
  const [ccStr, setCcStr] = useState("");
  const [bccStr, setBccStr] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const strToEmails = (str: string) =>
    str
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e.length > 0 && e.includes("@"));

  const toList = useMemo(() => strToEmails(toStr), [toStr]);
  const ccList = useMemo(() => strToEmails(ccStr), [ccStr]);
  const bccList = useMemo(() => strToEmails(bccStr), [bccStr]);

  const isFormValid = useMemo(
    () =>
      apiKey.trim().length > 0 &&
      toList.length > 0 &&
      subject.trim().length > 0 &&
      content.trim().length > 0,
    [apiKey, toList, subject, content],
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          attachments: attachments,
        },
        apiKey.trim(),
      );

      setStatus({ type: "success", text: "Email dispatched successfully." });
      setContent("");
      setSubject("");
      setToStr("");
      setCcStr("");
      setBccStr("");
      setAttachments([]);
    } catch (e: any) {
      setStatus({
        type: "danger",
        text: e?.response?.data?.message || "Failed to send Email.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-teal-500">
            Send Email
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Compose and send high-priority emails via Netcore API.
          </p>
        </div>
        {status && (
          <Chip label={status.text} color={status.type} variant="soft" />
        )}
      </div>

      {/* Main Composer Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/40 overflow-hidden">
        {/* Card Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Email Composer
            </h2>
            <p className="mt-0.5 text-xs text-blue-500 dark:text-slate-400">
              Review recipients and content before dispatching.
            </p>
          </div>

          <button
            onClick={handleSend}
            disabled={!isFormValid || loading}
            className={`hidden sm:inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95
              ${
                !isFormValid || loading
                  ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700 shadow-teal-500/20"
              }
            `}
          >
            {loading ? "Sending..." : "Dispatch Email"}
          </button>
        </div>

        {/* Card Body */}
        <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className={LabelClass}>
                API Key <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                className={`${InputClass} mt-2`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API Key"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={LabelClass}>
                  To (Recipients) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  className={`${InputClass} mt-2 resize-none`}
                  value={toStr}
                  onChange={(e) => setToStr(e.target.value)}
                  placeholder="john@example.com, jane@example.com"
                />
              </div>
              <div>
                <label className={LabelClass}>CC</label>
                <input
                  type="text"
                  className={`${InputClass} mt-2`}
                  value={ccStr}
                  onChange={(e) => setCcStr(e.target.value)}
                  placeholder="cc@example.com"
                />
              </div>
              <div>
                <label className={LabelClass}>BCC</label>
                <input
                  type="text"
                  className={`${InputClass} mt-2`}
                  value={bccStr}
                  onChange={(e) => setBccStr(e.target.value)}
                  placeholder="bcc@example.com"
                />
              </div>
            </div>

            <div>
              <label className={LabelClass}>
                Subject <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                className={`${InputClass} mt-2`}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Message Subject"
              />
            </div>

            <div>
              <label className={LabelClass}>
                Body (HTML Supported) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={6}
                className={`${InputClass} mt-2 resize-none font-mono`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Compose your email..."
              />
            </div>

            {/* Attachments Section */}
            <div>
              <label className={LabelClass}>Attachments</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {attachments.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 rounded-full text-xs border border-teal-100 dark:border-teal-900/30"
                  >
                    <span className="truncate max-w-[120px]">{file.name}</span>
                    <button
                      onClick={() =>
                        setAttachments((prev) =>
                          prev.filter((_, idx) => idx !== i),
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
                  className="px-4 py-1.5 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-full text-xs text-slate-500 hover:border-teal-500 hover:text-teal-500 transition-all"
                >
                  + Add File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
              </div>
            </div>
          </div>

          {/* Right: Sidebar Summary */}
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/40">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email Summary
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800/60 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Targets
                  </div>
                  <div className="mt-1 text-xl font-bold text-teal-600">
                    {toList.length}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800/60 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Files
                  </div>
                  <div className="mt-1 text-xl font-bold text-teal-600">
                    {attachments.length}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>CC/BCC:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {ccList.length + bccList.length}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Content Size:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {Math.round((content.length / 1024) * 10) / 10}KB
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-teal-100 bg-teal-50/30 p-3 text-[11px] text-teal-800 dark:border-teal-900/30 dark:bg-teal-900/10 dark:text-teal-400">
                <strong>Pro-tip:</strong> Use standard HTML tags in the body for
                rich-text formatting.
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Send Button */}
        <div className="sm:hidden border-t border-gray-200 dark:border-slate-700 p-4">
          <button
            onClick={handleSend}
            disabled={!isFormValid || loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all
              ${!isFormValid || loading ? "bg-slate-300" : "bg-teal-600 shadow-lg shadow-teal-500/20"}`}
          >
            {loading ? "Sending..." : "Dispatch Email"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMailPage;
