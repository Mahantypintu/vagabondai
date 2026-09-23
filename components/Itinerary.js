export default function Itinerary({
  itinerary,
  formatTime,
  formatCost
}) {
  if (!itinerary?.length) {
    return null;
  }

  return (
    <div className="space-y-8">
      {itinerary.map((day, dayIndex) => (
        <div key={`${day.day}-${dayIndex}`} className="relative">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 font-bold text-black">
              {day.day}
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500">
                Day
              </p>

              <h2 className="font-semibold text-white">
                Day {day.day}
              </h2>
            </div>
          </div>

          <div className="ml-5 border-l border-white/10 pl-8">
            <div className="space-y-5">
              {day.activities.map((activity, activityIndex) => (
                <div
                  key={`${activity.locationName}-${activityIndex}`}
                  className="relative rounded-2xl border border-white/10 bg-black/20 p-5"
                >
                  <div className="absolute -left-[41px] top-6 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-[#08090b]" />

                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-emerald-400">
                        {formatTime(activity.time)}
                      </p>

                      <h3 className="mt-1 text-lg font-semibold text-white">
                        {activity.locationName}
                      </h3>
                    </div>

                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">
                      Estimated cost:{" "}
                      {formatCost(activity.estimatedCost)}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {activity.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}