/**
 * Parse creator slug from request URL or query parameters
 * @param {Object} req - Vercel request object
 * @returns {string|null} - Normalized lowercase creator slug or null
 */
function parseCreatorSlugFromPath(req) {
  // Priority 1: Check query parameters
  const querySlug = req.query?.creatorSlug || req.query?.slug || req.query?.creator_slug;
  if (querySlug) {
    return String(querySlug).toLowerCase().trim();
  }

  // Priority 2: Parse from URL path
  // Expected patterns: /r/:creatorSlug or /r/:creatorSlug/:roomSlug
  const url = req.url || '';
  const match = url.match(/\/r\/([^/?#]+)(?:\/|$)/);
  
  if (match && match[1]) {
    return String(match[1]).toLowerCase().trim();
  }

  return null;
}

module.exports = { parseCreatorSlugFromPath };
