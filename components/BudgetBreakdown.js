export default function BudgetBreakdown({
  budgetBreakdown,
  budgetCategories,
  formatCost
}) {
  if (!budgetBreakdown) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
        Budget breakdown
      </p>

      <div className="mt-4 space-y-3">
        {budgetCategories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3"
          >
            <span className="text-sm text-zinc-300">
              {category.label}
            </span>

            <span className="text-sm font-semibold text-white">
              {formatCost(
                budgetBreakdown[category.id]
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="font-medium text-white">Total</span>

        <span className="font-bold text-emerald-400">
          {formatCost(
            Object.values(budgetBreakdown).reduce(
              (total, value) => total + Number(value || 0),
              0
            )
          )}
        </span>
      </div>
    </div>
  );
}