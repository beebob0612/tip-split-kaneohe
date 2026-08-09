import { useMemo, useState } from "react";

const fmt = (n) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const floorRound = (n) => Math.floor(n + 0.5);

function NumField({ label, value, onChange, prefix, placeholder = "0", grow = false }) {
  return (
    <label className={`block ${grow ? "flex-1 flex flex-col" : ""}`}>
      <span className="block font-display text-[17px] tracking-[0.1em] text-char-400 uppercase mb-1 leading-tight">
        {label}
      </span>
      <div
        className={`relative flex items-center bg-sand/40 border border-char-200 rounded-lg focus-within:border-rust-500 focus-within:bg-white transition-colors ${
          grow ? "flex-1" : ""
        }`}
      >
        {prefix && (
          <span className="absolute left-3.5 font-mono text-xl text-char-400 select-none pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent font-mono text-char-950 placeholder:text-char-400/40 outline-none text-center ${
            grow ? "text-3xl py-2" : "text-2xl py-4 px-9"
          }`}
        />
      </div>
    </label>
  );
}

function PayoutRow({ label, count, value }) {
  return (
    <div className="flex justify-between items-center bg-white border border-char-200 rounded-lg px-4 py-3.5">
      <span className="font-mono text-[17px] text-char-950">
        {label}
        {count > 0 && <span className="text-char-400"> ×{count}</span>}
      </span>
      <span className="font-mono text-[17px] font-semibold text-char-950">
        {value === null ? "—" : `$${fmt(value)}`}
      </span>
    </div>
  );
}

export default function App() {
  const [cashTip, setCashTip] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");
  const [ccTip, setCcTip] = useState("");
  const [serverCount, setServerCount] = useState("");
  const [cookCount, setCookCount] = useState("");

  const n = (v) => (v === "" ? 0 : parseFloat(v) || 0);

  const result = useMemo(() => {
    const cash = n(cashTip);
    const svc = n(serviceCharge);
    const cc = n(ccTip);
    const servers = n(serverCount);
    const cooks = n(cookCount);

    const houseFee = floorRound((svc + cc) * 0.1);
    const pool = svc + cc - houseFee + cash;
    const serverPer = servers > 0 ? floorRound((pool * 0.8) / servers) : null;
    const cookPer = cooks > 0 ? floorRound((pool * 0.2) / cooks) : null;

    return { houseFee, pool, serverPer, cookPer, servers, cooks };
  }, [cashTip, serviceCharge, ccTip, serverCount, cookCount]);

  const clearAll = () => {
    setCashTip("");
    setServiceCharge("");
    setCcTip("");
    setServerCount("");
    setCookCount("");
  };

  const hasInput = cashTip || serviceCharge || ccTip || serverCount || cookCount;

  return (
    <div className="min-h-screen bg-white text-char-950 font-body">
      <div className="max-w-md mx-auto px-5 pt-6 pb-12">
        {/* Header */}
        <header className="mb-6">
          <p className="font-display text-[15px] tracking-[0.3em] text-rust-500 uppercase mb-1.5">
            Kickin&rsquo; Kajun
          </p>
          <h1 className="font-display text-[46px] leading-[1] tracking-tight text-char-950">
            Tip Calculator
          </h1>
          <p className="font-body text-[17px] text-char-400 mt-1">Kāneʻohe Location</p>
        </header>

        {/* Inputs, 3:2 split, both columns equal height */}
        <section className="grid grid-cols-5 gap-3 mb-6 items-stretch">
          <div className="col-span-3 flex flex-col">
            <div className="space-y-3">
              <NumField label="Cash Tip" prefix="$" value={cashTip} onChange={setCashTip} />
              <NumField label="Service Charge" prefix="$" value={serviceCharge} onChange={setServiceCharge} />
              <NumField label="Credit Card Tip" prefix="$" value={ccTip} onChange={setCcTip} />
            </div>
          </div>

          <div className="col-span-2 flex flex-col">
            <div className="flex-1 flex flex-col gap-3">
              <NumField label="Servers" value={serverCount} onChange={setServerCount} placeholder="0" grow />
              <NumField label="Cooks" value={cookCount} onChange={setCookCount} placeholder="0" grow />
            </div>
          </div>
        </section>

        {/* Payout panel */}
        <section className="border border-char-200 rounded-xl bg-sand/50 p-4">
          <p className="font-display text-[15px] tracking-[0.25em] uppercase text-char-400 text-center mb-4">
            Payout
          </p>

          <div className="space-y-2.5">
            <PayoutRow label="House Fee" value={result.houseFee} />
            <PayoutRow label="Server" count={result.servers} value={result.serverPer} />
            <PayoutRow label="Cook" count={result.cooks} value={result.cookPer} />
          </div>
        </section>

        <button
          onClick={clearAll}
          disabled={!hasInput}
          className="w-full mt-5 py-3.5 rounded-lg border border-char-700 font-display tracking-[0.15em] text-[15px] uppercase text-char-950/60 disabled:opacity-30 active:bg-char-950/5 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
