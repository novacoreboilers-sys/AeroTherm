export type ChatQuestionType = "text" | "email" | "phone" | "choice";
export type ChatQuestion = {
  id: string;
  label: string;
  prompt: string;
  description: string;
  type: ChatQuestionType;
  required: boolean;
  choices?: readonly string[];
};

export const chatbotConfig = {
  brandName: "AeroTherm Engineering",
  assistantName: "Aero",
  headerSubtitle: "Industrial solutions, clearly explained",
  fieldIds: { name: "name", email: "email", phone: "phone", service: "service" },
  welcomeMessage: "Hello! Welcome to AeroTherm Engineering. I’m Aero, your industrial solutions assistant. How can I help you today?",
  submittedMessage: "Your inquiry has been submitted to the AeroTherm Engineering team. We’ll review it and contact you shortly.",
  duplicateMessage: "We already have an inquiry with this email and phone number. Our team has your details and will contact you shortly.",
  newInquiryLockedMessage: "Your latest inquiry is already with our team. You can start another inquiry two hours after your previous submission.",
  maxReplyWords: 90,
  recentMessagesForModel: 10,
  messagesStoredLocally: 30,
  localStorageTtlMs: 2 * 60 * 60 * 1000,
  localStorageKey: "aerotherm-engineering-chat-v3",
  legacyLocalStorageKeys: ["aerotherm-engineering-chat-v2", "aerotherm-engineering-chat-v1", "nexora-fixes-chat-v1"],
  apiPaths: { chat: "/api/chat", extract: "/api/chat/extract", leads: "/api/leads" },
  models: {
    conversation: ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b"],
    extraction: ["openai/gpt-oss-20b", "qwen/qwen3.6-27b", "openai/gpt-oss-120b"],
  },
  modelLimits: {
    conversationTimeoutMs: 8_000,
    extractionTimeoutMs: 7_000,
    conversationOutputTokens: 220,
    extractionOutputTokens: 260,
  },
  integrations: { unqualifiedServiceValues: ["Other / Not sure"] },
  email: {
    websiteUrl: "https://aerothermengineering.com",
    clientSubject: "We received your AeroTherm Engineering inquiry",
    brandInitial: "A",
  },
  scope: {
    description: "AeroTherm Engineering, industrial boilers, pressure vessels, heat exchangers, industrial fabrication, EPC projects, engineering consultancy, inspection and certification, plant shutdown support, automation, PLC, SCADA, HMI, boiler instrumentation, industrial chemicals, biomass fuel, coal trading, and the visitor’s current industrial inquiry",
    outOfScopeReply: "I’m here to help with AeroTherm Engineering’s industrial services and your project inquiry. I can guide you on boilers, fabrication, automation, chemicals, biomass, coal supply, inspections, or related engineering needs.",
  },
  starterPrompts: ["I need a boiler solution", "I need automation support", "I need industrial fuel"],
  questions: [
    { id: "name", label: "Name", prompt: "It’s nice to meet you — what should I call you?", description: "The visitor’s full name.", type: "text", required: true },
    { id: "phone", label: "Phone", prompt: "What phone or WhatsApp number would be best for our team to reach you on?", description: "A valid phone or WhatsApp number, including country code when possible.", type: "phone", required: true },
    { id: "email", label: "Email", prompt: "And what email address should we use for the follow-up?", description: "A valid contact email address.", type: "email", required: true },
    {
      id: "service", label: "Service", prompt: "Which AeroTherm service best matches your requirement?",
      description: "The closest matching AeroTherm Engineering service category.", type: "choice", required: true,
      choices: [
        "Boilers & Steam Systems", "Pressure Vessels & Heat Exchangers", "Industrial Fabrication & EPC",
        "Automation, PLC & Instrumentation", "Industrial Chemicals", "Biomass Fuel Supply", "Coal Trading",
        "Inspection, Consultancy & Shutdowns", "Other / Not sure",
      ],
    },
  ] satisfies readonly ChatQuestion[],
  knowledge: [
    "AeroTherm Engineering is an industrial engineering and supply company serving clients across Pakistan from Lahore.",
    "Core engineering work includes industrial boiler manufacturing, pressure vessel manufacturing, heat exchanger manufacturing, industrial fabrication, EPC solutions, engineering consultancy, plant shutdown services, and third-party inspection.",
    "Boiler and steam services cover industrial steam requirements, boiler automation, burner management systems, control panels, instrumentation, efficiency improvement, inspection, and certification support.",
    "Automation services include PLC programming and commissioning, SCADA development and monitoring, HMI configuration, MCC, PCC and PLC panels, VFD installation, process integration, preventive maintenance, troubleshooting, retrofits, and system upgrades.",
    "Instrumentation services cover temperature, pressure, flow, and level measurement and control, plus instrument installation and calibration.",
    "Industrial chemical supply includes water treatment chemicals, boiler treatment chemicals, process chemicals, cleaning chemicals, solvents, industrial raw materials, and specialty chemicals.",
    "Biomass fuel products include wood pellets, wood chips, rice husk, bagasse, sawdust, biomass briquettes, and other agricultural biomass fuels.",
    "Coal trading covers imported coal, local coal, industrial-grade coal, and bulk coal supply with delivery support across Pakistan.",
    "AeroTherm serves textile, food and beverage, paper and packaging, chemical, pharmaceutical, power, oil and gas, water treatment, steel, cement, sugar, rice and flour milling, foundry, brick kiln, and manufacturing operations.",
    "AeroTherm focuses on dependable supply, technical support, safe execution, energy efficiency, competitive pricing, timely delivery, and solutions tailored to each plant’s operating requirements.",
"The company’s published contact details are info@aerothermengineering.com and +92 3035639012, with operations based in Lahore, Pakistan.",
    "Pricing, engineering scope, delivery schedules, fuel specifications, and commissioning timelines depend on the project. Offer a technical discussion or quotation instead of inventing figures or guarantees.",
    "Do not promise a fixed response time, price, certification outcome, delivery date, or operating result unless the AeroTherm team has confirmed it.",
  ],
} as const;

export type ChatQuestionId = (typeof chatbotConfig.questions)[number]["id"];
export const requiredQuestions = chatbotConfig.questions.filter((question) => question.required);

function validateConfiguration() {
  const ids = chatbotConfig.questions.map((question) => question.id);
  if (new Set(ids).size !== ids.length) throw new Error("Chatbot question IDs must be unique.");
  for (const [role, questionId] of Object.entries(chatbotConfig.fieldIds)) {
    const question = chatbotConfig.questions.find((candidate) => candidate.id === questionId);
    if (!question) throw new Error(`Chatbot fieldIds.${role} points to missing question '${questionId}'.`);
    if (!question.required) throw new Error(`Chatbot fieldIds.${role} must point to a required question.`);
  }
}

validateConfiguration();
