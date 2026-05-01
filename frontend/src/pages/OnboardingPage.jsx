import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SECTORS } from '../constants/sectors';
import { RISK_LEVELS } from '../constants/riskLevels';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [sectors, setSectors] = useState([]);
  const [risk, setRisk] = useState('medium');
  const [minPrice, setMinPrice] = useState(25);
  const [maxPrice, setMaxPrice] = useState(400);
  const [dividend, setDividend] = useState(0.45);

  function toggleSector(s) {
    setSectors((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function next() {
    if (step === 1 && sectors.length === 0) return;
    if (step < 3) setStep(step + 1);
  }

  function back() {
    if (step > 1) setStep(step - 1);
  }

  function finish(e) {
    e.preventDefault();
    navigate('/dashboard');
  }

  const stepValid =
    step === 1 ? sectors.length >= 1 : step === 2 ? Boolean(risk) : true;

  return (
    <div className="min-h-screen bg-zinc-900 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <h1 className="text-center text-2xl font-semibold text-white">Tailor your feed</h1>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Step {step} of 3 — we use this to rank recommendations.
        </p>

        <div className="mt-8 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full ${
                s <= step ? 'bg-blue-500' : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>

        <form className="mt-10 space-y-8" onSubmit={finish}>
          {step === 1 && (
            <div>
              <h2 className="text-lg font-medium text-white">Sectors</h2>
              <p className="mt-1 text-sm text-zinc-400">Pick at least one sector.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {SECTORS.map((s) => {
                  const active = sectors.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSector(s)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                        active
                          ? 'border-blue-500 bg-blue-500/15 text-blue-400'
                          : 'border-zinc-600 bg-zinc-800 text-zinc-300 hover:border-zinc-500'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-medium text-white">Risk tolerance</h2>
              <p className="mt-1 text-sm text-zinc-400">How much volatility fits your plan?</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {RISK_LEVELS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRisk(r.id)}
                    className={`rounded-lg border p-4 text-left transition ${
                      risk === r.id
                        ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/40'
                        : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <p className="font-semibold text-white">{r.label}</p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">{r.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-white">Price range</h2>
                <p className="mt-1 text-sm text-zinc-400">Typical share prices you consider.</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="min-p" className="text-sm text-zinc-400">
                      Min ($)
                    </label>
                    <input
                      id="min-p"
                      type="number"
                      min={0}
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="max-p" className="text-sm text-zinc-400">
                      Max ($)
                    </label>
                    <input
                      id="max-p"
                      type="number"
                      min={0}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-300">Dividend preference</span>
                  <span className="font-medium text-blue-400">{dividend.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={dividend}
                  onChange={(e) => setDividend(Number(e.target.value))}
                  className="mt-3 w-full accent-blue-500"
                />
                <p className="mt-1 text-xs text-zinc-500">0 = growth focus, 1 = income focus</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={back}
                className="rounded-lg border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
              >
                Back
              </button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <button
                type="button"
                disabled={!stepValid}
                onClick={next}
                className="ml-auto rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-600"
              >
                Finish
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
