"use client";

import { useEffect, useMemo, useState } from "react";
import TripForm from "@/components/TripForm";
import Itinerary from "@/components/Itinerary";
import ResultsSidebar from "@/components/ResultsSidebar";

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

            <Itinerary
              itinerary={plan.itinerary}
              formatTime={formatTime}
              formatCost={formatCost}
            />
          </section>

          <ResultsSidebar
            plan={plan}
            duration={duration}
            totalEstimatedCost={totalEstimatedCost}
            totalBudget={totalBudget}
            budgetPercentage={budgetPercentage}
            startingLocation={startingLocation}
            travelers={travelers}
            selectedAccommodation={selectedAccommodation}
            selectedTransport={selectedTransport}
            budgetCategories={budgetCategories}
            formatCost={formatCost}
            selectedInterests={selectedInterests}
            travelInterests={travelInterests}
            preferences={preferences}
          />
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

        <TripForm
          startingLocation={startingLocation}
          setStartingLocation={setStartingLocation}
          travelers={travelers}
          setTravelers={setTravelers}
          destination={destination}
          setDestination={setDestination}
          budget={budget}
          setBudget={setBudget}
          duration={duration}
          setDuration={setDuration}
          travelInterests={travelInterests}
          selectedInterests={selectedInterests}
          toggleInterest={toggleInterest}
          accommodationOptions={accommodationOptions}
          accommodation={accommodation}
          setAccommodation={setAccommodation}
          transportOptions={transportOptions}
          transport={transport}
          setTransport={setTransport}
          preferences={preferences}
          setPreferences={setPreferences}
          image={image}
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
          error={error}
          generatePlan={generatePlan}
          loading={loading}
          loadingMessage={loadingMessage}
        />

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