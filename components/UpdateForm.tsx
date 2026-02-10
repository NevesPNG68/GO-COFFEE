import React, { useEffect, useMemo, useState } from 'react';
import { useMetrics } from '../context/MetricsContext';

function toNumberBR(value: string): number {
  // aceita "1.234,56" ou "1234.56" ou "1234"
  const cleaned = value
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .replace(/[^\d.-]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function toIntBR(value: string): number {
  const n = Math.round(toNumberBR(value));
  return Number.isFinite(n) ? n : 0;
}

function fmtBR(n: number): string {
  try {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  } catch {
    return String(n);
  }
}

const UpdateForm: React.FC = () => {
  const { data, setData, resetDefaults, calculations } = useMetrics();

  // ===== Form state (strings, para não brigar com máscara) =====
  const [referenceMonth, setReferenceMonth] = useState(data.referenceMonth);

  // Meta 01
  const [m1Current, setM1Current] = useState(String(data.meta01.current ?? 0));
  const [m1Target, setM1Target] = useState(String(data.meta01.target ?? 0));
  const [m1Bonus, setM1Bonus] = useState(String(data.meta01.bonus ?? 0));

  // Meta 02
  const [m2Current, setM2Current] = useState(String(data.meta02.current ?? 0));
  const [m2Target, setM2Target] = useState(String(data.meta02.target ?? 0));
  const [m2Bonus, setM2Bonus] = useState(String(data.meta02.bonus ?? 0));

  // Meta 03
  const [m3RevenueCurrent, setM3RevenueCurrent] = useState(String(data.meta03.revenueCurrent ?? 0));
  const [m3TeamSize, setM3TeamSize] = useState(String(data.meta03.teamSize ?? 1));

  const [lvl1Target, setLvl1Target] = useState(String(data.meta03.levels?.[0]?.target ?? 0));
  const [lvl1Bonus, setLvl1Bonus] = useState(String(data.meta03.levels?.[0]?.bonus ?? 0));

  const [lvl2Target, setLvl2Target] = useState(String(data.meta03.levels?.[1]?.target ?? 0));
  const [lvl2Bonus, setLvl2Bonus] = useState(String(data.meta03.levels?.[1]?.bonus ?? 0));

  const [lvl3Target, setLvl3Target] = useState(String(data.meta03.levels?.[2]?.target ?? 0));
  const [lvl3Bonus, setLvl3Bonus] = useState(String(data.meta03.levels?.[2]?.bonus ?? 0));

  // Se o contexto mudar (ex.: reset), reflete no form
  useEffect(() => {
    setReferenceMonth(data.referenceMonth);

    setM1Current(String(data.meta01.current ?? 0));
    setM1Target(String(data.meta01.target ?? 0));
    setM1Bonus(String(data.meta01.bonus ?? 0));

    setM2Current(String(data.meta02.current ?? 0));
    setM2Target(String(data.meta02.target ?? 0));
    setM2Bonus(String(data.meta02.bonus ?? 0));

    setM3RevenueCurrent(String(data.meta03.revenueCurrent ?? 0));
    setM3TeamSize(String(data.meta03.teamSize ?? 1));

    setLvl1Target(String(data.meta03.levels?.[0]?.target ?? 0));
    setLvl1Bonus(String(data.meta03.levels?.[0]?.bonus ?? 0));
    setLvl2Target(String(data.meta03.levels?.[1]?.target ?? 0));
    setLvl2Bonus(String(data.meta03.levels?.[1]?.bonus ?? 0));
    setLvl3Target(String(data.meta03.levels?.[2]?.target ?? 0));
    setLvl3Bonus(String(data.meta03.levels?.[2]?.bonus ?? 0));
  }, [data]);

  const preview = useMemo(() => {
    // Preview rápido com base nos inputs (sem depender do calculations atual)
    const m1t = toNumberBR(m1Target);
    const m1c = toNumberBR(m1Current);
    const m1pct = m1t > 0 ? Math.min(100, Math.max(0, (m1c / m1t) * 100)) : 0;

    const m2t = toNumberBR(m2Target);
    const m2c = toNumberBR(m2Current);
    const m2ok = m2t > 0 && m2c >= m2t;

    const rev = toNumberBR(m3RevenueCurrent);
    const t1 = toNumberBR(lvl1Target);
    const t2 = toNumberBR(lvl2Target);
    const t3 = toNumberBR(lvl3Target);

    let lvl = 0;
    if (t1 > 0 && rev >= t1) lvl = 1;
    if (t2 > 0 && rev >= t2) lvl = 2;
    if (t3 > 0 && rev >= t3) lvl = 3;

    return { m1pct, m2ok, lvl };
  }, [m1Target, m1Current, m2Target, m2Current, m3RevenueCurrent, lvl1Target, lvl2Target, lvl3Target]);

  const handleSave = () => {
    setData((prev) => ({
      ...prev,
      referenceMonth: referenceMonth?.trim() || prev.referenceMonth,

      meta01: {
        current: toIntBR(m1Current),
        target: toIntBR(m1Target),
        bonus: toNumberBR(m1Bonus),
      },

      meta02: {
        current: toNumberBR(m2Current),
        target: toNumberBR(m2Target),
        bonus: toNumberBR(m2Bonus),
      },

      meta03: {
        revenueCurrent: toNumberBR(m3RevenueCurrent),
        teamSize: Math.max(1, toIntBR(m3TeamSize)),
        levels: [
          { target: toNumberBR(lvl1Target), bonus: toNumberBR(lvl1Bonus) },
          { target: toNumberBR(lvl2Target), bonus: toNumberBR(lvl2Bonus) },
          { target: toNumberBR(lvl3Target), bonus: toNumberBR(lvl3Bonus) },
        ],
      },
    }));

    // feedback simples
    alert('Configurações salvas ✅');
  };

  const handleReset = () => {
    if (confirm('Restaurar padrões?')) {
      resetDefaults();
      alert('Padrões restaurados ✅');
    }
  };

  return (
    <div className="space-y-6">
      {/* Topo (Mês de referência + dia, se você quiser depois) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Mês de Referência</label>
            <input
              value={referenceMonth}
              onChange={(e) => setReferenceMonth(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Ex.: Fevereiro 2026"
            />
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-7">
            <div className="text-xs text-gray-500 hidden md:block">
              Bônus total (preview): <span className="font-semibold text-gray-800">R$ {fmtBR(calculations.totalBonus)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metas 01 e 02 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meta 01 */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 md:p-6">
          <h3 className="text-lg font-bold text-orange-700">Meta 01: Volume de Vendas</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-xs font-semibold text-orange-700/80">REALIZADO</label>
              <input
                value={m1Current}
                onChange={(e) => setM1Current(e.target.value)}
                className="mt-2 w-full rounded-xl border border-orange-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                inputMode="numeric"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-orange-700/80">META (QTD)</label>
              <input
                value={m1Target}
                onChange={(e) => setM1Target(e.target.value)}
                className="mt-2 w-full rounded-xl border border-orange-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-orange-100">
            <label className="text-xs font-semibold text-orange-700/80">
              $ VALOR DO BÔNUS (SE ATINGIDO) <span className="ml-2 text-xs text-orange-700/60">({preview.m1pct.toFixed(1)}% atingido)</span>
            </label>
            <input
              value={m1Bonus}
              onChange={(e) => setM1Bonus(e.target.value)}
              className="mt-2 w-full rounded-xl border border-orange-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
              inputMode="decimal"
            />
          </div>
        </div>

        {/* Meta 02 */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 md:p-6">
          <h3 className="text-lg font-bold text-green-700">Meta 02: Ticket Médio</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-xs font-semibold text-green-700/80">ATUAL</label>
              <input
                value={m2Current}
                onChange={(e) => setM2Current(e.target.value)}
                className="mt-2 w-full rounded-xl border border-green-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-green-700/80">META</label>
              <input
                value={m2Target}
                onChange={(e) => setM2Target(e.target.value)}
                className="mt-2 w-full rounded-xl border border-green-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-green-100">
            <label className="text-xs font-semibold text-green-700/80">
              $ VALOR DO BÔNUS (SE ATINGIDO){' '}
              <span className="ml-2 text-xs text-green-700/60">
                ({preview.m2ok ? 'atingida ✅' : 'não atingida'})
              </span>
            </label>
            <input
              value={m2Bonus}
              onChange={(e) => setM2Bonus(e.target.value)}
              className="mt-2 w-full rounded-xl border border-green-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
              inputMode="decimal"
            />
          </div>
        </div>
      </div>

      {/* Meta 03 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
        <h3 className="text-lg font-bold text-gray-900">Meta 03: Faturamento Bruto (Escalonado)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-xs font-semibold text-gray-600">FATURAMENTO ATUAL</label>
            <input
              value={m3RevenueCurrent}
              onChange={(e) => setM3RevenueCurrent(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
              inputMode="decimal"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">EQUIPE (QTD PESSOAS)</label>
            <input
              value={m3TeamSize}
              onChange={(e) => setM3TeamSize(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-200">
          <div className="text-sm font-semibold text-gray-800 mb-4">Configuração dos Níveis</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nível 1 */}
            <div>
              <label className="text-xs font-semibold text-gray-600">Meta Nível 1 (Bronze)</label>
              <input
                value={lvl1Target}
                onChange={(e) => setLvl1Target(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Bônus Nível 1</label>
              <input
                value={lvl1Bonus}
                onChange={(e) => setLvl1Bonus(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                inputMode="decimal"
              />
            </div>

            {/* Nível 2 */}
            <div>
              <label className="text-xs font-semibold text-gray-600">Meta Nível 2 (Prata)</label>
              <input
                value={lvl2Target}
                onChange={(e) => setLvl2Target(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Bônus Nível 2</label>
              <input
                value={lvl2Bonus}
                onChange={(e) => setLvl2Bonus(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                inputMode="decimal"
              />
            </div>

            {/* Nível 3 */}
            <div>
              <label className="text-xs font-semibold text-gray-600">Meta Nível 3 (Ouro)</label>
              <input
                value={lvl3Target}
                onChange={(e) => setLvl3Target(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Bônus Nível 3</label>
              <input
                value={lvl3Bonus}
                onChange={(e) => setLvl3Bonus(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Nível atingido (preview): <span className="font-semibold text-gray-800">{preview.lvl}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            ↺ Restaurar Padrões
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm"
          >
            Salvar Configurações
          </button>
        </div>
      </div>

      {/* Rodapé preview */}
      <div className="text-xs text-gray-500">
        Dica: depois de salvar, atualize a página (Ctrl+F5) para garantir cache limpo no GitHub Pages.
      </div>
    </div>
  );
};

export default UpdateForm;
