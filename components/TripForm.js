export default function TripForm({
  startingLocation,
  setStartingLocation,
  travelers,
  setTravelers,
  destination,
  setDestination,
  budget,
  setBudget,
  duration,
  setDuration,
  travelInterests,
  selectedInterests,
  toggleInterest,
  accommodationOptions,
  accommodation,
  setAccommodation,
  transportOptions,
  transport,
  setTransport,
  preferences,
  setPreferences,
  image,
  imagePreview,
  handleImageChange,
  error,
  generatePlan,
  loading,
  loadingMessage
}) {
  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Starting location
            </label>

            <input
              type="text"
              value={startingLocation}
              onChange={(event) =>
                setStartingLocation(event.target.value)
              }
              placeholder="e.g. Bengaluru, India"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Number of travelers
            </label>

            <select
              value={travelers}
              onChange={(event) =>
                setTravelers(event.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none transition focus:border-emerald-400/50"
            >
              {Array.from({ length: 20 }, (_, index) => {
                const value = index + 1;

                return (
                  <option
                    key={value}
                    value={value}
                    className="bg-[#08090b]"
                  >
                    {value} {value === 1 ? "traveler" : "travelers"}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Dream destination
            </label>

            <input
              type="text"
              value={destination}
              onChange={(event) =>
                setDestination(event.target.value)
              }
              placeholder="e.g. Kyoto, Japan"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Budget
            </label>

            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500">
                ₹
              </span>

              <input
                type="number"
                min="1"
                value={budget}
                onChange={(event) =>
                  setBudget(event.target.value)
                }
                placeholder="50000"
                className="w-full rounded-2xl border border-white/10 bg-black/20 py-4 pl-10 pr-5 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/50"
              />
            </div>

            <p className="mt-2 text-xs text-zinc-500">
              Total budget for all travelers
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Trip duration
            </label>

            <select
              value={duration}
              onChange={(event) =>
                setDuration(event.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none transition focus:border-emerald-400/50"
            >
              {Array.from({ length: 7 }, (_, index) => {
                const value = index + 1;

                return (
                  <option
                    key={value}
                    value={value}
                    className="bg-[#08090b]"
                  >
                    {value} {value === 1 ? "day" : "days"}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-200">
              What are you interested in?
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {travelInterests.map((interest) => {
                const isSelected =
                  selectedInterests.includes(interest.id);

                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() =>
                      toggleInterest(interest.id)
                    }
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      isSelected
                        ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 bg-black/20 text-zinc-400 hover:border-white/20 hover:bg-white/[0.03]"
                    }`}
                  >
                    {interest.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-zinc-500">
              Select as many as you like.
            </p>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-200">
              Where do you want to stay?
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {accommodationOptions.map((option) => {
                const isSelected =
                  accommodation === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setAccommodation(option.id)
                    }
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      isSelected
                        ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 bg-black/20 text-zinc-400 hover:border-white/20 hover:bg-white/[0.03]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-zinc-500">
              Choose the type of stay that fits your trip.
            </p>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-200">
              How do you want to travel?
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {transportOptions.map((option) => {
                const isSelected =
                  transport === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setTransport(option.id)
                    }
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      isSelected
                        ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 bg-black/20 text-zinc-400 hover:border-white/20 hover:bg-white/[0.03]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-zinc-500">
              Choose your preferred way to get there and around.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Anything else?
              <span className="ml-2 text-xs font-normal text-zinc-500">
                Optional
              </span>
            </label>

            <textarea
              value={preferences}
              onChange={(event) =>
                setPreferences(event.target.value)
              }
              placeholder="Hidden gems, relaxed pace, local experiences, specific places..."
              rows={4}
              className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none transition placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Inspiration photo
              <span className="ml-2 text-xs font-normal text-zinc-500">
                Optional
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-white/15 bg-black/20 p-5 transition hover:border-emerald-400/40 hover:bg-white/[0.03]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-xl">
                📸
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-200">
                  {image
                    ? image.name
                    : "Upload an inspiration photo"}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  VAGABONDAI can use it to understand your travel
                  style.
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {imagePreview && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={imagePreview}
                  alt="Travel inspiration preview"
                  className="h-48 w-full object-cover"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            onClick={generatePlan}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-5 py-4 font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                {loadingMessage}
              </>
            ) : (
              <>Plan my journey →</>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}