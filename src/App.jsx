import { useMemo, useState } from "react";

const fmt = (n) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const floorRound = (n) => Math.floor(n + 0.5);

function NumField({ label, value, onChange, prefix, placeholder = "0" }) {
  return (
    <label className="block">
      <span className="block font-display text-[13px] tracking-[0.18em] text-sand/50 uppercase mb-1.5">
        {label}
      </span>
      <div className="flex items-center bg-char-800 border border-char-700 rounded-lg focus-within:border-rust-500 transition-colors">
        {prefix && (
          <span className="pl-3.5 font-mono text-lg text-sand/40 select-none">{prefix}</span>
        )}
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3.5 pr-3.5 pl-2 font-mono text-xl text-sand placeholder:text-sand/25 outline-none"
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
    <div className="min-h-screen bg-char-950 text-sand font-body">
      <div className="max-w-md mx-auto px-5 pt-8 pb-16">
        {/* Header */}
        <header className="mb-7">
          <p className="font-display text-[13px] tracking-[0.3em] text-rust-500 uppercase mb-1">
            Kickin&rsquo; Kajun · Kāneʻohe
          </p>
          <h1 className="font-display text-[40px] leading-[0.95] tracking-tight text-sand uppercase">
            Tip Split
          </h1>
        </header>

        {/* Tip inputs */}
        <section className="grid grid-cols-3 gap-2.5 mb-3">
          <NumField label="Cash" prefix="$" value={cashTip} onChange={setCashTip} />
          <NumField label="Svc Chg" prefix="$" value={serviceCharge} onChange={setServiceCharge} />
          <NumField label="CC Tip" prefix="$" value={ccTip} onChange={setCcTip} />
        </section>

        {/* Headcount inputs */}
        <section className="grid grid-cols-2 gap-2.5 mb-8">
          <NumField label="Servers" value={serverCount} onChange={setServerCount} placeholder="0" />
          <NumField label="Cooks" value={cookCount} onChange={setCookCount} placeholder="0" />
        </section>

        {/* Receipt / result ticket */}
        <section className="relative">
          <div className="ticket-edge-top bg-sand text-char-950 pt-5 px-6 pb-7 rounded-b-md shadow-[0_20px_40px_-16px_rgba(0,0,0,0.6)]">
            <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-char-950/50 text-center mb-4">
              — Payout —
            </p>

            <div className="space-y-3 font-mono text-[15px]">
              <div className="flex justify-between items-baseline text-char-950/60">
                <span>House fee</span>
                <span>${fmt(result.houseFee)}</span>
              </div>

              <div className="border-t border-dashed border-char-950/20 my-3" />

              <div className="flex justify-between items-baseline">
                <span>
                  Server{result.servers > 1 ? "s" : ""}
                  {result.servers > 0 && (
                    <span className="text-char-950/45"> ×{result.servers}</span>
                  )}
                </span>
                <span className="text-lg font-semibold text-rust-600">
                  {result.serverPer === null ? "—" : `$${fmt(result.serverPer)}`}
                  <span className="text-[11px] font-normal text-char-950/45"> /ea</span>
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <span>
                  Cook{result.cooks > 1 ? "s" : ""}
                  {result.cooks > 0 && (
                    <span className="text-char-950/45"> ×{result.cooks}</span>
                  )}
                </span>
                <span className="text-lg font-semibold text-okra-400">
                  {result.cookPer === null ? "—" : `$${fmt(result.cookPer)}`}
                  <span className="text-[11px] font-normal text-char-950/45"> /ea</span>
                </span>
              </div>
            </div>

            <div className="border-t border-dashed border-char-950/20 mt-4 pt-3">
              <div className="flex justify-between items-baseline font-mono text-[12px] text-char-950/45">
                <span>Distributed pool</span>
                <span>${fmt(result.pool)}</span>
              </div>
            </div>
          </div>
        </section>

        <button
          onClick={clearAll}
          disabled={!hasInput}
          className="w-full mt-6 py-3 rounded-lg border border-char-700 font-display tracking-[0.15em] text-[13px] uppercase text-sand/50 disabled:opacity-30 active:bg-char-800 transition-colors"
        >
          Clear
        </button>

        <p className="text-center font-mono text-[11px] text-sand/25 mt-8">
          House fee 10% of (Svc Chg + CC Tip) · Pool split 80 / 20
        </p>
      </div>
    </div>
  );
}
