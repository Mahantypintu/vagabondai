export default function PackingChecklist({ packingChecklist }) {
  if (!packingChecklist?.length) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
        Packing checklist
      </p>

      <div className="mt-4 space-y-3">
        {packingChecklist.map((item, index) => (
          <label
            key={`${item}-${index}`}
            className="flex items-center gap-3 rounded-2xl bg-black/20 px-4 py-3"
          >
            <input
              type="checkbox"
              className="h-4 w-4 accent-emerald-400"
            />

            <span className="text-sm text-zinc-300">
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}