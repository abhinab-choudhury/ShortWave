const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const cache = (name, exports) => { require.cache[require.resolve(`${root}/${name}`)] = { exports }; };
let buffers, receipts, total, failWrite, failDelete, newClick;
const redisClient = {
  async *scanIterator({ MATCH }) {
    yield [...buffers.keys()].filter(k => k.startsWith(MATCH.slice(0, -1)));
  },
  async eval(script, { keys: [source, target] }) {
    if (!buffers.has(source)) return 0;
    buffers.set(target, buffers.get(source)); buffers.delete(source);
    if (newClick) { buffers.set(source, { hits: '1' }); newClick = false; }
    return 1;
  },
  async hGetAll(key) { return buffers.get(key) || {}; },
  async del(key) {
    if (failDelete) { failDelete = false; throw new Error('Redis disconnect'); }
    buffers.delete(key);
  },
};
cache('database/redis-connect.js', { redisClient, REDIS_CONNECT: async () => {} });
cache('database/db-connect.js', { __esModule: true, default: async () => {} });
cache('services/click.service.js', { createClick: async (data, batch) => {
  if (failWrite) throw new Error('Mongo unavailable');
  if (!receipts.has(batch)) { receipts.add(batch); total += data.click_cnt; }
} });
const { flushBatches, flushRedishStatsToMongo } = require(`${root}/utils/redis-helpers.js`);
beforeEach(() => {
  buffers = new Map([['url_stats:abc:2026-11-24', { hits: '3', 'device:mobile': '3' }]]);
  receipts = new Set(); total = 0; failWrite = false; failDelete = false; newClick = false;
});
test('flush retains a click arriving after snapshot', async () => {
  newClick = true;
  await flushBatches();
  assert.equal(total, 3);
  assert.equal(buffers.get('url_stats:abc:2026-11-24').hits, '1');
  await flushBatches(); assert.equal(total, 4);
});
test('Mongo failure retains pending batch for retry', async () => {
  failWrite = true;
  await assert.rejects(flushBatches());
  assert.equal(buffers.size, 1);
  assert.ok([...buffers.keys()][0].startsWith('analytics_pending:'));
  failWrite = false; await flushBatches(); assert.equal(total, 3);
});
test('commit followed by Redis failure does not apply batch twice', async () => {
  failDelete = true; await assert.rejects(flushBatches());
  assert.equal(total, 3);
  await flushBatches(); assert.equal(total, 3); assert.equal(buffers.size, 0);
});
test('overlapping flushes safely drain the same buffer', async () => {
  await Promise.all([flushBatches(), flushBatches()]);
  assert.equal(total, 3); assert.equal(buffers.size, 0);
});
test('work is bounded and remaining buffers are retained', async () => {
  buffers.clear();
  for (let i = 0; i < 60; i++) buffers.set(`url_stats:link${i}:2026-11-24`, { hits: '1' });
  assert.equal((await flushBatches()).processed, 50);
  assert.equal(buffers.size, 10);
});
test('endpoint rejects missing configuration and invalid auth', async () => {
  const res = { status(code) { this.code = code; return this; }, json(value) { return value; } };
  delete process.env.CRON_SECRET;
  await flushRedishStatsToMongo({ get: () => '' }, res); assert.equal(res.code, 503);
  process.env.CRON_SECRET = 'test-only';
  await flushRedishStatsToMongo({ get: () => 'Bearer wrong' }, res); assert.equal(res.code, 401);
  await flushRedishStatsToMongo({ get: () => 'Bearer test-only' }, res); assert.equal(res.code, 200);
});
