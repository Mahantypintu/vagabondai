"use client";

import { useEffect, useMemo, useState } from "react";

const loadingMessages = [
  "Mapping out your adventure...",
  "Finding places worth visiting...",
  "Optimizing your daily route...",
  "Balancing the itinerary with your budget...",
  "Choosing the best way to get around...",
  "Preparing your packing checklist...",
  "Putting your journey together..."
];

const travelInterests = [
  { id: "beaches", label: "🏖️ Beaches" },
  { id: "food", label: "🍜 Food" },
  { id: "culture", label: "🏛️ Culture & History" },
  { id: "nature", label: "🌿 Nature" },
  { id: "photography", label: "📸 Photography" },
  { id: "shopping", label: "🛍️ Shopping" },
  { id: "adventure", label: "🥾 Adventure" },
  { id: "nightlife", label: "🌙 Nightlife" },
  { id: "cafes", label: "☕ Cafés" },
  { id: "relaxation", label: "🧘 Relaxation" }
];

const accommodationOptions = [
  { id: "hotel", label: "🏨 Hotel" },
  { id: "homestay", label: "🏡 Homestay" },
  { id: "resort", label: "🌴 Resort" },
  { id: "hostel", label: "🛏️ Hostel" },
  { id: "camping", label: "🏕️ Camping" },
  { id: "budget", label: "💰 Budget stay" },
  { id: "luxury", label: "✨ Luxury stay" },
  { id: "no-preference", label: "🤷 No preference" }
];

const transportOptions = [
  { id: "flight", label: "✈️ Flight" },
  { id: "train", label: "🚆 Train" },
  { id: "bus", label: "🚌 Bus" },
  { id: "car", label: "🚗 Car" },
  { id: "cab", label: "🚕 Cab" },
  { id: "rental-bike", label: "🛵 Rental bike" },
  { id: "no-preference", label: "🤷 No preference" }
];

const budgetCategories = [
  { id: "transport", label: "🚗 Transport" },
  { id: "accommodation", label: "🏨 Accommodation" },
  { id: "food", label: "🍜 Food" },
  { id: "activities", label: "🎟️ Activities" },
  { id: "shopping", label: "🛍️ Shopping" },
  { id: "other", label: "📦 Other" }
];

function formatCost(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function formatTime(value) {
  const [hours, minutes] = String(value).split(":").map(Number);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return value;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(date);
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 py-4 last:border-0">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-3 text-2xl">{icon}</div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-zinc-400">{description}</p>
    </div>
  );
}

