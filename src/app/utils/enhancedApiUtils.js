/**
 * Enhanced API utilities for GetMeThis ShopForMe integration
 * Supports the new FastProductScraper API with location detection and currency conversion
 */

/**
 * Get user's location information for API requests
 * Supports manual override via User-Country header
 */
export const getUserLocationHeaders = () => {
    const headers = {}

    // Try to get user's preferred country from localStorage or other sources
    const savedCountry = localStorage.getItem('userCountry')
    if (savedCountry) {
        headers['User-Country'] = savedCountry
    }

    // Add browser language preferences
    if (navigator.language) {
        headers['Accept-Language'] = navigator.language + ',en;q=0.9'
    }

    return headers
}

/**
 * Enhanced axiosInstance wrapper for ShopForMe API calls
 * Automatically includes location detection headers
 */
export const enhancedApiCall = async (axiosInstance, method, url, data = null, additionalHeaders = {}) => {
    const locationHeaders = getUserLocationHeaders()

    const config = {
        method,
        url,
        headers: {
            ...locationHeaders,
            ...additionalHeaders
        }
    }

    if (data) {
        config.data = data
    }

    return axiosInstance(config)
}

/**
 * Format currency with proper localization
 */
export const formatCurrency = (amount, currency = 'USD') => {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(parseFloat(amount))
    } catch (error) {
        return `${amount} ${currency}`
    }
}

/**
 * Parse and format validation response for better UX
 * Updated to handle new API response structure with:
 * - name, price, description[], images[], product_details, is_valid, success, validation_id, extraction_time, total_time
 */
export const parseValidationResponse = (response) => {
    const data = response.data

    // Return the new response structure directly, but provide backward compatibility fields
    return {
        ...data,
        // Backward compatibility mapping for existing code
        extracted_data: {
            product_name: data.name || '',
            extracted_price: data.price ? data.price.replace(/[^\d.,]/g, '') : '',
            extracted_currency: data.price ? data.price.match(/[A-Z₹$€£¥]/g)?.[0] || 'USD' : 'USD',
            extracted_description: data.description ? data.description.join(' ') : '',
            extracted_images: data.images || [],
            brand: data.product_details?.Brand || '',
            category: data.product_details?.Category || '',
            color: data.product_details?.Color || '',
            availability: data.is_valid || false,
        },
        // Enhanced display information
        display_info: {
            provider: 'FastProductScraper',
            duration: data.total_time ? Math.round(data.total_time) + 's' : 'N/A',
            extraction_time: data.extraction_time ? Math.round(data.extraction_time) + 's' : 'N/A',
            platform: data.product_url ? new URL(data.product_url).hostname : 'Unknown',
            supported: data.is_valid || false,
        }
    }
}

/**
 * Enhanced error handler for API responses
 */
export const parseApiError = (error) => {
    if (error.response?.data) {
        const errorData = error.response.data

        // Handle different error formats from the new API
        if (errorData.detail) {
            return errorData.detail
        }

        if (errorData.message) {
            return errorData.message
        }

        if (errorData.error) {
            return errorData.error
        }

        if (errorData.errors && typeof errorData.errors === 'object') {
            // Handle validation errors
            const errorMessages = Object.entries(errorData.errors)
                .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                .join('; ')
            return errorMessages
        }

        if (errorData.validation_notes) {
            return `Validation failed: ${errorData.validation_notes}`
        }
    }

    // Fallback error messages
    if (error.response?.status === 401) {
        return 'Authentication required. Please log in.'
    }

    if (error.response?.status === 403) {
        return 'You do not have permission to perform this action.'
    }

    if (error.response?.status === 404) {
        return 'The requested resource was not found.'
    }

    if (error.response?.status === 429) {
        return 'Too many requests. Please wait a moment and try again.'
    }

    if (error.response?.status >= 500) {
        return 'Server error occurred. Please try again later.'
    }

    return error.message || 'An unexpected error occurred. Please try again.'
}

/**
 * Validate product URL format before API call
 */
export const isValidProductUrl = (url) => {
    if (!url || typeof url !== 'string') {
        return false
    }

    // Basic URL format validation
    try {
        const urlObj = new URL(url)
        return ['http:', 'https:'].includes(urlObj.protocol)
    } catch {
        return false
    }
}

/**
 * Get estimated processing time based on provider
 */
export const getEstimatedProcessingTime = (provider) => {
    switch (provider) {
        case 'apify':
            return '30-90 seconds'
        case 'internal':
            return '90-180 seconds'
        default:
            return '30-180 seconds'
    }
}

/**
 * Check if Apify slots are available based on response
 */
export const getApifyStatus = (validationResponse) => {
    const concurrency = validationResponse.concurrency_info

    if (!concurrency) {
        return { available: true, message: 'Status unknown' }
    }

    const available = concurrency.apify_slots_available > 0
    const usage = `${concurrency.apify_slots_used}/${concurrency.apify_max_slots}`

    return {
        available,
        usage,
        message: available
            ? `Apify slots available (${usage})`
            : `All Apify slots in use (${usage}), using fallback extractor`
    }
}