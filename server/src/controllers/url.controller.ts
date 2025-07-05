/**
 * @desc    Get details of a specific short URL
 * @route   GET /api/v1/url/:urlId
 * @access  Authenticated
 */
export async function getUserUrlDetails() {}

/**
 * @desc    Create a new short URL inside a campaign
 * @route   POST /api/v1/campaign/:campaignId/url
 * @access  Authenticated
 */
export async function createUserUrl() {}

/**
 * @desc    Get all URLs inside a campaign
 * @route   GET /api/v1/campaign/:campaignId/url
 * @access  Authenticated
 */
export async function getUserUrlsBycampaign() {}

/**
 * @desc    Update a short URL (e.g., change destination or metadata)
 * @route   PATCH /api/v1/url/:urlId
 * @access  Authenticated
 */
export async function updateUserUrl() {}

/**
 * @desc    Delete a short URL
 * @route   DELETE /api/v1/url/:urlId
 * @access  Authenticated
 */
export async function deleteUserUrl() {}
