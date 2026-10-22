/** Paste into script.google.com → Deploy → New deployment → Web app (Execute as: Me, Access: Anyone).
 *  Project Settings → Script properties: add GH_TOKEN (your GitHub token) and REPO (owner/repo). */
const P = PropertiesService.getScriptProperties();
function api(path, opt) {
  return UrlFetchApp.fetch('https://api.github.com/repos/' + P.getProperty('REPO') + '/contents/' + path,
    Object.assign({ headers: { Authorization: 'Bearer ' + P.getProperty('GH_TOKEN'), Accept: 'application/vnd.github+json' }, muteHttpExceptions: true }, opt || {}));
}
function read(path) {
  const j = JSON.parse(api(path).getContentText());
  return { sha: j.sha, data: JSON.parse(Utilities.newBlob(Utilities.base64Decode(j.content.replace(/\n/g, ''))).getDataAsString()) };
}
function write(path, f, msg) {
  const r = api(path, { method: 'put', contentType: 'application/json', payload: JSON.stringify({ message: msg, sha: f.sha,
    content: Utilities.base64Encode(JSON.stringify(f.data, null, 1), Utilities.Charset.UTF_8) }) });
  if (r.getResponseCode() > 299) throw new Error('GitHub save failed');
}
const out = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
const IGN = /^[A-Za-z0-9_]{3,16}$/;
function doGet() { return out({ ok: true }); }
function doPost(e) {
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const b = JSON.parse(e.postData.contents);
    if (!IGN.test(b.ign || '')) return out({ error: 'Invalid IGN' });
    const low = b.ign.toLowerCase();
    if (b.action === 'signup') {
      const f = read('tournaments/data.json'), t = (f.data.tournaments || []).find(x => x.id === b.tid);
      if (!t || t.rounds) return out({ error: 'Registration is closed for that tournament' });
      if (t.max && t.players.length >= t.max) return out({ error: 'That tournament is full' });
      if (t.players.some(p => p.name.toLowerCase() === low)) return out({ error: 'You are already signed up' });
      t.players.push({ id: Utilities.getUuid().slice(0, 7), name: b.ign });
      write('tournaments/data.json', f, 'Sign-up: ' + b.ign); return out({ ok: true });
    }
    if (b.action === 'warmup') {
      const s = b.stats || {}, ok = (v, a, z) => typeof v === 'number' && v >= a && v <= z;
      if (!ok(s.cps, 0, 30) || !ok(s.hk, 50, 5000) || !ok(s.flick, 100, 5000) || !ok(s.react, 80, 2000)) return out({ error: 'Invalid stats' });
      s.score = Math.round(s.cps * 6 + 12000 / s.hk + 20000 / s.flick + 10000 / s.react);
      const f = read('warmup/data.json'); f.data.players = f.data.players || [];
      let p = f.data.players.find(x => x.name.toLowerCase() === low);
      if (!p) { p = { id: Utilities.getUuid().slice(0, 7), name: b.ign, hotkeys: [], days: {} }; f.data.players.push(p); }
      const day = new Date().toISOString().slice(0, 10);
      if (!p.days[day] || s.score > p.days[day].score) p.days[day] = s;
      Object.keys(p.days).sort().slice(0, -60).forEach(k => delete p.days[k]);
      write('warmup/data.json', f, 'Warmup: ' + b.ign);
      let n = 0, c = Date.now(); while (p.days[new Date(c).toISOString().slice(0, 10)]) { n++; c -= 864e5; }
      return out({ ok: true, streak: n });
    }
    return out({ error: 'Unknown action' });
  } catch (err) { return out({ error: String(err) }); } finally { lock.releaseLock(); }
}
