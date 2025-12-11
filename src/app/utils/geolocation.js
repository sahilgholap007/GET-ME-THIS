// Utility functions for getting user location without browser permission

/**
 * Get user's country using IP geolocation
 * Returns country code and country name
 */
export const getUserLocation = async () => {
    try {
        // Try multiple geolocation services for redundancy
        const services = [
            // Primary service - ipapi.co (free tier: 30,000 requests/month)
            {
                url: 'https://ipapi.co/json/',
                parser: (data) => ({
                    country: data.country_name,
                    countryCode: data.country_code,
                    city: data.city,
                    region: data.region,
                    ip: data.ip,
                    timezone: data.timezone
                })
            },
            // Fallback 1 - ip-api.com (free tier: 1000 requests/hour)
            {
                url: 'http://ip-api.com/json/',
                parser: (data) => ({
                    country: data.country,
                    countryCode: data.countryCode,
                    city: data.city,
                    region: data.regionName,
                    ip: data.query,
                    timezone: data.timezone
                })
            },
            // Fallback 2 - ipgeolocation.io (free tier: 30,000 requests/month)
            {
                url: 'https://api.ipgeolocation.io/ipgeo?apiKey=free',
                parser: (data) => ({
                    country: data.country_name,
                    countryCode: data.country_code2,
                    city: data.city,
                    region: data.state_prov,
                    ip: data.ip,
                    timezone: data.time_zone.name
                })
            }
        ]

        // Try services in order
        for (const service of services) {
            try {
                const response = await fetch(service.url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                    // Add timeout to prevent hanging
                    signal: AbortSignal.timeout(5000)
                })

                if (response.ok) {
                    const data = await response.json()
                    const locationData = service.parser(data)

                    // Validate that we got the essential data
                    if (locationData.country && locationData.countryCode) {
                        console.log('Location detected:', locationData)
                        return locationData
                    }
                }
            } catch (error) {
                console.warn(`Geolocation service failed:`, error)
                continue
            }
        }

        // If all services fail, return default
        console.warn('All geolocation services failed, using default')
        return getDefaultLocation()

    } catch (error) {
        console.error('Error getting user location:', error)
        return getDefaultLocation()
    }
}

/**
 * Get cached location from localStorage or fetch new one
 */
export const getCachedUserLocation = async () => {
    try {
        // Check if we have cached location (cache for 24 hours)
        const cachedData = localStorage.getItem('userLocation')
        const cacheTimestamp = localStorage.getItem('userLocationTimestamp')

        if (cachedData && cacheTimestamp) {
            const cacheAge = Date.now() - parseInt(cacheTimestamp)
            const twentyFourHours = 24 * 60 * 60 * 1000

            if (cacheAge < twentyFourHours) {
                console.log('Using cached location data')
                return JSON.parse(cachedData)
            }
        }

        // Fetch new location data
        const locationData = await getUserLocation()

        // Cache the result
        localStorage.setItem('userLocation', JSON.stringify(locationData))
        localStorage.setItem('userLocationTimestamp', Date.now().toString())

        return locationData

    } catch (error) {
        console.error('Error getting cached location:', error)
        return getDefaultLocation()
    }
}

/**
 * Get default location if all else fails
 */
const getDefaultLocation = () => ({
    country: 'India',
    countryCode: 'IN',
    city: 'Unknown',
    region: 'Unknown',
    ip: 'Unknown',
    timezone: 'Asia/Kolkata'
})

/**
 * Get user's country code only (lightweight version)
 */
export const getUserCountryCode = async () => {
    try {
        const location = await getCachedUserLocation()
        return location.countryCode || 'IN'
    } catch (error) {
        console.error('Error getting country code:', error)
        return 'IN' // Default to India
    }
}

/**
 * Get user's country name only (lightweight version)
 */
export const getUserCountry = async () => {
    try {
        const location = await getCachedUserLocation()
        return location.country || 'India'
    } catch (error) {
        console.error('Error getting country name:', error)
        return 'India' // Default to India
    }
}

/**
 * Initialize location detection on app load
 */
export const initializeLocationDetection = async () => {
    try {
        // Start location detection in background without waiting
        getCachedUserLocation().catch(console.error)
    } catch (error) {
        console.error('Error initializing location detection:', error)
    }
}