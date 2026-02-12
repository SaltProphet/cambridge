/**
 * Parses creator slug from various request sources
 * @param {Object} req - Request object
 * @returns {string|null} - Normalized creator slug or null
 */
function parseCreatorSlugFromPath(req) {
  // 1. Check query parameters first (highest priority)
  if (req.query) {
    const slug = req.query.creatorSlug || 
                 req.query.creator_slug || 
                 req.query.slug || 
                 req.query.creator;
    
    if (slug && typeof slug === 'string') {
      return normalizeSlug(slug);
    }
  }
  
  // 2. Parse from URL path
  const url = req.url || req.originalUrl || '';
  
  try {
    // Try URL parsing for robust handling
    const parsedUrl = new URL(url, 'http://dummy.com');
    const pathname = parsedUrl.pathname;
    
    // Match patterns: /r/:creatorSlug or /r/:creatorSlug/:roomSlug
    const match = pathname.match(/^\/r\/([^\/]+)(?:\/|$)/);
    
    if (match && match[1]) {
      // Decode URI component and normalize
      const slug = decodeURIComponent(match[1]);
      return normalizeSlug(slug);
    }
  } catch (e) {
    // Fallback to simple string parsing
    const pathMatch = url.match(/^\/r\/([^\/\?]+)/);
    if (pathMatch && pathMatch[1]) {
      const slug = decodeURIComponent(pathMatch[1]);
      return normalizeSlug(slug);
    }
  }
  
  return null;
}

/**
 * Normalizes a slug to lowercase and trimmed
 * @param {string} slug - Raw slug
 * @returns {string} - Normalized slug
 */
function normalizeSlug(slug) {
  if (!slug || typeof slug !== 'string') {
    return '';
  }
  return slug.trim().toLowerCase();
}

module.exports = {
  parseCreatorSlugFromPath
};
