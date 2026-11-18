// server.ts
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var PORT = Number(process.env.PORT) || 3e3;
var isProd = process.env.NODE_ENV === "production";
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
var SCENARIO_CONTEXT = {
  conversation: "Open everyday English conversation on any topic the learner chooses. Keep the tone warm, natural, and engaging.",
  airport: "At an American airport (check-in desk, security, boarding gate, baggage claim). Act as a helpful travel partner or airport staff member.",
  work: "At an American workplace / office. Act as a friendly coworker chatting before a meeting, discussing tasks, deadlines, and teamwork.",
  doctor: "At an American clinic / doctor visit. Act as a warm, reassuring doctor asking about symptoms and explaining next steps clearly.",
  meeting: "Meeting someone new at a casual social gathering. Act as a friendly conversation partner who enjoys making new friends and learning about different cultures."
};
var LEVEL_INSTRUCTIONS = {
  beginner: "BEGINNER (A1-A2): Use very simple, high-frequency English words and short sentences (1-2 short sentences max). Avoid complex idioms or slang. Speak gently and patiently.",
  intermediate: "INTERMEDIATE (B1-B2): Use natural everyday conversational American English, common phrasal verbs, and 2-3 friendly sentences. Ask engaging follow-up questions.",
  advanced: "ADVANCED (C1-C2): Use authentic, idiomatic American English with natural expressions, subtle humor, and rich conversational depth."
};
async function startServer() {
  const app = express();
  app.use(express.json({ limit: "15mb" }));
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
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
    const replyEnglishRaw = extract("[REPLY]", ["[MISTAKE]", "[CORRECTED]", "[EXPLAIN]", "[TRANS]", "[HINT]"]);
    const replyEnglish = replyEnglishRaw || (raw.indexOf("[REPLY]") === -1 ? raw.split(/\[(?:MISTAKE|CORRECTED|EXPLAIN|TRANS|HINT)\]/)[0].trim() : "");
    const mistakeFlag = extract("[MISTAKE]", ["[CORRECTED]", "[EXPLAIN]", "[TRANS]", "[HINT]"]).toUpperCase();
    const correctedEnglish = extract("[CORRECTED]", ["[EXPLAIN]", "[TRANS]", "[HINT]"]);
    const explanation = extract("[EXPLAIN]", ["[TRANS]", "[HINT]"]);
    const replyTranslation = extract("[TRANS]", ["[HINT]"]);
    const suggestedNextReply = extract("[HINT]", []);
    const hasMistake = mistakeFlag.startsWith("YES") || mistakeFlag.startsWith("TRUE") || correctedEnglish.length > 0 && correctedEnglish.toLowerCase() !== "none";
    return {
      hasMistake,
      correctedEnglish: hasMistake && correctedEnglish.toLowerCase() !== "none" ? correctedEnglish : "",
      explanation: hasMistake && explanation.toLowerCase() !== "none" ? explanation : "",
      replyEnglish,
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
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Content-Encoding", "identity");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();
    res.write(": connected\n\n");
    let clientClosed = false;
    res.on("close", () => {
      if (!res.writableEnded) {
        clientClosed = true;
      }
    });
    try {
      const { scenarioId, level, history, userMessage, targetLanguageName } = req.body;
      if (!userMessage || typeof userMessage !== "string" || !userMessage.trim()) {
        res.write(`data: ${JSON.stringify({ type: "error", error: "Message text is required." })}

`);
        return res.end();
      }
      const ai = getAiClient();
      const { scenarioInfo, levelInfo, prompt } = buildChatPrompts(scenarioId, level, history, userMessage);
      const transLang = targetLanguageName?.trim();
      const transMarkerInstruction = transLang ? `[TRANS]
Accurate natural translation of [REPLY] into ${transLang}
` : "";
      const systemInstruction = `You are a friendly American English conversation partner in "Learn English via Conversation".
Context: ${scenarioInfo}
Level: ${levelInfo}
Rules:
- Reply directly to what the learner actually asked or said. Follow their topic even if it changes (sports, science, culture, religion, daily life).
- If they write broken English or mix another language, understand their intent, answer directly in English, and teach the natural English phrasing in [CORRECTED] + [EXPLAIN].
- Keep [REPLY] concise (1-2 short natural sentences + 1 short follow-up question).

Use ONLY these exact markers in order, starting immediately with [REPLY]:
[REPLY]
Your direct English reply
[MISTAKE]
YES or NO (ignore minor punctuation/capitalization; if NO, omit [CORRECTED] and [EXPLAIN])
[CORRECTED]
Natural English version of learner's message (only if YES)
[EXPLAIN]
1 short simple-English tip (only if YES)
${transMarkerInstruction}[HINT]
1 short English reply the learner can say next`;
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
        const winner = await withTimeout(
          new Promise((resolve, reject) => {
            let settled = false;
            let hedgeStarted = false;
            let failures = 0;
            let lastErr = null;
            let hedgeTimer = null;
            const launch = (model, thinkingLevel) => {
              ai.models.generateContentStream({
                model,
                contents: prompt,
                config: {
                  systemInstruction,
                  thinkingConfig: { thinkingLevel }
                }
              }).then(async (stream) => {
                const iter = stream[Symbol.asyncIterator]();
                const firstStep = await iter.next();
                if (settled || clientClosed) {
                  iter.return?.().catch(() => {
                  });
                  return;
                }
                settled = true;
                if (hedgeTimer) clearTimeout(hedgeTimer);
                resolve({ iter, firstStep });
              }).catch((err) => {
                lastErr = err;
                failures += 1;
                if (settled) return;
                if (!hedgeStarted) {
                  hedgeStarted = true;
                  if (hedgeTimer) clearTimeout(hedgeTimer);
                  launch("gemini-4-hydrogen", ThinkingLevel.LOW);
                } else if (failures >= 2) {
                  settled = true;
                  if (hedgeTimer) clearTimeout(hedgeTimer);
                  reject(lastErr || new Error("Service temporarily busy."));
                }
              });
            };
            launch("gemini-3.1-flash-lite", ThinkingLevel.MINIMAL);
            hedgeTimer = setTimeout(() => {
              if (!settled && !hedgeStarted && !clientClosed) {
                hedgeStarted = true;
                launch("gemini-4-hydrogen", ThinkingLevel.LOW);
              }
            }, 2400);
          }),
          9500,
          "chat stream first chunk"
        );
        activeIter = winner.iter;
        let step = winner.firstStep;
        while (!step.done) {
          if (clientClosed) break;
          const chunk = step.value;
          const piece = chunk.text ?? "";
          if (piece) {
            fullText += piece;
            const replyStart = fullText.indexOf("[REPLY]");
            if (replyStart !== -1) {
              let afterTag = fullText.slice(replyStart + "[REPLY]".length);
              const nextMarkerIdx = afterTag.search(/\n?\[(?:MISTAKE|CORRECTED|EXPLAIN|TRANS|HINT)\]/);
              if (nextMarkerIdx !== -1) {
                afterTag = afterTag.slice(0, nextMarkerIdx);
                const finalReplyChunk = afterTag.replace(/^\s+/, "").trim();
                if (!replyCompletedSent && finalReplyChunk) {
                  replyCompletedSent = true;
                  lastSentReply = finalReplyChunk;
                  res.write(`data: ${JSON.stringify({ type: "reply_complete", replyEnglish: finalReplyChunk })}

`);
                }
              } else {
                afterTag = afterTag.replace(/\n?\[[A-Z_]{0,12}$/, "");
                const cleanReply = afterTag.replace(/^\s+/, "");
                if (cleanReply && cleanReply.length > lastSentReply.length && cleanReply.startsWith(lastSentReply)) {
                  const delta = cleanReply.slice(lastSentReply.length);
                  lastSentReply = cleanReply;
                  res.write(`data: ${JSON.stringify({ type: "reply_delta", delta })}

`);
                } else if (cleanReply && cleanReply !== lastSentReply) {
                  lastSentReply = cleanReply;
                  res.write(`data: ${JSON.stringify({ type: "reply", replyEnglish: cleanReply })}

`);
                }
              }
            }
          }
          step = await withTimeout(activeIter.next(), 4500, "chat stream next chunk");
        }
        succeeded = true;
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
      if (!parsed.replyEnglish && lastSentReply) {
        parsed.replyEnglish = lastSentReply;
      }
      res.write(`data: ${JSON.stringify({ type: "done", ...parsed })}

`);
      return res.end();
    } catch (err) {
      console.error("Chat stream error:", err);
      const rawMsg = err instanceof Error ? err.message : "";
      const isBusy = rawMsg.includes("503") || rawMsg.includes("UNAVAILABLE") || rawMsg.includes("429");
      const friendlyMsg = isBusy ? "The server is currently busy. Please try sending your message again in a moment." : "A temporary connection issue occurred. Please try again.";
      res.write(`data: ${JSON.stringify({ type: "error", error: friendlyMsg })}

`);
      return res.end();
    }
  });
  app.post("/api/chat", async (req, res) => {
    try {
      const { scenarioId, level, history, userMessage, targetLanguageName } = req.body;
      if (!userMessage || typeof userMessage !== "string" || !userMessage.trim()) {
        return res.status(400).json({ error: "Message text is required." });
      }
      const ai = getAiClient();
      const { scenarioInfo, levelInfo, prompt } = buildChatPrompts(scenarioId, level, history, userMessage);
      const transLang = targetLanguageName?.trim();
      const systemInstruction = `You are a friendly American English conversation partner.
Context: ${scenarioInfo}
Level: ${levelInfo}
Reply directly to what the learner actually asked/said (follow their topic even if it changes). Keep replyEnglish concise (1-2 short sentences + 1 short question). Set hasMistake=true only for real English mistakes or non-English words, and give correctedEnglish + 1 short encouraging explanation.${transLang ? ` Also provide replyTranslation in ${transLang}.` : ""}`;
      const schemaProperties = {
        replyEnglish: { type: Type.STRING },
        hasMistake: { type: Type.BOOLEAN },
        correctedEnglish: { type: Type.STRING },
        explanation: { type: Type.STRING },
        suggestedNextReply: { type: Type.STRING }
      };
      const requiredFields = [
        "replyEnglish",
        "hasMistake",
        "correctedEnglish",
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
      const response = await raceTimeout(
        new Promise((resolve, reject) => {
          let settled = false;
          let hedgeStarted = false;
          let failures = 0;
          let lastErr = null;
          let hedgeTimer = null;
          const launch = (model, thinkingLevel) => {
            ai.models.generateContent({
              model,
              contents: prompt,
              config: {
                systemInstruction,
                thinkingConfig: { thinkingLevel },
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: schemaProperties,
                  required: requiredFields
                }
              }
            }).then((resObj) => {
              if (settled) return;
              settled = true;
              if (hedgeTimer) clearTimeout(hedgeTimer);
              resolve(resObj);
            }).catch((err) => {
              lastErr = err;
              failures += 1;
              if (settled) return;
              if (!hedgeStarted) {
                hedgeStarted = true;
                if (hedgeTimer) clearTimeout(hedgeTimer);
                launch("gemini-4-hydrogen", ThinkingLevel.LOW);
              } else if (failures >= 2) {
                settled = true;
                if (hedgeTimer) clearTimeout(hedgeTimer);
                reject(lastErr || new Error("Chat failed"));
              }
            });
          };
          launch("gemini-3.1-flash-lite", ThinkingLevel.MINIMAL);
          hedgeTimer = setTimeout(() => {
            if (!settled && !hedgeStarted) {
              hedgeStarted = true;
              launch("gemini-4-hydrogen", ThinkingLevel.LOW);
            }
          }, 2600);
        }),
        1e4
      );
      const parsed = JSON.parse((response.text ?? "{}").trim());
      return res.json(parsed);
    } catch (err) {
      console.error("Chat error:", err);
      return res.status(500).json({ error: "The server is temporarily busy. Please try again." });
    }
  });
  app.post("/api/phrases", async (req, res) => {
    try {
      const { scenarioId, level, recentMessages } = req.body;
      const ai = getAiClient();
      const scenarioInfo = SCENARIO_CONTEXT[scenarioId] || SCENARIO_CONTEXT.conversation;
      const levelInfo = LEVEL_INSTRUCTIONS[level] || LEVEL_INSTRUCTIONS.beginner;
      const contextLines = (recentMessages || []).slice(-4).map((m) => `${m.sender === "user" ? "Learner" : "Alex"}: ${String(m.text || "").slice(0, 300)}`).join("\n");
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: `Generate 5 practical spoken English phrases to practice.
Scenario: ${scenarioInfo}
Level: ${levelInfo}
Recent chat:
${contextLines || "Opening"}`,
        config: {
          systemInstruction: "You are an American English coach. Return exactly 5 useful spoken American English phrases matching the scenario and level, each with a concise simple-English meaning and a brief 1-sentence usage tip in English.",
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                english: { type: Type.STRING },
                meaning: { type: Type.STRING },
                usageNote: { type: Type.STRING }
              },
              required: ["english", "meaning", "usageNote"]
            }
          }
        }
      });
      const items = JSON.parse((response.text ?? "[]").trim());
      const phrases = items.slice(0, 5).map((item, idx) => ({
        id: `gen-${Date.now()}-${idx}`,
        english: item.english,
        meaning: item.meaning,
        usageNote: item.usageNote,
        memorized: false
      }));
      return res.json({ phrases });
    } catch (err) {
      console.error("Phrases error:", err);
      return res.status(500).json({ error: "Could not generate new phrases right now. Please try again." });
    }
  });
  app.post("/api/tts/stream", async (req, res) => {
    try {
      const { text, level, slow } = req.body;
      if (!text || typeof text !== "string" || !text.trim()) {
        return res.status(400).json({ error: "Text is required for speech." });
      }
      const ai = getAiClient();
      const shouldSpeakSlow = Boolean(slow);
      const style = shouldSpeakSlow ? "Speak clearly and gently at a comfortable pace for an English learner." : level === "beginner" ? "Speak clearly and warmly at a natural, steady pace." : "Friendly, upbeat young American man speaking at a brisk, natural conversational pace.";
      let ttsClientClosed = false;
      res.on("close", () => {
        if (!res.writableEnded) {
          ttsClientClosed = true;
        }
      });
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.8-flash-lite-tts",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: text.slice(0, 1500),
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
      let headersFlushed = false;
      for await (const chunk of responseStream) {
        if (ttsClientClosed) break;
        const data = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (data) {
          if (!headersFlushed) {
            headersFlushed = true;
            res.setHeader("Content-Type", "application/octet-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.flushHeaders?.();
          }
          res.write(Buffer.from(data, "base64"));
        }
      }
      if (!headersFlushed && !res.headersSent) {
        return res.status(502).json({ error: "No audio chunks returned from TTS model." });
      }
      return res.end();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("TTS stream error:", msg);
      if (!res.headersSent) {
        const isQuota = msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED");
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
      const ai = getAiClient();
      const shouldSpeakSlow = Boolean(slow);
      const style = shouldSpeakSlow ? "Speak clearly and gently at a comfortable pace for an English learner." : level === "beginner" ? "Speak clearly and warmly at a natural, steady pace." : "Friendly, upbeat young American man speaking at a brisk, natural conversational pace.";
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash-lite-tts",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: text.slice(0, 1500),
                speechMetadata: {
                  style
                }
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
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        return res.status(500).json({ error: "No audio returned from TTS model." });
      }
      return res.json({ audioBase64: base64Audio, mimeType: "audio/wav" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("TTS error:", msg);
      const isQuota = msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED");
      return res.status(isQuota ? 429 : 500).json({ error: "Failed to synthesize speech audio." });
    }
  });
  app.post("/api/transcribe", async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;
      if (!audioBase64 || typeof audioBase64 !== "string") {
        return res.status(400).json({ error: "Audio data is required." });
      }
      const ai = getAiClient();
      const cleanMime = (mimeType || "audio/webm").split(";")[0];
      const response = await ai.models.generateContent({
        model: "gemini-3.5-transcribe",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: cleanMime,
                data: audioBase64
              }
            },
            {
              text: "Transcribe the spoken audio accurately in the exact language spoken. Return ONLY the transcribed text without quotes or commentary. If the audio is silent or unintelligible, return an empty string."
            }
          ]
        }
      });
      return res.json({ text: (response.text ?? "").trim() });
    } catch (err) {
      console.error("Transcribe error:", err);
      return res.status(500).json({ error: "Failed to transcribe audio." });
    }
  });
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguageName } = req.body;
      if (!text || !targetLanguageName || typeof text !== "string" || typeof targetLanguageName !== "string") {
        return res.status(400).json({ error: "Text and target language are required." });
      }
      const ai = getAiClient();
      const systemInstruction = `Translate the user's English text accurately and naturally into ${targetLanguageName.slice(0, 80)}. Return ONLY the translated text with no quotes, labels, or commentary.`;
      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: text.slice(0, 2e3),
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
          }
        });
      } catch {
        response = await ai.models.generateContent({
          model: "gemini-4-hydrogen",
          contents: text.slice(0, 2e3),
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
          }
        });
      }
      return res.json({ translation: (response.text ?? "").trim() });
    } catch (err) {
      console.error("Translate error:", err);
      return res.status(500).json({ error: "Translation is temporarily unavailable. Please try again." });
    }
  });
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
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
startServer();
