const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY missing");
  module.exports = null;
} else {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // ✅ This is the ONLY model guaranteed for text chat now
  const model = genAI.getGenerativeModel({
    model: "models/text-bison-001",
  });

  console.log("✅ Gemini AI Initialized (text-bison)");

  module.exports = model;
}
