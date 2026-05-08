import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SECTORS } from '../constants/sectors';
import {
  GROWTH_PROFILE
} from '../constants/ProfilePreferences';
import { RISK_LEVELS } from '../constants/riskLevels';
import { INVESTMENT_HORIZON } from '../constants/investmentHorizon';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [sectors, setSectors] = useState([]);
  const [risk, setRisk] = useState('');
  const [capPreference, setCapPreference] = useState('');
  const [investmentHorizon, setInvestmentHorizon] = useState('');

  function toggleSector(s) {
    setSectors((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function next() {
    if (step === 1 && sectors.length === 0) return;
    if (step === 2 && !risk) return;
    if (step === 3 && !capPreference) return;
    if (step < 4) setStep(step + 1);
  }

  function back() {
    if (step > 1) setStep(step - 1);
  }

  function finish(e) {
    e.preventDefault();
    if (step === 4 && investmentHorizon) {
      navigate('/dashboard');
    }
  }

  const stepValid =
    step === 1
      ? sectors.length >= 1
      : step === 2
        ? Boolean(risk)
        : step === 3
          ? Boolean(capPreference)
          : step === 4
            ? Boolean(investmentHorizon)
            : true;

  return (
    <div className="min-h-screen bg-zinc-900 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <h1 className="text-center text-2xl font-semibold text-white">Tailor your feed</h1>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Step {step} of 4
        </p>

        <div className="mt-8 flex gap-2">
          {[1, 2, 3, 4].map((s) => (
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
              <h2 className="text-lg font-medium text-white">Risk Tolerance</h2>
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
            <div>
              <h2 className="text-lg font-medium text-white">Profile</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Do you want growth stocks vs. balanced stocks vs. income stocks? 
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {GROWTH_PROFILE.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCapPreference(c.id)}
                    className={`rounded-lg border p-4 text-left transition ${
                      capPreference === c.id
                        ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/40'
                        : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <p className="font-semibold text-white">{c.label}</p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                      {c.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-lg font-medium text-white">Investment Horizon</h2>
              <p className="mt-1 text-sm text-zinc-400">How long do you plan to hold these investments?</p>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-300">Years</span>
                  <span className="font-medium text-blue-400">
                    {investmentHorizon === 10 ? '10+ years' : `${investmentHorizon} year${investmentHorizon !== 1 ? 's' : ''}`}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={investmentHorizon || 5}
                  onChange={(e) => setInvestmentHorizon(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>1 year</span>
                  <span>10+ years</span>
                </div>
                <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-800 p-3">
                  <p className="text-xs font-medium text-zinc-300">
                    {investmentHorizon <= 2 
                      ? INVESTMENT_HORIZON[0].description 
                      : investmentHorizon <= 5 
                        ? INVESTMENT_HORIZON[1].description 
                        : INVESTMENT_HORIZON[2].description}
                  </p>
                </div>
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
            {step < 4 ? (
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
