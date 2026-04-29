const fetch = require('node-fetch');

/**
 * Check if a URL is reachable (returns non-error HTTP status).
 * @param {string} url
 * @param {number} timeoutMs
 * @returns {Promise<{url: string, ok: boolean, status: number|null, error: string|null}>}
 */
async function checkUrl(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timer);
    return { url, ok: res.ok, status: res.status, error: null };
  } catch (err) {
    clearTimeout(timer);
    return { url, ok: false, status: null, error: err.message };
  }
}

/**
 * Check all bookmarks for broken links.
 * @param {object[]} bookmarks
 * @param {object} opts
 * @param {number} [opts.concurrency=5]
 * @param {number} [opts.timeoutMs=5000]
 * @returns {Promise<{bookmark: object, result: object}[]>}
 */
async function checkBrokenLinks(bookmarks, { concurrency = 5, timeoutMs = 5000 } = {}) {
  const results = [];
  for (let i = 0; i < bookmarks.length; i += concurrency) {
    const batch = bookmarks.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (bm) => ({
        bookmark: bm,
        result: await checkUrl(bm.url, timeoutMs),
      }))
    );
    results.push(...batchResults);
  }
  return results;
}

/**
 * Filter check results to only broken entries.
 * @param {{bookmark: object, result: object}[]} results
 * @returns {{bookmark: object, result: object}[]}
 */
function getBrokenResults(results) {
  return results.filter((r) => !r.result.ok);
}

module.exports = { checkUrl, checkBrokenLinks, getBrokenResults };
