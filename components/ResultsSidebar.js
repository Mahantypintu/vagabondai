import WeatherCard from "@/components/WeatherCard";
import BudgetBreakdown from "@/components/BudgetBreakdown";
import PackingChecklist from "@/components/PackingChecklist";

export default function ResultsSidebar({
  plan,
  duration,
  totalEstimatedCost,
  totalBudget,
  budgetPercentage,
  startingLocation,
  travelers,
  selectedAccommodation,
  selectedTransport,
  budgetCategories,
  formatCost,
  selectedInterests,
  travelInterests,
  preferences
}) {
  return (
    <aside className="space-y-6">
      <WeatherCard
        weather={plan.weather}
        duration={duration}
      />

      <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-emerald-400">
          Trip vibe
        </p>

        <h2 className="mt-3 text-2xl font-bold leading-tight">
          {plan.tripOverview.vibe}
        </h2>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-5">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Budget
          </p>

          <div className="mt-2 flex items-end justify-between gap-3">
            <span className="text-3xl font-bold">
              {formatCost(totalEstimatedCost)}
            </span>

            <span className="text-sm text-zinc-500">
              of {formatCost(totalBudget)}
            </span>
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all"
            style={{ width: `${budgetPercentage}%` }}
          />
        </div>

        <div className="mt-5">
          <SummaryRow
            label="Starting location"
            value={startingLocation}
          />

          <SummaryRow
            label="Travelers"
            value={`${travelers} ${
              Number(travelers) === 1
                ? "traveler"
                : "travelers"
            }`}
          />

          <SummaryRow
            label="Accommodation"
            value={selectedAccommodation}
          />

          <SummaryRow
            label="Transport"
            value={selectedTransport}
          />

          <SummaryRow
            label="Estimated spend"
            value={formatCost(totalEstimatedCost)}
          />

          <SummaryRow
            label="Your budget"
            value={formatCost(totalBudget)}
          />

          <SummaryRow
            label="Remaining"
            value={formatCost(
              Math.max(totalBudget - totalEstimatedCost, 0)
            )}
          />

          <p className="mt-4 text-xs leading-5 text-zinc-500">
            Costs are AI-generated estimates for the entire group based
            on typical travel expenses. Actual prices may vary depending
            on current local prices, season, availability, and your
            choices.
          </p>
        </div>
      </div>

      <BudgetBreakdown
        budgetBreakdown={plan.budgetBreakdown}
        budgetCategories={budgetCategories}
        formatCost={formatCost}
      />

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          Travel brief
        </p>

        {selectedInterests.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedInterests.map((interestId) => {
              const interest = travelInterests.find(
                (item) => item.id === interestId
              );

              return (
                <span
                  key={interestId}
                  className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300"
                >
                  {interest?.label || interestId}
                </span>
              );
            })}
          </div>
        )}

        <p className="mt-4 text-sm leading-7 text-zinc-400">
          {preferences ||
            "Balanced sightseeing, food and experiences."}
        </p>
      </div>

      <PackingChecklist
        packingChecklist={plan.packingChecklist}
      />
    </aside>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-3 last:border-b-0">
      <span className="text-sm text-zinc-500">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-zinc-200">
        {value}
      </span>
    </div>
  );
}