function generateLink() {
	const countryCodeInput = document.getElementById("countryCode");
	const phoneNumberInput = document.getElementById("phoneNumber");
	const countryCode = countryCodeInput.value.trim();
	let phoneNumber = phoneNumberInput.value.trim();

	// Validate inputs
	if (
		!countryCode ||
		!countryCode.startsWith("+") ||
		isNaN(countryCode.substring(1))
	) {
		alert("Please enter a valid country code starting with +");
		return;
	}

	if (!phoneNumber || isNaN(phoneNumber)) {
		alert("Please enter a valid phone number");
		return;
	}

	// Remove leading zero from phone number if present
	if (phoneNumber[0] === "0") {
		phoneNumber = phoneNumber.substring(1);
	}

	// Generate WhatsApp link
	const whatsappLink = `https://wa.me/${countryCode}${phoneNumber}`;

	// Open WhatsApp link directly
	window.open(whatsappLink, "_blank");
}
