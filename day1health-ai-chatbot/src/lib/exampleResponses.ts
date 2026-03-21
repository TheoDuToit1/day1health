// Example structured responses for reference

export const EXAMPLE_CAROUSEL = {
  messageType: "carousel",
  content: {
    title: "Here are our most affordable options:",
    items: [
      {
        planName: "Day-to-Day Single",
        price: "R385/month",
        highlights: ["GP visits", "Acute medication", "Basic dentistry"],
        color: "#0D9488"
      },
      {
        planName: "Hospital Value Plus",
        price: "R390/month",
        highlights: ["Hospital cover", "Surgeries", "Emergency ambulance"],
        color: "#4F46E5"
      },
      {
        planName: "Comprehensive Value Plus",
        price: "R665/month",
        highlights: ["Everything included", "Day-to-day + Hospital", "Best value"],
        color: "#7C3AED"
      }
    ],
    actionButtons: ["Compare These", "Get Quote"]
  }
};

export const EXAMPLE_COMPARISON = {
  messageType: "comparison",
  content: {
    title: "Day-to-Day vs Comprehensive",
    plans: [
      {
        name: "Day-to-Day",
        price: "R385/month",
        gpVisits: "✅ Unlimited",
        hospital: "❌ Not covered",
        chronic: "❌ Not covered",
        dental: "✅ Basic only"
      },
      {
        name: "Comprehensive",
        price: "R665/month",
        gpVisits: "✅ Unlimited",
        hospital: "✅ Full cover",
        chronic: "✅ Covered",
        dental: "✅ Full cover"
      }
    ]
  }
};

export const EXAMPLE_CARD = {
  messageType: "card",
  content: {
    title: "Comprehensive Value Plus Plan",
    subtitle: "For families who need complete coverage",
    color: "#4F46E5",
    image_url: "https://day1health.co.za/images/comprehensive-value-plus.png",
    price: "Starting at R665 per adult + R266 per child",
    text: [
      "The Comprehensive Value Plus Plan offers full medical insurance coverage for you and your family, including:",
      "- **Day-to-Day Care**: GP visits, acute medication, basic dentistry, optometry",
      "- **Hospital Care**: Hospital stays, surgeries, specialists, emergency ambulance",
      "- **Chronic Medication**: Coverage for ongoing conditions",
      "- **Value Plus Benefits**: Balanced coverage with moderate limits, ideal for most families"
    ],
    buttons: [
      { 
        type: "postback", 
        title: "See Coverage Details", 
        payload: "coverage_details_comprehensive_value_plus" 
      },
      { 
        type: "postback", 
        title: "Get a Quote", 
        payload: "get_quote_comprehensive_value_plus" 
      }
    ]
  }
};

export const EXAMPLE_QUICK_REPLIES = {
  messageType: "quick_replies",
  content: {
    text: "What matters most to you in a health plan?",
    quickReplies: [
      "Hospital Cover",
      "Day-to-Day Visits",
      "Chronic Medication",
      "Budget Under R500",
      "Everything Covered"
    ]
  }
};

export const EXAMPLE_LIST = {
  messageType: "list",
  content: {
    title: "Waiting Period Breakdown",
    items: [
      { icon: "⏱️", label: "1 month", text: "GP visits & basic medication", color: "green" },
      { icon: "⏳", label: "3 months", text: "New chronic conditions", color: "orange" },
      { icon: "📅", label: "12 months", text: "Pre-existing conditions", color: "red" }
    ]
  }
};

export const EXAMPLE_PROGRESS = {
  messageType: "progress",
  content: {
    currentStep: 2,
    totalSteps: 4,
    steps: [
      { label: "Tell us about you", status: "complete" },
      { label: "Choose your plan", status: "active" },
      { label: "Payment details", status: "pending" },
      { label: "Confirmation", status: "pending" }
    ]
  }
};
