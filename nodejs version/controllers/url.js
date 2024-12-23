const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  console.log("HERRRRRRRRRR", body.url);

  if (!body.url) {
    return res.status(400).json({
      error: "URL is required",
    });
  }

  const existingEntry = await URL.findOne({ redirectUrl: body.url });
  if (existingEntry) {
    return res.status(200).json({
      message: "Short URL already exists",
      shortId: existingEntry.shortId,
    });
  }

  const shortID = shortid.generate(); // Ensure you are calling .generate()
  console.log(shortID);

  // Validate shortID
  if (!shortID) {
    console.error("Failed to generate shortID");
    return res.status(500).json({
      error: "Failed to generate a unique short ID",
    });
  }

  try {
    const newEntry = await URL.create({
      shortId: shortID,
      redirectUrl: body.url,
      visitHistory: [],
    });

    return res.json({
      id: newEntry.shortId,
    });
  } catch (error) {
    console.error("Error creating URL entry:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
