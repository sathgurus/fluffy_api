const axios = require("axios");

async function getAddress(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    const response = await axios.get(url, {
      headers: { "User-Agent": "YourAppName/1.0" }
    });

    return response.data.display_name || null;

  } catch (error) {
    console.log("Address fetch error:", error.message);
    return null;
  }
}

module.exports = getAddress;
