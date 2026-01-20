const express = require("express");
const router = express.Router();

// MOCK AI RESPONSE (NO GOOGLE API)
router.post("/chat", async (req, res) => {
  const { message } = req.body;

  let reply = "I can help you with booking tickets.";

  if (message.toLowerCase().includes("event")) {
    reply = "You can browse available events on the home page and click View Details.";
  }

  if (message.toLowerCase().includes("book")) {
    reply = "To book a ticket, open an event and click the Book Now button.";
  }

  res.json({ reply });
});

module.exports = router;
