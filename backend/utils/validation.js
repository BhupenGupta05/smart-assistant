const validateCoordinates = (lat, lng) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // Check if they're valid numbers
    if (isNaN(latitude) || isNaN(longitude)) {
        return { valid: false, error: 'Invalid coordinates: must be numbers' };
    }

    // Check latitude range (-90 to 90)
    if (latitude < -90 || latitude > 90) {
        return { valid: false, error: 'Invalid latitude: must be between -90 and 90' };
    }

    // Check longitude range (-180 to 180)
    if (longitude < -180 || longitude > 180) {
        return { valid: false, error: 'Invalid longitude: must be between -180 and 180' };
    }

    return { valid: true, latitude, longitude };
};

module.exports = { validateCoordinates };