export default function Home() {
  const [startingLocation, setStartingLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [duration, setDuration] = useState("3");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [accommodation, setAccommodation] = useState("no-preference");
  const [transport, setTransport] = useState("no-preference");
  const [preferences, setPreferences] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 1800);

    return () => clearInterval(interval);
  }, [loading]);

  const totalBudget = Number(budget) || 0;
  const totalEstimatedCost = plan?.tripOverview?.totalBudgetUsed || 0;

  const budgetPercentage = useMemo(() => {
    if (!totalBudget) {
      return 0;
    }

    return Math.min((totalEstimatedCost / totalBudget) * 100, 100);
  }, [totalBudget, totalEstimatedCost]);

  function handleImageChange(event) {
    const selectedImage = event.target.files?.[0];

    if (!selectedImage) {
      return;
    }

    if (!selectedImage.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (selectedImage.size > 10 * 1024 * 1024) {
      setError("Please select an image smaller than 10 MB.");
      return;
    }

    setError("");
    setImage(selectedImage);

    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);
  }

  function toggleInterest(interest) {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  }

  async function generatePlan() {
    setError("");

    if (!startingLocation.trim()) {
      setError("Please enter your starting location.");
      return;
    }

    if (!destination.trim()) {
      setError("Please enter your dream destination.");
      return;
    }

    if (!budget || Number(budget) <= 0) {
      setError("Please enter a valid budget.");
      return;
    }

    if (
      !Number.isInteger(Number(travelers)) ||
      Number(travelers) < 1 ||
      Number(travelers) > 20
    ) {
      setError("Number of travelers must be between 1 and 20.");
      return;
    }

    setLoading(true);
    setPlan(null);
    setLoadingMessage(loadingMessages[0]);

    try {
      const formData = new FormData();

      formData.append("startingLocation", startingLocation.trim());
      formData.append("destination", destination.trim());
      formData.append("budget", budget);
      formData.append("travelers", travelers);
      formData.append("duration", duration);
      formData.append("interests", selectedInterests.join(","));
      formData.append("accommodation", accommodation);
      formData.append("transport", transport);
      formData.append("preferences", preferences.trim());

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch("/api/plan", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate your travel plan.");
      }

      setPlan(data);
    } catch (requestError) {
      setError(
        requestError.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function editTrip() {
    setPlan(null);
    setError("");
  }

  function startNewPlan() {
    setPlan(null);
    setStartingLocation("");
    setDestination("");
    setBudget("");
    setTravelers("1");
    setDuration("3");
    setSelectedInterests([]);
    setAccommodation("no-preference");
    setTransport("no-preference");
    setPreferences("");
    setImage(null);
    setImagePreview("");
    setError("");
  }

  if (plan) {
    const selectedAccommodation =
      accommodationOptions.find(
        (option) => option.id === accommodation
      )?.label || "No preference";

    const selectedTransport =
      transportOptions.find(
        (option) => option.id === transport
      )?.label || "No preference";

    return (
      <main className="min-h-screen bg-[#08090b] text-white">
        <header className="border-b border-white/10 bg-black/20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <div>
              <div className="text-xl font-bold tracking-tight">
                VAGABOND<span className="text-emerald-400">AI</span>
              </div>
              <p className="text-xs text-zinc-500">Your AI travel planner</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={editTrip}
                className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-400 transition hover:bg-emerald-400/20"
              >
                ← Edit trip
              </button>

              <button
                onClick={startNewPlan}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
              >
                Plan another trip
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1.5fr_0.8fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-8">
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
                Your journey
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {plan.tripOverview.destination}
              </h1>

              <p className="mt-3 max-w-2xl text-zinc-400">
                A personalized itinerary built around your starting point,
                travelers, budget and travel style.
              </p>
            </div>

            <div className="space-y-8">
              {plan.itinerary.map((day, dayIndex) => (
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
          </section>

          <aside className="space-y-6">
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
                    Number(travelers) === 1 ? "traveler" : "travelers"
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

            {plan.budgetBreakdown && (
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
                          plan.budgetBreakdown[category.id]
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-medium text-white">Total</span>

                  <span className="font-bold text-emerald-400">
                    {formatCost(
                      Object.values(plan.budgetBreakdown).reduce(
                        (total, value) => total + Number(value || 0),
                        0
                      )
                    )}
                  </span>
                </div>
              </div>
            )}

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

            {plan.packingChecklist?.length > 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Packing checklist
                </p>

                <div className="mt-4 space-y-3">
                  {plan.packingChecklist.map((item, index) => (
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
            )}
          </aside>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
        <header className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold tracking-tight">
              VAGABOND<span className="text-emerald-400">AI</span>
            </div>

            <p className="text-xs text-zinc-500">Personal travel planner</p>
          </div>

          <div className="hidden rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-400 sm:block">
            AI-powered journeys
          </div>
        </header>

        <section className="mx-auto max-w-4xl py-20 text-center sm:py-28">
          <div className="mb-5 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-400">
            ✦ Plan smarter. Travel better.
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Go somewhere.
            <span className="block text-emerald-400">
              Vagabond smarter.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            Tell VAGABONDAI where you want to go, where you're starting from,
            who you're traveling with, what you want to spend, and how you want
            to travel. We'll turn it into a personalized journey.
          </p>
        </section>

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
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/50"
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

        <section className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-3">
          <FeatureCard
            icon="🗺️"
            title="Smart itineraries"
            description="Get a practical day-by-day journey built around your preferences."
          />

          <FeatureCard
            icon="💰"
            title="Budget aware"
            description="See where your trip budget goes across transport, stays, food and experiences."
          />

          <FeatureCard
            icon="🎒"
            title="Trip ready"
            description="Get a personalized packing checklist based on your destination and activities."
          />
        </section>

        <footer className="py-12 text-center text-xs text-zinc-600">
          VAGABONDAI · Personal AI Travel Planner
        </footer>
      </div>
    </main>
  );
}