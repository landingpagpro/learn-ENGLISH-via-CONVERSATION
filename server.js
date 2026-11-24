// server.ts
import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var PORT = Number(process.env.PORT) || 3e3;
var isProd = process.env.NODE_ENV === "production";
var isVercel = Boolean(process.env.VERCEL);
var LINKS_STORE_PATH = path.join(os.tmpdir(), "impara-italiano-parlando-links.json");
function normalizeOriginUrl(raw) {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim().replace(/^["']|["']$/g, "").trim();
  if (!trimmed || trimmed === "MY_APP_URL") return null;
  try {
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withScheme);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (!parsed.hostname || !/^[a-zA-Z0-9.-]+$/.test(parsed.hostname)) return null;
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
}
function isFreeHostingHost(hostname) {
  const h = hostname.toLowerCase();
  return h.endsWith(".onrender.com") || h.endsWith(".vercel.app") || h.endsWith(".run.app") || h.endsWith(".netlify.app") || h.endsWith(".railway.app") || h.endsWith(".fly.dev") || h.endsWith(".web.app") || h.endsWith(".firebaseapp.com");
}
function isCustomDomainHost(hostname) {
  const h = hostname.toLowerCase();
  if (!h || h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0") return false;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) return false;
  if (isFreeHostingHost(h)) return false;
  return h.includes(".");
}
function loadSavedLinks() {
  let stored = {};
  try {
    if (fs.existsSync(LINKS_STORE_PATH)) {
      stored = JSON.parse(fs.readFileSync(LINKS_STORE_PATH, "utf8"));
    }
  } catch {
  }
  let freeUrl = normalizeOriginUrl(process.env.FREE_APP_URL) || normalizeOriginUrl(stored.freeUrl);
  let domainUrl = normalizeOriginUrl(process.env.CUSTOM_DOMAIN) || normalizeOriginUrl(stored.domainUrl);
  const appUrl = normalizeOriginUrl(process.env.APP_URL);
  if (appUrl) {
    try {
      const host = new URL(appUrl).hostname;
      if (isFreeHostingHost(host) && !freeUrl) freeUrl = appUrl;
      else if (isCustomDomainHost(host) && !domainUrl) domainUrl = appUrl;
    } catch {
    }
  }
  return {
    freeUrl: freeUrl || null,
    domainUrl: domainUrl || null,
    updatedAt: typeof stored.updatedAt === "number" ? stored.updatedAt : Date.now()
  };
}
var savedLinks = loadSavedLinks();
function persistSavedLinks() {
  try {
    fs.writeFileSync(LINKS_STORE_PATH, JSON.stringify(savedLinks), "utf8");
  } catch {
  }
}
function getValidatedRequestOrigin(req) {
  const rawHost = String(req.get("x-forwarded-host") || req.get("host") || "").split(",")[0].trim();
  if (!rawHost || !/^[a-zA-Z0-9.-]+(:\d{1,5})?$/.test(rawHost)) {
    return null;
  }
  const rawProto = String(req.get("x-forwarded-proto") || req.protocol || "https").split(",")[0].trim().toLowerCase();
  const hostnameOnly = rawHost.split(":")[0];
  const proto = isFreeHostingHost(hostnameOnly) ? "https" : rawProto === "http" || rawProto === "https" ? rawProto : "https";
  return `${proto}://${rawHost}`;
}
function recordActiveLinkFromRequest(req) {
  const origin = getValidatedRequestOrigin(req);
  if (!origin) return null;
  try {
    const hostname = new URL(origin).hostname;
    let changed = false;
    if (isFreeHostingHost(hostname) && savedLinks.freeUrl !== origin) {
      savedLinks.freeUrl = origin;
      changed = true;
    } else if (isCustomDomainHost(hostname) && savedLinks.domainUrl !== origin) {
      savedLinks.domainUrl = origin;
      changed = true;
    }
    if (changed) {
      savedLinks.updatedAt = Date.now();
      persistSavedLinks();
    }
  } catch {
  }
  return origin;
}
function collectApiKeys() {
  const rawSources = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEYS,
    process.env.GEMINI_BACKUP_API_KEY
  ];
  for (let i = 1; i <= 20; i++) {
    rawSources.push(process.env[`GEMINI_API_KEY_${i}`]);
  }
  const seen = /* @__PURE__ */ new Set();
  const keys = [];
  for (const src of rawSources) {
    if (!src) continue;
    for (const part of src.split(/[\s,;]+/)) {
      const cleaned = part.trim().replace(/^["']|["']$/g, "").trim();
      if (!cleaned || cleaned === "MY_GEMINI_API_KEY" || seen.has(cleaned)) continue;
      seen.add(cleaned);
      keys.push(cleaned);
    }
  }
  return keys;
}
var clientByKey = /* @__PURE__ */ new Map();
var modelCooldownUntil = /* @__PURE__ */ new Map();
var invalidKeyUntil = /* @__PURE__ */ new Map();
var lastSuccessAt = /* @__PURE__ */ new Map();
var keyRoundRobinCursor = 0;
function getClientForKey(apiKey) {
  let client = clientByKey.get(apiKey);
  if (!client) {
    client = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        },
        retryOptions: {
          attempts: 1
        }
      }
    });
    clientByKey.set(apiKey, client);
  }
  return client;
}
function isQuotaError(err) {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota");
}
function isAuthError(err) {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("API_KEY_INVALID") || msg.includes("API key not valid") || msg.includes("PERMISSION_DENIED") || msg.includes("403") || msg.includes("401");
}
function isTimeoutError(err) {
  const msg = err instanceof Error ? `${err.name} ${err.message}` : String(err);
  return /timeout|deadline_exceeded|abort/i.test(msg);
}
function isRetryableError(err) {
  const msg = err instanceof Error ? err.message : String(err);
  return isQuotaError(err) || isTimeoutError(err) || msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("NOT_FOUND") || msg.includes("404");
}
function markKeyModelSuccess(apiKey, model) {
  const pair = `${apiKey}:${model}`;
  modelCooldownUntil.delete(pair);
  invalidKeyUntil.delete(apiKey);
  lastSuccessAt.set(pair, Date.now());
}
function markKeyModelOutcomeError(apiKey, model, err) {
  const now = Date.now();
  const msg = err instanceof Error ? err.message : String(err);
  const pair = `${apiKey}:${model}`;
  const wasProven = (lastSuccessAt.get(pair) || 0) > 0;
  if (isAuthError(err)) {
    invalidKeyUntil.set(apiKey, now + 10 * 6e4);
    return;
  }
  if (isQuotaError(err)) {
    const isDaily = /perday|daily|rpd|limit:\s*0/i.test(msg);
    modelCooldownUntil.set(pair, now + (isDaily ? 15 * 6e4 : wasProven ? 25e3 : 65e3));
    return;
  }
  if (isTimeoutError(err)) {
    modelCooldownUntil.set(pair, now + (wasProven ? 15e3 : 12e4));
    return;
  }
  if (msg.includes("503") || msg.includes("UNAVAILABLE")) {
    modelCooldownUntil.set(pair, now + (wasProven ? 12e3 : 3e4));
  }
}
function getOrderedCandidates(models, maxCandidates = 6) {
  const keys = collectApiKeys();
  if (keys.length === 0) {
    throw new Error("MISSING_GEMINI_API_KEY");
  }
  const startIdx = keyRoundRobinCursor % keys.length;
  keyRoundRobinCursor = (keyRoundRobinCursor + 1) % keys.length;
  const rotatedKeys = [...keys.slice(startIdx), ...keys.slice(0, startIdx)];
  const now = Date.now();
  const healthyByModel = models.map(() => []);
  const cooling = [];
  for (let mIdx = 0; mIdx < models.length; mIdx++) {
    const model = models[mIdx];
    for (let kIdx = 0; kIdx < rotatedKeys.length; kIdx++) {
      const apiKey = rotatedKeys[kIdx];
      const deadUntil = invalidKeyUntil.get(apiKey) || 0;
      if (deadUntil > now) continue;
      const pair = `${apiKey}:${model}`;
      const coolUntil = modelCooldownUntil.get(pair) || 0;
      const client = getClientForKey(apiKey);
      if (coolUntil <= now) {
        const recentSuccess = lastSuccessAt.get(pair) || 0;
        const score = (recentSuccess > 0 ? 1e3 : 0) - mIdx * 100 - kIdx;
        healthyByModel[mIdx].push({ apiKey, client, model, score });
      } else {
        cooling.push({ apiKey, client, model, until: coolUntil });
      }
    }
    healthyByModel[mIdx].sort((a, b) => b.score - a.score);
  }
  const picked = [];
  const pickedSet = /* @__PURE__ */ new Set();
  const addCandidate = (c) => {
    const pair = `${c.apiKey}:${c.model}`;
    if (pickedSet.has(pair) || picked.length >= maxCandidates) return false;
    pickedSet.add(pair);
    picked.push(c);
    return true;
  };
  if (models.length === 1) {
    for (const c of healthyByModel[0]) {
      if (!addCandidate(c) && picked.length >= maxCandidates) break;
    }
  } else {
    const fallbackReserve = Math.min(models.length - 1, Math.max(1, Math.floor(maxCandidates / 3)));
    const primaryQuota = Math.max(1, maxCandidates - fallbackReserve);
    for (const c of healthyByModel[0].slice(0, primaryQuota)) {
      addCandidate(c);
    }
    for (let mIdx = 1; mIdx < models.length && picked.length < maxCandidates; mIdx++) {
      const fallbackSlice = mIdx === 1 ? healthyByModel[mIdx].slice(0, 2) : healthyByModel[mIdx].slice(0, 1);
      for (const c of fallbackSlice) {
        addCandidate(c);
      }
    }
    for (let mIdx = 0; mIdx < models.length && picked.length < maxCandidates; mIdx++) {
      for (const c of healthyByModel[mIdx]) {
        addCandidate(c);
      }
    }
  }
  if (picked.length > 0) {
    picked.sort((a, b) => b.score - a.score);
    return picked.map(({ apiKey, client, model }) => ({ apiKey, client, model }));
  }
  cooling.sort((a, b) => {
    const aProven = lastSuccessAt.get(`${a.apiKey}:${a.model}`) || 0;
    const bProven = lastSuccessAt.get(`${b.apiKey}:${b.model}`) || 0;
    if (aProven > 0 !== bProven > 0) return bProven - aProven;
    return a.until - b.until;
  });
  if (cooling.length > 0) {
    return cooling.slice(0, Math.min(4, cooling.length)).map(({ apiKey, client, model }) => ({
      apiKey,
      client,
      model
    }));
  }
  return [{ apiKey: keys[0], client: getClientForKey(keys[0]), model: models[0] }];
}
async function runWithFallback(models, runner) {
  const candidates = getOrderedCandidates(models, 6);
  let lastErr = null;
  let lastQuotaErr = null;
  let sawUpstream503 = false;
  for (const candidate of candidates) {
    try {
      const result = await runner(candidate.client, candidate.model);
      markKeyModelSuccess(candidate.apiKey, candidate.model);
      return result;
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (isQuotaError(err)) {
        lastQuotaErr = err;
      } else if (msg.includes("503") || msg.includes("UNAVAILABLE")) {
        sawUpstream503 = true;
      }
      markKeyModelOutcomeError(candidate.apiKey, candidate.model, err);
      if (!isRetryableError(err) && !isAuthError(err) && !isTimeoutError(err)) {
        throw err;
      }
    }
  }
  if (!sawUpstream503 && lastQuotaErr) {
    throw lastQuotaErr;
  }
  throw lastErr || new Error("AI request failed");
}
function getAiClient() {
  const keys = collectApiKeys();
  if (keys.length === 0) {
    throw new Error("MISSING_GEMINI_API_KEY");
  }
  const now = Date.now();
  const active = keys.find((k) => (invalidKeyUntil.get(k) || 0) <= now) || keys[0];
  return getClientForKey(active);
}
var translationCache = /* @__PURE__ */ new Map();
function getCachedTranslation(key) {
  return translationCache.get(key);
}
function setCachedTranslation(key, value) {
  if (translationCache.size >= 400) {
    const oldest = translationCache.keys().next().value;
    if (oldest !== void 0) translationCache.delete(oldest);
  }
  translationCache.set(key, value);
}
var ttsPcmCache = /* @__PURE__ */ new Map();
function getCachedTtsPcm(key) {
  return ttsPcmCache.get(key);
}
function setCachedTtsPcm(key, buf) {
  if (buf.byteLength > 35e4) return;
  if (ttsPcmCache.size >= 80) {
    const oldest = ttsPcmCache.keys().next().value;
    if (oldest !== void 0) ttsPcmCache.delete(oldest);
  }
  ttsPcmCache.set(key, buf);
}
function formatServerError(err, fallbackMsg) {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes("MISSING_GEMINI_API_KEY")) {
    return {
      status: 503,
      message: "GEMINI_API_KEY is missing in environment variables."
    };
  }
  if (raw.includes("API_KEY_INVALID") || raw.includes("API key not valid") || raw.includes("PERMISSION_DENIED") || raw.includes("403") || raw.includes("401")) {
    return {
      status: 401,
      message: "Chiave GEMINI_API_KEY non valida o scaduta. Controlla Settings > Secrets."
    };
  }
  if (raw.includes("429") || raw.includes("RESOURCE_EXHAUSTED")) {
    return {
      status: 429,
      message: "Limite della chiave API raggiunto. Attendi un attimo o verifica la chiave in Settings > Secrets."
    };
  }
  if (raw.includes("NOT_FOUND") || raw.includes("404")) {
    return {
      status: 502,
      message: "AI model unavailable for this API key."
    };
  }
  if (/timeout|503|unavailable|abort/i.test(raw)) {
    return {
      status: 503,
      message: "Server momentaneamente occupato. Tocca Riprova."
    };
  }
  return {
    status: 500,
    message: fallbackMsg
  };
}
var SCENARIO_CONTEXT = {
  conversation: "Open everyday Italian conversation on any topic the learner chooses. Keep the tone warm, natural, and engaging.",
  airport: "At an Italian international airport (check-in desk, security, boarding gate, baggage claim). Act as a helpful travel partner or airport staff member.",
  work: "At a modern Italian workplace. Act as a friendly coworker chatting before a meeting, discussing tasks, deadlines, and teamwork.",
  doctor: "At a medical clinic in Italy. Act as a warm, reassuring doctor asking about symptoms and explaining next steps clearly.",
  meeting: "Meeting someone new at a casual Italian caf\xE9 or social gathering. Act as a friendly conversation partner who enjoys making new friends."
};
var LEVEL_INSTRUCTIONS = {
  beginner: "BEGINNER (A1-A2): Use very simple, high-frequency Italian words and short sentences (1-2 short sentences max). Avoid complex idioms or slang. Speak gently and patiently.",
  intermediate: "INTERMEDIATE (B1-B2): Use natural everyday conversational Italian, common expressions, and 2-3 friendly sentences. Ask engaging follow-up questions.",
  advanced: "ADVANCED (C1-C2): Use authentic, idiomatic Italian with natural expressions, subtle humor, and rich conversational depth."
};
var app = express();
app.set("trust proxy", true);
app.use((req, res, next) => {
  const currentOrigin = recordActiveLinkFromRequest(req);
  const reqOrigin = req.headers.origin;
  if (reqOrigin && (reqOrigin === currentOrigin || reqOrigin === savedLinks.freeUrl || reqOrigin === savedLinks.domainUrl)) {
    res.setHeader("Access-Control-Allow-Origin", reqOrigin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  return next();
});
app.use((req, _res, next) => {
  const r = req;
  if (r.body !== void 0 && !Buffer.isBuffer(r.body)) {
    r._body = true;
  }
  next();
});
app.use(express.json({ limit: "15mb" }));
app.get(["/ads.txt", "/app-ads.txt"], (req, res, next) => {
  const filename = req.path.replace(/^\/+/, "");
  const candidates = [
    path.resolve(__dirname, filename),
    path.resolve(process.cwd(), filename),
    path.resolve(__dirname, "public", filename),
    path.resolve(process.cwd(), "public", filename)
  ];
  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      res.type("text/plain");
      res.setHeader("Cache-Control", "public, max-age=3600");
      return res.sendFile(filePath);
    }
  }
  return next();
});
app.get("/robots.txt", (_req, res) => {
  res.type("text/plain");
  res.send("User-agent: *\nAllow: /\n");
});
app.get("/api/links", (req, res) => {
  const currentUrl = recordActiveLinkFromRequest(req);
  res.json({
    freeUrl: savedLinks.freeUrl,
    domainUrl: savedLinks.domainUrl,
    currentUrl,
    updatedAt: savedLinks.updatedAt
  });
});
app.get("/api/health", (req, res) => {
  const currentUrl = recordActiveLinkFromRequest(req);
  const keys = collectApiKeys();
  const apiConfigured = keys.length > 0;
  if (apiConfigured) {
    try {
      getAiClient();
    } catch {
    }
  }
  res.json({
    status: "ok",
    app: "impara-italiano-parlando",
    partner: "Marco",
    language: "it-IT",
    apiConfigured,
    keysConfigured: keys.length,
    links: {
      freeUrl: savedLinks.freeUrl,
      domainUrl: savedLinks.domainUrl,
      currentUrl
    }
  });
});
function parseStreamedSections(raw) {
  const extract = (tag, nextTags) => {
    const idx = raw.indexOf(tag);
    if (idx === -1) return "";
    const start = idx + tag.length;
    let end = raw.length;
    for (const nt of nextTags) {
      const nIdx = raw.indexOf(nt, start);
      if (nIdx !== -1 && nIdx < end) {
        end = nIdx;
      }
    }
    return raw.slice(start, end).trim();
  };
  const replyItalianRaw = extract("[REPLY]", ["[MISTAKE]", "[CORRECTED]", "[EXPLAIN]", "[TRANS]", "[HINT]"]);
  const replyItalian = replyItalianRaw || (raw.indexOf("[REPLY]") === -1 ? raw.split(/\[(?:MISTAKE|CORRECTED|EXPLAIN|TRANS|HINT)\]/)[0].trim() : "");
  const mistakeFlag = extract("[MISTAKE]", ["[CORRECTED]", "[EXPLAIN]", "[TRANS]", "[HINT]"]).toUpperCase();
  const correctedItalian = extract("[CORRECTED]", ["[EXPLAIN]", "[TRANS]", "[HINT]"]);
  const explanation = extract("[EXPLAIN]", ["[TRANS]", "[HINT]"]);
  const replyTranslation = extract("[TRANS]", ["[HINT]"]);
  const suggestedNextReply = extract("[HINT]", []);
  const hasMistake = mistakeFlag.startsWith("YES") || mistakeFlag.startsWith("TRUE") || correctedItalian.length > 0 && correctedItalian.toLowerCase() !== "none";
  return {
    hasMistake,
    correctedItalian: hasMistake && correctedItalian.toLowerCase() !== "none" ? correctedItalian : "",
    explanation: hasMistake && explanation.toLowerCase() !== "none" ? explanation : "",
    replyItalian,
    replyTranslation,
    suggestedNextReply
  };
}
function buildChatPrompts(scenarioId, level, history, userMessage) {
  const scenarioInfo = SCENARIO_CONTEXT[scenarioId] || SCENARIO_CONTEXT.conversation;
  const levelInfo = LEVEL_INSTRUCTIONS[level] || LEVEL_INSTRUCTIONS.beginner;
  const formattedHistory = (history || []).slice(-2).map((m) => `${m.sender === "user" ? "L" : "P"}: ${String(m.text || "").slice(0, 160)}`).join("\n");
  const safeMessage = userMessage.trim().slice(0, 1e3);
  const prompt = `${formattedHistory ? `${formattedHistory}
` : ""}L: "${safeMessage}"`;
  return { scenarioInfo, levelInfo, prompt };
}
app.post("/api/chat/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Content-Encoding", "identity");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();
  res.write(`: connected ${" ".repeat(1024)}

`);
  res.write(`data: ${JSON.stringify({ type: "start" })}

`);
  let clientClosed = false;
  res.on("close", () => {
    if (!res.writableEnded) {
      clientClosed = true;
    }
  });
  try {
    const { scenarioId, level, history, userMessage, targetLanguageName } = req.body;
    if (!userMessage || typeof userMessage !== "string" || !userMessage.trim()) {
      res.write(`data: ${JSON.stringify({ type: "error", status: 400, error: "Inserisci un messaggio." })}

`);
      return res.end();
    }
    const { scenarioInfo, levelInfo, prompt } = buildChatPrompts(scenarioId, level, history, userMessage);
    const transLang = targetLanguageName?.trim();
    const transMarkerInstruction = transLang ? `[TRANS]
Natural translation of the reply into ${transLang}
` : "";
    const systemInstruction = `You are Marco in "Impara l'Italiano Parlando".
Context: ${scenarioInfo}
Level: ${levelInfo}
ALWAYS write your reply, correction, explanation, and hint strictly in Italian (never reply in English or any other language).
Reply immediately with 1 short sentence in natural Italian + 1 short question (max 25 words total, no [REPLY] tag). Then append only:
[MISTAKE]
YES or NO (omit [CORRECTED] and [EXPLAIN] if NO)
[CORRECTED]
Natural corrected Italian sentence (if YES)
[EXPLAIN]
1 short tip in simple Italian (max 15 words, if YES)
${transMarkerInstruction}[HINT]
1 short reply idea in Italian (max 12 words)`;
    const withTimeout = (promise, ms, label) => {
      let timer;
      const timeoutPromise = new Promise((_resolve, reject) => {
        timer = setTimeout(() => reject(new Error(`Timeout (${ms}ms): ${label}`)), ms);
      });
      return Promise.race([
        promise.finally(() => clearTimeout(timer)),
        timeoutPromise
      ]);
    };
    let fullText = "";
    let lastSentReply = "";
    let replyCompletedSent = false;
    let succeeded = false;
    const keepaliveInterval = setInterval(() => {
      if (!clientClosed && !res.writableEnded) {
        res.write(": ping\n\n");
      }
    }, 1e3);
    let activeIter = null;
    try {
      const candidates = getOrderedCandidates(["gemini-4-hydrogen", "gemini-3.1-flash-lite"], 6);
      let winner = null;
      let lastStreamErr = null;
      let lastQuotaStreamErr = null;
      let sawUpstream503 = false;
      for (const candidate of candidates) {
        if (clientClosed) break;
        const thinkingLevel = candidate.model === "gemini-3.1-flash-lite" ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW;
        const attemptMs = candidate.model === "gemini-4-hydrogen" ? 7500 : 5e3;
        const abortController = new AbortController();
        const attemptTimer = setTimeout(() => abortController.abort(), attemptMs);
        try {
          const stream = await withTimeout(
            candidate.client.models.generateContentStream({
              model: candidate.model,
              contents: prompt,
              config: {
                systemInstruction,
                thinkingConfig: { thinkingLevel },
                abortSignal: abortController.signal
              }
            }),
            attemptMs,
            `${candidate.model} stream open`
          );
          const iter = stream[Symbol.asyncIterator]();
          let firstStep = await withTimeout(iter.next(), attemptMs, `${candidate.model} first chunk`);
          while (!firstStep.done && !(firstStep.value?.text ?? "")) {
            if (clientClosed) {
              iter.return?.().catch(() => {
              });
              break;
            }
            firstStep = await withTimeout(iter.next(), attemptMs, `${candidate.model} next chunk`);
          }
          clearTimeout(attemptTimer);
          if (clientClosed) break;
          if (firstStep.done) {
            iter.return?.().catch(() => {
            });
            throw new Error("Empty stream response.");
          }
          markKeyModelSuccess(candidate.apiKey, candidate.model);
          winner = { iter, firstStep };
          break;
        } catch (err) {
          clearTimeout(attemptTimer);
          lastStreamErr = err;
          const errMsg = err instanceof Error ? err.message : String(err);
          if (isQuotaError(err)) {
            lastQuotaStreamErr = err;
          } else if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE")) {
            sawUpstream503 = true;
          }
          markKeyModelOutcomeError(candidate.apiKey, candidate.model, err);
          if (!isRetryableError(err) && !isAuthError(err) && !isTimeoutError(err)) {
            throw err;
          }
        }
      }
      if (!clientClosed && !winner) {
        if (!sawUpstream503 && lastQuotaStreamErr) {
          throw lastQuotaStreamErr;
        }
        throw lastStreamErr || new Error("Service temporarily busy.");
      }
      if (winner) {
        activeIter = winner.iter;
        let step = winner.firstStep;
        while (!step.done) {
          if (clientClosed) break;
          const chunk = step.value;
          const piece = chunk.text ?? "";
          if (piece) {
            fullText += piece;
            const replyStart = fullText.indexOf("[REPLY]");
            let afterTag = replyStart !== -1 ? fullText.slice(replyStart + "[REPLY]".length) : fullText;
            const nextMarkerIdx = afterTag.search(/\n?\[(?:MISTAKE|CORRECTED|EXPLAIN|TRANS|HINT)\]/);
            if (nextMarkerIdx !== -1) {
              afterTag = afterTag.slice(0, nextMarkerIdx);
              const finalReplyChunk = afterTag.replace(/^\s+/, "").trim();
              if (!replyCompletedSent && finalReplyChunk) {
                replyCompletedSent = true;
                lastSentReply = finalReplyChunk;
                res.write(`data: ${JSON.stringify({ type: "reply_complete", replyItalian: finalReplyChunk })}

`);
              }
            } else {
              afterTag = afterTag.replace(/\n?\[(?:R|RE|REP|REPL|REPLY|M|MI|MIS|MIST|MISTA|MISTAK|MISTAKE|C|CO|H|HI|T|TR|E|EX)?$/i, "");
              const cleanReply = afterTag.replace(/^\s+/, "");
              if (cleanReply && cleanReply.length > lastSentReply.length && cleanReply.startsWith(lastSentReply)) {
                const delta = cleanReply.slice(lastSentReply.length);
                lastSentReply = cleanReply;
                res.write(`data: ${JSON.stringify({ type: "reply_delta", delta })}

`);
              } else if (cleanReply && cleanReply !== lastSentReply) {
                lastSentReply = cleanReply;
                res.write(`data: ${JSON.stringify({ type: "reply", replyItalian: cleanReply })}

`);
              }
            }
          }
          step = await withTimeout(activeIter.next(), 9e3, "chat stream next chunk");
        }
        succeeded = true;
      }
    } catch (err) {
      activeIter?.return?.().catch(() => {
      });
      if (!clientClosed) {
        throw err;
      }
    } finally {
      clearInterval(keepaliveInterval);
    }
    if (clientClosed) {
      return res.end();
    }
    if (!succeeded) {
      throw new Error("Service temporarily busy.");
    }
    const parsed = parseStreamedSections(fullText);
    if (!parsed.replyItalian && lastSentReply) {
      parsed.replyItalian = lastSentReply;
    }
    res.write(`data: ${JSON.stringify({ type: "done", ...parsed })}

`);
    return res.end();
  } catch (err) {
    console.error("Chat stream error:", err);
    const { status, message } = formatServerError(
      err,
      "Connessione momentaneamente non riuscita. Riprova."
    );
    res.write(`data: ${JSON.stringify({ type: "error", status, error: message })}

`);
    return res.end();
  }
});
app.post("/api/chat", async (req, res) => {
  try {
    const { scenarioId, level, history, userMessage, targetLanguageName } = req.body;
    if (!userMessage || typeof userMessage !== "string" || !userMessage.trim()) {
      return res.status(400).json({ error: "Inserisci un messaggio." });
    }
    const { scenarioInfo, levelInfo, prompt } = buildChatPrompts(scenarioId, level, history, userMessage);
    const transLang = targetLanguageName?.trim();
    const systemInstruction = `You are Marco, a friendly native Italian conversation partner in "Impara l'Italiano Parlando".
Context: ${scenarioInfo}
Level: ${levelInfo}
ALWAYS write replyItalian, correctedItalian, explanation, and suggestedNextReply strictly in Italian (never reply in English or any other language).
Reply immediately in natural Italian (1 short sentence + 1 short question, max 25 words, in replyItalian). Set hasMistake=true only for real mistakes or non-Italian words, and provide correctedItalian + 1 brief tip in simple Italian (max 15 words, in explanation). Always provide suggestedNextReply in natural Italian (max 12 words).${transLang ? ` Also provide replyTranslation of replyItalian in ${transLang}.` : ""}`;
    const schemaProperties = {
      replyItalian: { type: Type.STRING },
      hasMistake: { type: Type.BOOLEAN },
      correctedItalian: { type: Type.STRING },
      explanation: { type: Type.STRING },
      suggestedNextReply: { type: Type.STRING }
    };
    const requiredFields = [
      "replyItalian",
      "hasMistake",
      "correctedItalian",
      "explanation",
      "suggestedNextReply"
    ];
    if (transLang) {
      schemaProperties.replyTranslation = { type: Type.STRING };
      requiredFields.push("replyTranslation");
    }
    const raceTimeout = (promise, ms) => {
      let timer;
      return Promise.race([
        promise.finally(() => clearTimeout(timer)),
        new Promise((_resolve, reject) => {
          timer = setTimeout(() => reject(new Error("Request timeout")), ms);
        })
      ]);
    };
    const response = await runWithFallback(
      ["gemini-4-hydrogen", "gemini-3.1-flash-lite"],
      (client, model) => {
        const ms = model === "gemini-4-hydrogen" ? 7500 : 5e3;
        const abortController = new AbortController();
        return raceTimeout(
          client.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction,
              thinkingConfig: {
                thinkingLevel: model === "gemini-3.1-flash-lite" ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW
              },
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: schemaProperties,
                required: requiredFields
              },
              abortSignal: abortController.signal
            }
          }),
          ms
        ).catch((e) => {
          abortController.abort();
          throw e;
        });
      }
    );
    const parsed = JSON.parse((response.text ?? "{}").trim());
    return res.json(parsed);
  } catch (err) {
    console.error("Chat error:", err);
    const { status, message } = formatServerError(
      err,
      "Server momentaneamente occupato. Tocca Riprova."
    );
    return res.status(status).json({ error: message });
  }
});
app.post("/api/phrases", async (req, res) => {
  try {
    const { scenarioId, level, recentMessages } = req.body;
    getAiClient();
    const scenarioInfo = SCENARIO_CONTEXT[scenarioId] || SCENARIO_CONTEXT.conversation;
    const levelInfo = LEVEL_INSTRUCTIONS[level] || LEVEL_INSTRUCTIONS.beginner;
    const contextLines = (recentMessages || []).slice(-4).map((m) => `${m.sender === "user" ? "Learner" : "Marco"}: ${String(m.text || "").slice(0, 300)}`).join("\n");
    const response = await runWithFallback(
      ["gemini-4-hydrogen", "gemini-3.1-flash-lite"],
      (client, model) => {
        const abortController = new AbortController();
        const timer = setTimeout(() => abortController.abort(), 7500);
        return client.models.generateContent({
          model,
          contents: `Generate 5 practical spoken Italian phrases to use in this conversation.
Scenario: ${scenarioInfo}
Level: ${levelInfo}
Recent chat:
${contextLines || "Start"}`,
          config: {
            systemInstruction: "You are a friendly native Italian tutor. Return exactly 5 useful spoken Italian phrases suited to the context and level, each with a brief meaning in simple Italian (meaning) and 1 short usage tip in simple Italian (usageNote).",
            thinkingConfig: {
              thinkingLevel: model === "gemini-3.1-flash-lite" ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW
            },
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  italian: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  usageNote: { type: Type.STRING }
                },
                required: ["italian", "meaning", "usageNote"]
              }
            },
            abortSignal: abortController.signal
          }
        }).finally(() => clearTimeout(timer));
      }
    );
    const items = JSON.parse((response.text ?? "[]").trim());
    const phrases = items.slice(0, 5).map((item, idx) => ({
      id: `gen-${Date.now()}-${idx}`,
      italian: item.italian,
      meaning: item.meaning,
      usageNote: item.usageNote,
      memorized: false
    }));
    return res.json({ phrases });
  } catch (err) {
    console.error("Phrases error:", err);
    const { status, message } = formatServerError(
      err,
      "Impossibile generare nuove frasi al momento. Riprova."
    );
    return res.status(status).json({ error: message });
  }
});
app.post("/api/tts/stream", async (req, res) => {
  try {
    const { text, level, slow } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text is required for speech." });
    }
    getAiClient();
    const shouldSpeakSlow = Boolean(slow);
    const trimmedText = text.trim().slice(0, 1500);
    const cacheKey = `${shouldSpeakSlow ? "slow" : level || "beginner"}:${trimmedText}`;
    const cachedPcm = getCachedTtsPcm(cacheKey);
    if (cachedPcm) {
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Cache-Control", "no-cache");
      return res.end(cachedPcm);
    }
    const style = shouldSpeakSlow ? "Speak strictly in clear, warm standard Italian (it-IT) gently at a comfortable pace for a learner." : level === "beginner" ? "Speak strictly in clear, warm standard Italian (it-IT) at a natural, steady pace." : "Friendly, articulate native Italian (it-IT) speaker at a natural conversational pace.";
    let ttsClientClosed = false;
    res.on("close", () => {
      if (!res.writableEnded) {
        ttsClientClosed = true;
      }
    });
    const candidates = getOrderedCandidates(["gemini-3.8-flash-lite-tts"]);
    let headersFlushed = false;
    let lastTtsErr = null;
    for (const candidate of candidates) {
      if (ttsClientClosed) break;
      try {
        const responseStream = await candidate.client.models.generateContentStream({
          model: candidate.model,
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: trimmedText,
                  speechMetadata: { style }
                }
              ]
            }
          ],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Puck" }
              }
            }
          }
        });
        const collected = [];
        for await (const chunk of responseStream) {
          if (ttsClientClosed) break;
          const data = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (data) {
            const buf = Buffer.from(data, "base64");
            if (!headersFlushed) {
              headersFlushed = true;
              res.setHeader("Content-Type", "application/octet-stream");
              res.setHeader("Cache-Control", "no-cache");
              res.flushHeaders?.();
            }
            collected.push(buf);
            res.write(buf);
          }
        }
        if (headersFlushed) {
          if (!ttsClientClosed && trimmedText.length <= 220 && collected.length > 0) {
            setCachedTtsPcm(cacheKey, Buffer.concat(collected));
          }
          return res.end();
        }
        throw new Error("No audio chunks returned from TTS model.");
      } catch (err) {
        lastTtsErr = err;
        markKeyModelOutcomeError(candidate.apiKey, candidate.model, err);
        if (headersFlushed || !isRetryableError(err) && !isAuthError(err)) {
          throw err;
        }
      }
    }
    if (!headersFlushed && !res.headersSent) {
      if (lastTtsErr) throw lastTtsErr;
      return res.status(502).json({ error: "No audio chunks returned from TTS model." });
    }
    return res.end();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("TTS stream error:", msg);
    if (!res.headersSent) {
      const isQuota = isQuotaError(err);
      return res.status(isQuota ? 429 : 500).json({ error: "Failed to stream speech audio." });
    }
    return res.end();
  }
});
app.post("/api/tts", async (req, res) => {
  try {
    const { text, level, slow } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text is required for speech." });
    }
    getAiClient();
    const shouldSpeakSlow = Boolean(slow);
    const trimmedText = text.trim().slice(0, 1500);
    const style = shouldSpeakSlow ? "Speak strictly in clear, warm standard Italian (it-IT) gently at a comfortable pace for a learner." : level === "beginner" ? "Speak strictly in clear, warm standard Italian (it-IT) at a natural, steady pace." : "Friendly, articulate native Italian (it-IT) speaker at a natural conversational pace.";
    const response = await runWithFallback(
      ["gemini-3.8-flash-lite-tts"],
      (client, model) => client.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              {
                text: trimmedText,
                speechMetadata: { style }
              }
            ]
          }
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Puck" }
            }
          }
        }
      })
    );
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: "No audio returned from TTS model." });
    }
    return res.json({ audioBase64: base64Audio, mimeType: "audio/wav" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("TTS error:", msg);
    const isQuota = isQuotaError(err);
    return res.status(isQuota ? 429 : 500).json({ error: "Failed to synthesize speech audio." });
  }
});
app.post("/api/transcribe", async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;
    if (!audioBase64 || typeof audioBase64 !== "string") {
      return res.status(400).json({ error: "Audio data is required." });
    }
    getAiClient();
    const cleanMime = (mimeType || "audio/webm").split(";")[0];
    const response = await runWithFallback(
      ["gemini-3.5-transcribe", "gemini-4-hydrogen", "gemini-3.1-flash-lite"],
      (client, model) => client.models.generateContent({
        model,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: cleanMime,
                data: audioBase64
              }
            },
            {
              text: "Transcribe the spoken audio accurately in the exact language spoken (likely Italian or mixed with another language). Return ONLY the transcribed text without quotes or commentary. If the audio is silent or unintelligible, return an empty string."
            }
          ]
        }
      })
    );
    return res.json({ text: (response.text ?? "").trim() });
  } catch (err) {
    console.error("Transcribe error:", err);
    const { status, message } = formatServerError(err, "Impossibile trascrivere la voce.");
    return res.status(status).json({ error: message });
  }
});
app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLanguageName } = req.body;
    if (!text || !targetLanguageName || typeof text !== "string" || typeof targetLanguageName !== "string") {
      return res.status(400).json({ error: "Text and target language are required." });
    }
    getAiClient();
    const trimmedText = text.trim().slice(0, 2e3);
    const langName = targetLanguageName.trim().slice(0, 80);
    const cacheKey = `${langName.toLowerCase()}::${trimmedText}`;
    const cached = getCachedTranslation(cacheKey);
    if (cached) {
      return res.json({ translation: cached });
    }
    const systemInstruction = `Translate the user's Italian text accurately and naturally into ${langName}. Return ONLY the translated text with no quotes, labels, or commentary.`;
    const raceTimeout = (promise, ms) => {
      let timer;
      return Promise.race([
        promise.finally(() => clearTimeout(timer)),
        new Promise((_resolve, reject) => {
          timer = setTimeout(() => reject(new Error("Translation timeout")), ms);
        })
      ]);
    };
    const response = await runWithFallback(
      ["gemini-4-hydrogen", "gemini-3.1-flash-lite"],
      (client, model) => {
        const abortController = new AbortController();
        return raceTimeout(
          client.models.generateContent({
            model,
            contents: trimmedText,
            config: {
              systemInstruction,
              thinkingConfig: {
                thinkingLevel: model === "gemini-3.1-flash-lite" ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW
              },
              abortSignal: abortController.signal
            }
          }),
          model === "gemini-4-hydrogen" ? 7500 : 5e3
        ).catch((e) => {
          abortController.abort();
          throw e;
        });
      }
    );
    const translation = (response.text ?? "").trim();
    if (translation) {
      setCachedTranslation(cacheKey, translation);
    }
    return res.json({ translation });
  } catch (err) {
    console.error("Translate error:", err);
    const { status, message } = formatServerError(
      err,
      "Traduzione momentaneamente non disponibile. Riprova."
    );
    return res.status(status).json({ error: message });
  }
});
var LOGO_FILES = {
  english: "english-logo.jpg",
  italian: "italian-logo.jpg",
  french: "french-logo.jpg"
};
var resolveLogosDir = () => {
  const candidates = [
    path.resolve(__dirname, "dist", "logos"),
    path.resolve(__dirname, "public", "logos"),
    path.resolve(process.cwd(), "dist", "logos"),
    path.resolve(process.cwd(), "public", "logos")
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return isProd ? path.resolve(__dirname, "dist", "logos") : path.resolve(__dirname, "public", "logos");
};
app.get("/api/logos/:lang/download", (req, res) => {
  const filename = LOGO_FILES[String(req.params.lang || "").toLowerCase()];
  if (!filename) {
    return res.status(404).json({ error: "Logo not found." });
  }
  return res.download(path.join(resolveLogosDir(), filename), filename);
});
app.get(["/logos", "/logos/"], (_req, res) => {
  return res.sendFile(path.join(resolveLogosDir(), "index.html"));
});
async function startServer() {
  if (!isProd && !isVercel) {
    const vitePkg = "vite";
    const { createServer: createViteServer } = await import(vitePkg);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  const httpServer = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
  httpServer.keepAliveTimeout = 65e3;
  httpServer.headersTimeout = 66e3;
}
if (!isVercel) {
  startServer();
}
var server_default = app;
export {
  app,
  server_default as default
};
