const cron = require('node-cron');
const PortalSyncManager = require('../agents/PortalSyncManager');

const REGIONS = ['Mumbai', 'Thane', 'Navi Mumbai'];

let isRunning = false;

/**
 * Runs one full harvest-and-sync pass across all tracked regions, sequentially
 * (one city at a time) to avoid running multiple Playwright crawlers in parallel.
 */
async function runAutoSyncPass() {
  if (isRunning) {
    console.warn('⏭️  AutoSyncJob: previous pass still running, skipping this tick.');
    return;
  }

  isRunning = true;
  console.log('🕒 AutoSyncJob: starting scheduled live listings sync...');

  for (const city of REGIONS) {
    try {
      const result = await PortalSyncManager.harvestAndSyncRegion({ city });
      console.log(`🕒 AutoSyncJob: [${city}] synced ${result.count} listings.`);
    } catch (err) {
      console.error(`🕒 AutoSyncJob: [${city}] failed — ${err.message}`);
    }
  }

  console.log('✅ AutoSyncJob: scheduled sync pass complete.');
  isRunning = false;
}

/**
 * Registers the recurring auto-sync cron job. Runs once daily at midnight
 * (server time). Daily (rather than every few hours) because each listing now
 * also gets its own detail-page visit for amenities, multiplying request volume
 * well beyond the search-page pagination alone — a lower frequency keeps the
 * site load and anti-bot exposure in check.
 */
function startAutoSyncJob() {
  cron.schedule('0 0 * * *', () => {
    runAutoSyncPass().catch((err) => console.error('🕒 AutoSyncJob: unhandled error —', err.message));
  });
  console.log('🕒 AutoSyncJob: scheduled to run once daily at midnight.');
}

module.exports = { startAutoSyncJob, runAutoSyncPass };
