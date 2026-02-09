const axios = require("axios");

// Function to call the API
async function callApi() {
	try {
        const response = await axios.get("https://localhost:15888/");
		console.log("Response:", response.data);
	} catch (error) {
		console.error("Error calling the API:", error.message);
	}
}

// Call the function
callApi();
