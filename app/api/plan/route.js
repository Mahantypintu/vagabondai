import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are an expert multi-modal travel agent. Analyze the user's details and any uploaded images. Identify landmarks in the images using vision features.

You must return your response STRICTLY as a valid JSON object matching this schema:
{
  "tripOverview": {
    "destination": "String",
    "totalBudgetUsed": "Number",
    "vibe": "String"
  },
  "budgetBreakdown": {
    "transport": "Number",
    "accommodation": "Number",
    "food": "Number",
    "activities": "Number",
    "shopping": "Number",
    "other": "Number"
  },
  "itinerary": [
    {
      "day": 1,
      "activities": [
        {
          "time": "HH:MM",
          "locationName": "String",
          "description": "String",
          "estimatedCost": "Number"
        }
      ]
    }
  ],
  "packingChecklist": [
    "String"
  ]
}
`;

function cleanJsonResponse(text) {
  let cleaned = text.trim();

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
    cleaned = cleaned.replace(/\s*```$/i, "");
  }

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("AI response did not contain a valid JSON object.");
  }

  cleaned = cleaned.slice(firstBrace, lastBrace + 1);

  return JSON.parse(cleaned);
}

function validatePlan(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid plan response.");
  }

  if (!data.tripOverview || typeof data.tripOverview !== "object") {
    throw new Error("Missing trip overview.");
  }

  if (typeof data.tripOverview.destination !== "string") {
    throw new Error("Invalid destination in response.");
  }

  if (typeof data.tripOverview.totalBudgetUsed !== "number") {
    throw new Error("Invalid budget in response.");
  }

  if (typeof data.tripOverview.vibe !== "string") {
    throw new Error("Invalid vibe in response.");
  }

  if (!data.budgetBreakdown || typeof data.budgetBreakdown !== "object") {
    throw new Error("Missing budget breakdown.");
  }

  const budgetCategories = [
    "transport",
    "accommodation",
    "food",
    "activities",
    "shopping",
    "other"
  ];

  for (const category of budgetCategories) {
    if (
      typeof data.budgetBreakdown[category] !== "number" ||
      data.budgetBreakdown[category] < 0
    ) {
      throw new Error(`Invalid ${category} budget.`);
    }
  }

  if (!Array.isArray(data.itinerary)) {
    throw new Error("Invalid itinerary.");
  }

  for (const day of data.itinerary) {
    if (typeof day.day !== "number" || !Array.isArray(day.activities)) {
      throw new Error("Invalid itinerary day.");
    }

    for (const activity of day.activities) {
      if (
        typeof activity.time !== "string" ||
        typeof activity.locationName !== "string" ||
        typeof activity.description !== "string" ||
        typeof activity.estimatedCost !== "number"
      ) {
        throw new Error("Invalid activity in itinerary.");
      }
    }
  }

  if (!Array.isArray(data.packingChecklist)) {
    throw new Error("Invalid packing checklist.");
  }

  for (const item of data.packingChecklist) {
    if (typeof item !== "string") {
      throw new Error("Invalid packing checklist item.");
    }
  }

  return data;
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const startingLocation = String(
      formData.get("startingLocation") || ""
    ).trim();
    const destination = String(formData.get("destination") || "").trim();
    const budgetValue = String(formData.get("budget") || "").trim();
    const durationValue = String(formData.get("duration") || "").trim();
    const travelersValue = String(formData.get("travelers") || "").trim();
    const interestsValue = String(formData.get("interests") || "").trim();
    const accommodation = String(
      formData.get("accommodation") || "No preference"
    ).trim();
    const transport = String(
      formData.get("transport") || "No preference"
    ).trim();
    const preferences = String(formData.get("preferences") || "").trim();
    const image = formData.get("image");

    if (!startingLocation) {
      return Response.json(
        { error: "Starting location is required." },
        { status: 400 }
      );
    }

    if (!destination) {
      return Response.json(
        { error: "Destination is required." },
        { status: 400 }
      );
    }

    const budget = Number(budgetValue);
    const duration = Number(durationValue);
    const travelers = Number(travelersValue);

    const interests = interestsValue
      ? interestsValue
        .split(",")
        .map((interest) => interest.trim())
        .filter(Boolean)
      : [];

    if (!Number.isFinite(budget) || budget <= 0) {
      return Response.json(
        { error: "Please enter a valid budget." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(duration) || duration < 1 || duration > 7) {
      return Response.json(
        { error: "Trip duration must be between 1 and 7 days." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(travelers) || travelers < 1 || travelers > 20) {
      return Response.json(
        { error: "Number of travelers must be between 1 and 20." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const textPrompt = `
Starting location: ${startingLocation}
Destination: ${destination}
Total trip budget for the entire group: ${budget}
Trip duration: ${duration} days
Number of travelers: ${travelers}
Travel interests: ${interests.length ? interests.join(", ") : "No specific interests selected."}
Accommodation preference: ${accommodation}
Transport preference: ${transport}
Additional travel preferences: ${preferences || "No additional preferences provided."}

Create a practical day-by-day itinerary that fits the user's total group budget.

The budget provided is the total budget for all ${travelers} traveler${travelers === 1 ? "" : "s"}, not the budget per person.

Use the starting location as part of the travel planning context.
Consider realistic travel distance, transportation needs, and travel time between the starting location and destination.

Account for the number of travelers when estimating costs. Consider group-size effects for transportation, entry fees, food, activities, and other expenses where appropriate.

Use the accommodation preference when planning the stay.
Include accommodation costs that are realistic for the selected accommodation type and number of travelers.
If no accommodation preference is selected, choose a practical option that fits the user's budget and travel style.

Use the transport preference when planning travel.
Respect the user's selected transport type for the main journey whenever it is practical.
Include realistic transportation costs for the entire group.
If no transport preference is selected, choose practical transportation that fits the budget and destination.

Optimize each day's route geographically.
Group nearby places together when possible.
Avoid unnecessary backtracking between distant locations.
Consider realistic travel time between activities.
Do not schedule activities in an unrealistic order.

Create a detailed budget breakdown using these categories:
- transport
- accommodation
- food
- activities
- shopping
- other

The budget breakdown must represent estimated costs for the entire group.

The sum of the budget breakdown categories should closely match the total estimated itinerary cost.

Generate exactly ${duration} days in the itinerary.
Do not generate fewer or more than ${duration} days.

Use realistic estimated costs for the entire group.
Prioritize the selected travel interests throughout the itinerary.
Do not force every interest into every day. Use them naturally where they fit the destination.

Create a useful packing checklist based on the destination, duration, activities, accommodation type, transport choice, and travel style.

Keep the itinerary useful, varied, realistic, and easy to follow.
`;

    const parts = [
      {
        text: textPrompt
      }
    ];

    if (image && typeof image.arrayBuffer === "function" && image.size > 0) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const base64Image = imageBuffer.toString("base64");

      parts.push({
        inlineData: {
          mimeType: image.type || "image/jpeg",
          data: base64Image
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          role: "user",
          parts
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error("Gemini returned an empty response.");
    }

    const plan = cleanJsonResponse(responseText);
    validatePlan(plan);

    const budgetBreakdownTotal = Object.values(
      plan.budgetBreakdown
    ).reduce(
      (total, value) => total + Number(value || 0),
      0
    );

    plan.tripOverview.totalBudgetUsed = budgetBreakdownTotal;

    return Response.json(plan, { status: 200 });
  } catch (error) {
    console.error("Travel planning error:", error);

    return Response.json(
      {
        error: error.message || "Failed to generate travel plan."
      },
      { status: 500 }
    );
  }
}
