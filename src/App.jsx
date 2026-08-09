import { useMemo, useState } from "react";

const fmt = (n) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const floorRound = (n) => Math.floor(n + 0.5);

function NumField({ label, value, onChange, prefix, placeholder = "0", grow = false }) {
  return (
    <label className={`block ${grow ? "flex-1 flex flex-col" : ""}`}>
      <span className="block font-display text-[15px] tracking-[0.14em] text-char-400 uppercase mb-2">
        {label}
      </span>
      <div
        className={`flex items-center bg-sand/40 border border-char-200 rounded-lg focus-within:border-rust-500 focus-within:bg-white transition-colors ${
          grow ? "flex-1 justify-center" : ""
        }`}
      >
        {prefix && (
          <span className="pl-4 font-mono text-xl text-char-400 select-none">{prefix}</span>
        )}
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent pr-4 pl-2.5 font-mono text-char-950 placeholder:text-char-400/40 outline-none ${
            grow ? "text-3xl py-2 text-center" : "text-2xl py-4"
          }`}
        />
      </div>
    </label>
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
      <div className="max-w-md mx-auto px-5 pt-8 pb-16">
        {/* Header */}
        <header className="mb-9">
          <p className="font-display text-[15px] tracking-[0.3em] text-rust-500 uppercase mb-2">
            Kickin&rsquo; Kajun
          </p>
          <h1 className="font-display text-[46px] leading-[1] tracking-tight text-char-950">
            Tip Calculator
          </h1>
          <p className="font-body text-[17px] text-char-400 mt-1.5">Kāneʻohe Location</p>
        </header>

        {/* Tips + staff, 3:2 split, both columns equal height */}
        <section className="grid grid-cols-5 gap-3 mb-9 items-stretch">
          <div className="col-span-3 flex flex-col">
            <p className="font-display text-[15px] tracking-[0.2em] text-char-400 uppercase mb-3">
              Tips Collected
            </p>
            <div className="space-y-3">
              <NumField label="Cash Tip" prefix="$" value={cashTip} onChange={setCashTip} />
              <NumField label="Service Charge" prefix="$" value={serviceCharge} onChange={setServiceCharge} />
              <NumField label="Credit Card Tip" prefix="$" value={ccTip} onChange={setCcTip} />
            </div>
          </div>

          <div className="col-span-2 flex flex-col">
            <p className="font-display text-[15px] tracking-[0.2em] text-char-400 uppercase mb-3">
              Staff
            </p>
            <div className="flex-1 flex flex-col gap-3">
              <NumField label="Servers" value={serverCount} onChange={setServerCount} placeholder="0" grow />
              <NumField label="Cooks" value={cookCount} onChange={setCookCount} placeholder="0" grow />
            </div>
          </div>
        </section>

        {/* Receipt / result ticket */}
        <section className="relative">
          <div className="ticket-frame">
            <div className="ticket-edge-top bg-sand text-char-950 pt-6 px-6 pb-8 rounded-b-md">
            <p className="font-mono text-[12px] tracking-[0.25em] uppercase text-char-400 text-center mb-5">
              — Payout —
            </p>

            <div className="space-y-4 font-mono text-[17px]">
              <div className="flex justify-between items-baseline text-char-400">
                <span>House Fee</span>
                <span>${fmt(result.houseFee)}</span>
              </div>

              <div className="border-t border-dashed border-char-200 my-3" />

              <div className="flex justify-between items-baseline">
                <span>
                  Server{result.servers > 1 ? "s" : ""}
                  {result.servers > 0 && (
                    <span className="text-char-400"> ×{result.servers}</span>
                  )}
                </span>
                <span className="text-2xl font-semibold text-rust-600">
                  {result.serverPer === null ? "—" : `$${fmt(result.serverPer)}`}
                  <span className="text-[13px] font-normal text-char-400"> each</span>
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <span>
                  Cook{result.cooks > 1 ? "s" : ""}
                  {result.cooks > 0 && (
                    <span className="text-char-400"> ×{result.cooks}</span>
                  )}
                </span>
                <span className="text-2xl font-semibold text-okra-600">
                  {result.cookPer === null ? "—" : `$${fmt(result.cookPer)}`}
                  <span className="text-[13px] font-normal text-char-400"> each</span>
                </span>
              </div>
            </div>
            </div>
          </div>
        </section>

        <button
          onClick={clearAll}
          disabled={!hasInput}
          className="w-full mt-6 py-3.5 rounded-lg border border-char-700 font-display tracking-[0.15em] text-[15px] uppercase text-char-950/60 disabled:opacity-30 active:bg-char-950/5 transition-colors"
        >
          Clear
        </button>

        <p className="text-center font-mono text-[13px] text-char-400/70 mt-8 leading-relaxed">
          House Fee = 10% of (Service Charge + Credit Card Tip)
          <br />
          Remaining split 80% Servers / 20% Cooks
        </p>
      </div>
    </div>
  );
}
