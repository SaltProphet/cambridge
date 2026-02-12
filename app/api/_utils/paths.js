/**
 * Parse creator slug from request URL or query parameters
 * Compatible with Next.js App Router requests
 * @param {Request|Object} req - Next.js request object or URL
 * @returns {string|null} - Normalized lowercase creator slug or null
 */
export function parseCreatorSlugFromPath(req) {
  // Handle Next.js App Router Request object
  if (req instanceof Request) {
    const url = new URL(req.url);
    
    // Check query parameters
    const querySlug = url.searchParams.get('creatorSlug') || 
                     url.searchParams.get('slug') || 
                     url.searchParams.get('creator_slug');
    if (querySlug) {
      return String(querySlug).toLowerCase().trim();
    }

    // Parse from URL path
    const pathname = url.pathname;
    const match = pathname.match(/\/r\/([^/?#]+)(?:\/|$)/);
    if (match && match[1]) {
      return String(match[1]).toLowerCase().trim();
    }

    return null;
  }

  // Fallback for legacy objects with query and url properties
  const querySlug = req.query?.creatorSlug || req.query?.slug || req.query?.creator_slug;
  if (querySlug) {
    return String(querySlug).toLowerCase().trim();
  }

  const urlStr = req.url || '';
  const match = urlStr.match(/\/r\/([^/?#]+)(?:\/|$)/);
  if (match && match[1]) {
    return String(match[1]).toLowerCase().trim();
  }

  return null;
}
