import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';
const isVercel = Boolean(process.env.VERCEL);

function getCleanApiKey(): string | null {
  const raw = process.env.GEMINI_API_KEY;
  if (!raw) return null;
  const cleaned = raw.trim().replace(/^["']|["']$/g, '').trim();
  if (!cleaned || cleaned === 'MY_GEMINI_API_KEY') return null;
  return cleaned;
}

let cachedAiClient: GoogleGenAI | null = null;
let cachedAiKey: string | null = null;

function getAiClient() {
  const apiKey = getCleanApiKey();
  if (!apiKey) {
    throw new Error('MISSING_GEMINI_API_KEY');
  }
  if (cachedAiClient && cachedAiKey === apiKey) {
    return cachedAiClient;
  }
  cachedAiKey = apiKey;
  cachedAiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  return cachedAiClient;
}

function formatServerError(err: unknown, fallbackMsg: string): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes('MISSING_GEMINI_API_KEY')) {
    return {
      status: 503,
      message: 'GEMINI_API_KEY is missing in environment variables.',
    };
  }
  if (
    raw.includes('API_KEY_INVALID') ||
    raw.includes('API key not valid') ||
    raw.includes('PERMISSION_DENIED') ||
    raw.includes('403') ||
    raw.includes('401')
  ) {
    return {
      status: 401,
      message: 'Invalid GEMINI_API_KEY in environment variables.',
    };
  }
  if (raw.includes('429') || raw.includes('RESOURCE_EXHAUSTED')) {
    return {
      status: 429,
      message: 'Rate limit reached. Wait a moment and tap Retry.',
    };
  }
  if (raw.includes('NOT_FOUND') || raw.includes('404')) {
    return {
      status: 502,
      message: 'AI model unavailable for this API key.',
    };
  }
  if (raw.includes('timeout') || raw.includes('Timeout') || raw.includes('503') || raw.includes('UNAVAILABLE')) {
    return {
      status: 503,
      message: 'Server is busy or restarting. Tap Retry.',
    };
  }
  return {
    status: 500,
    message: fallbackMsg,
  };
}

const SCENARIO_CONTEXT: Record<string, string> = {
  conversation:
    'Open everyday English conversation on any topic the learner chooses. Keep the tone warm, natural, and engaging.',
  airport:
    'At an international airport (check-in desk, security, boarding gate, baggage claim). Act as a helpful travel partner or airport staff member.',
  work:
    'At a modern workplace. Act as a friendly coworker chatting before a meeting, discussing tasks, deadlines, and teamwork.',
  doctor:
    'At a medical clinic. Act as a warm, reassuring doctor asking about symptoms and explaining next steps clearly.',
  meeting:
    'Meeting someone new at a casual coffee shop or social gathering. Act as a friendly conversation partner who enjoys making new friends.',
};

const LEVEL_INSTRUCTIONS: Record<string, string> = {
  beginner:
    'BEGINNER (A1-A2): Use very simple, high-frequency English words and short sentences (1-2 short sentences max). Avoid complex idioms or slang. Speak gently and patiently.',
  intermediate:
    'INTERMEDIATE (B1-B2): Use natural everyday conversational English, common expressions, and 2-3 friendly sentences. Ask engaging follow-up questions.',
  advanced:
    'ADVANCED (C1-C2): Use authentic, idiomatic English with natural expressions, subtle humor, and rich conversational depth.',
};

export const app = express();
// Guard against Vercel pre-parsed req.body causing express.json() to hang waiting on drained stream
app.use((req, _res, next) => {
  const r = req as unknown as { body?: unknown; _body?: boolean };
  if (r.body !== undefined && !Buffer.isBuffer(r.body)) {
    r._body = true;
  }
  next();
});
app.use(express.json({ limit: '15mb' }));

app.get('/api/health', (_req, res) => {
  const apiConfigured = Boolean(getCleanApiKey());
  if (apiConfigured) {
    try {
      getAiClient();
    } catch {
      // Ignore pre-warm errors
    }
  }
  res.json({
    status: 'ok',
    app: 'learn-english-via-conversation',
    partner: 'Alex',
    language: 'en-US',
    apiConfigured,
  });
});

// Helper to parse structured section stream from /api/chat/stream
function parseStreamedSections(raw: string) {
  const extract = (tag: string, nextTags: string[]) => {
    const idx = raw.indexOf(tag);
    if (idx === -1) return '';
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

  const replyEnglishRaw = extract('[REPLY]', ['[MISTAKE]', '[CORRECTED]', '[EXPLAIN]', '[TRANS]', '[HINT]']);
  const replyEnglish =
    replyEnglishRaw ||
    (raw.indexOf('[REPLY]') === -1
      ? raw.split(/\[(?:MISTAKE|CORRECTED|EXPLAIN|TRANS|HINT)\]/)[0].trim()
      : '');
  const mistakeFlag = extract('[MISTAKE]', ['[CORRECTED]', '[EXPLAIN]', '[TRANS]', '[HINT]']).toUpperCase();
  const correctedEnglish = extract('[CORRECTED]', ['[EXPLAIN]', '[TRANS]', '[HINT]']);
  const explanation = extract('[EXPLAIN]', ['[TRANS]', '[HINT]']);
  const replyTranslation = extract('[TRANS]', ['[HINT]']);
  const suggestedNextReply = extract('[HINT]', []);

  const hasMistake =
    mistakeFlag.startsWith('YES') ||
    mistakeFlag.startsWith('TRUE') ||
    (correctedEnglish.length > 0 && correctedEnglish.toLowerCase() !== 'none');

  return {
    hasMistake,
    correctedEnglish: hasMistake && correctedEnglish.toLowerCase() !== 'none' ? correctedEnglish : '',
    explanation: hasMistake && explanation.toLowerCase() !== 'none' ? explanation : '',
    replyEnglish,
    replyTranslation,
    suggestedNextReply,
  };
}

function buildChatPrompts(
  scenarioId: string,
  level: string,
  history: Array<{ sender: 'user' | 'alex'; text: string }>,
  userMessage: string
) {
  const scenarioInfo = SCENARIO_CONTEXT[scenarioId] || SCENARIO_CONTEXT.conversation;
  const levelInfo = LEVEL_INSTRUCTIONS[level] || LEVEL_INSTRUCTIONS.beginner;
  const formattedHistory = (history || [])
    .slice(-2)
    .map((m) => `${m.sender === 'user' ? 'L' : 'P'}: ${String(m.text || '').slice(0, 160)}`)
    .join('\n');

  const safeMessage = userMessage.trim().slice(0, 1000);
  const prompt = `${formattedHistory ? `${formattedHistory}\n` : ''}L: "${safeMessage}"`;
  return { scenarioInfo, levelInfo, prompt };
}

// 1A. Streaming Conversational Chat (SSE — HTTP/2 & Render proxy safe)
app.post('/api/chat/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Content-Encoding', 'identity');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();
  // Flush immediate SSE comment + start event so proxies stream tokens without buffering
  res.write(`: connected ${' '.repeat(1024)}\n\n`);
  res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`);

  let clientClosed = false;
  res.on('close', () => {
    if (!res.writableEnded) {
      clientClosed = true;
    }
  });

  try {
    const { scenarioId, level, history, userMessage, targetLanguageName } = req.body as {
      scenarioId: string;
      level: string;
      history: Array<{ sender: 'user' | 'alex'; text: string }>;
      userMessage: string;
      targetLanguageName?: string;
    };

    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      res.write(`data: ${JSON.stringify({ type: 'error', status: 400, error: 'Please enter a message.' })}\n\n`);
      return res.end();
    }

    const ai = getAiClient();
    const { scenarioInfo, levelInfo, prompt } = buildChatPrompts(scenarioId, level, history, userMessage);
    const transLang = targetLanguageName?.trim();
    const transMarkerInstruction = transLang
      ? `[TRANS]\nNatural translation of the reply into ${transLang}\n`
      : '';

    const systemInstruction = `You are Alex in "Learn English via Conversation".
Context: ${scenarioInfo}
Level: ${levelInfo}
ALWAYS write your reply, correction, explanation, and hint strictly in English (never reply in Italian or any other language).
Reply immediately with 1 short sentence in natural English + 1 short question (max 25 words total, no [REPLY] tag). Then append only:
[MISTAKE]
YES or NO (omit [CORRECTED] and [EXPLAIN] if NO)
[CORRECTED]
Natural corrected English sentence (if YES)
[EXPLAIN]
1 short tip in simple English (max 15 words, if YES)
${transMarkerInstruction}[HINT]
1 short reply idea in English (max 12 words)`;

    const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
      let timer: NodeJS.Timeout;
      const timeoutPromise = new Promise<never>((_resolve, reject) => {
        timer = setTimeout(() => reject(new Error(`Timeout (${ms}ms): ${label}`)), ms);
      });
      return Promise.race([
        promise.finally(() => clearTimeout(timer)),
        timeoutPromise,
      ]);
    };

    type StreamIter = AsyncIterator<
      Awaited<ReturnType<typeof ai.models.generateContentStream>> extends AsyncIterable<infer U> ? U : never
    >;
    type StreamStep = IteratorResult<
      Awaited<ReturnType<typeof ai.models.generateContentStream>> extends AsyncIterable<infer U> ? U : never
    >;

    let fullText = '';
    let lastSentReply = '';
    let replyCompletedSent = false;
    let succeeded = false;

    const keepaliveInterval = setInterval(() => {
      if (!clientClosed && !res.writableEnded) {
        res.write(': ping\n\n');
      }
    }, 1000);

    let activeIter: StreamIter | null = null;
    try {
      const winner = await withTimeout(
        new Promise<{ iter: StreamIter; firstStep: StreamStep }>((resolve, reject) => {
          let settled = false;
          let activePending = 0;
          let lastErr: unknown = null;
          const hedgeTimers: NodeJS.Timeout[] = [];
          const clearHedges = () => hedgeTimers.forEach((t) => clearTimeout(t));

          const startedAt = Date.now();
          let retriedOnTransient = false;
          let hedgeStarted = false;
          const startHedge = () => {
            if (hedgeStarted || settled || clientClosed) return;
            hedgeStarted = true;
            launch('gemini-4-hydrogen', ThinkingLevel.LOW);
          };

          const launch = (model: string, thinkingLevel: ThinkingLevel) => {
            if (settled || clientClosed) return;
            activePending += 1;
            ai.models
              .generateContentStream({
                model,
                contents: prompt,
                config: {
                  systemInstruction,
                  thinkingConfig: { thinkingLevel },
                },
              })
              .then(async (stream) => {
                const iter: StreamIter = stream[Symbol.asyncIterator]();
                let firstStep = await iter.next();
                while (!firstStep.done && !(firstStep.value?.text ?? '')) {
                  if (settled || clientClosed) {
                    iter.return?.().catch(() => {});
                    return;
                  }
                  firstStep = await iter.next();
                }
                activePending -= 1;
                if (settled || clientClosed || firstStep.done) {
                  iter.return?.().catch(() => {});
                  if (!settled && firstStep.done) {
                    startHedge();
                    if (activePending <= 0) {
                      settled = true;
                      clearHedges();
                      reject(lastErr || new Error('Empty stream response.'));
                    }
                  }
                  return;
                }
                settled = true;
                clearHedges();
                resolve({ iter, firstStep });
              })
              .catch((err: unknown) => {
                activePending -= 1;
                lastErr = err;
                if (settled || clientClosed) return;
                startHedge();
                const msg = err instanceof Error ? err.message : String(err);
                const isTransient =
                  msg.includes('503') ||
                  msg.includes('UNAVAILABLE') ||
                  msg.includes('DEADLINE_EXCEEDED') ||
                  msg.includes('429') ||
                  msg.includes('RESOURCE_EXHAUSTED');
                if (isTransient && !retriedOnTransient && Date.now() - startedAt < 7000) {
                  retriedOnTransient = true;
                  setTimeout(() => {
                    if (!settled && !clientClosed) launch('gemini-3.1-flash-lite', ThinkingLevel.MINIMAL);
                  }, 450);
                  return;
                }
                if (activePending <= 0) {
                  settled = true;
                  clearHedges();
                  reject(lastErr || new Error('Service temporarily busy.'));
                }
              });
          };

          launch('gemini-3.1-flash-lite', ThinkingLevel.MINIMAL);
          hedgeTimers.push(setTimeout(startHedge, 2500));
        }),
        12000,
        'chat stream first chunk'
      );

      activeIter = winner.iter;
      let step = winner.firstStep;

      while (!step.done) {
        if (clientClosed) break;
        const chunk = step.value;
        const piece = chunk.text ?? '';
        if (piece) {
          fullText += piece;

          const replyStart = fullText.indexOf('[REPLY]');
          let afterTag = replyStart !== -1 ? fullText.slice(replyStart + '[REPLY]'.length) : fullText;
          const nextMarkerIdx = afterTag.search(/\n?\[(?:MISTAKE|CORRECTED|EXPLAIN|TRANS|HINT)\]/);
          if (nextMarkerIdx !== -1) {
            afterTag = afterTag.slice(0, nextMarkerIdx);
            const finalReplyChunk = afterTag.replace(/^\s+/, '').trim();
            if (!replyCompletedSent && finalReplyChunk) {
              replyCompletedSent = true;
              lastSentReply = finalReplyChunk;
              res.write(`data: ${JSON.stringify({ type: 'reply_complete', replyEnglish: finalReplyChunk })}\n\n`);
            }
          } else {
            afterTag = afterTag.replace(/\n?\[(?:R|RE|REP|REPL|REPLY|M|MI|MIS|MIST|MISTA|MISTAK|MISTAKE|C|CO|H|HI|T|TR|E|EX)?$/i, '');
            const cleanReply = afterTag.replace(/^\s+/, '');
            if (cleanReply && cleanReply.length > lastSentReply.length && cleanReply.startsWith(lastSentReply)) {
              const delta = cleanReply.slice(lastSentReply.length);
              lastSentReply = cleanReply;
              res.write(`data: ${JSON.stringify({ type: 'reply_delta', delta })}\n\n`);
            } else if (cleanReply && cleanReply !== lastSentReply) {
              lastSentReply = cleanReply;
              res.write(`data: ${JSON.stringify({ type: 'reply', replyEnglish: cleanReply })}\n\n`);
            }
          }
        }
        step = await withTimeout(activeIter.next(), 9000, 'chat stream next chunk');
      }

      succeeded = true;
    } catch (err: unknown) {
      activeIter?.return?.().catch(() => {});
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
      throw new Error('Service temporarily busy.');
    }

    const parsed = parseStreamedSections(fullText);
    if (!parsed.replyEnglish && lastSentReply) {
      parsed.replyEnglish = lastSentReply;
    }

    res.write(`data: ${JSON.stringify({ type: 'done', ...parsed })}\n\n`);
    return res.end();
  } catch (err: unknown) {
    console.error('Chat stream error:', err);
    const { status, message } = formatServerError(
      err,
      'A temporary connection issue occurred. Please try again.'
    );
    res.write(`data: ${JSON.stringify({ type: 'error', status, error: message })}\n\n`);
    return res.end();
  }
});

// 1B. Standard JSON Chat Endpoint (Fast hedged fallback)
app.post('/api/chat', async (req, res) => {
  try {
    const { scenarioId, level, history, userMessage, targetLanguageName } = req.body as {
      scenarioId: string;
      level: string;
      history: Array<{ sender: 'user' | 'alex'; text: string }>;
      userMessage: string;
      targetLanguageName?: string;
    };

    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      return res.status(400).json({ error: 'Please enter a message.' });
    }

    const ai = getAiClient();
    const { scenarioInfo, levelInfo, prompt } = buildChatPrompts(scenarioId, level, history, userMessage);
    const transLang = targetLanguageName?.trim();

    const systemInstruction = `You are Alex, a friendly English conversation partner in "Learn English via Conversation".
Context: ${scenarioInfo}
Level: ${levelInfo}
ALWAYS write replyEnglish, correctedEnglish, explanation, and suggestedNextReply strictly in English (never reply in Italian or any other language).
Reply immediately in natural English (1 short sentence + 1 short question, max 25 words, in replyEnglish). Set hasMistake=true only for real mistakes or non-English words, and provide correctedEnglish + 1 brief tip in simple English (max 15 words, in explanation). Always provide suggestedNextReply in natural English (max 12 words).${
      transLang ? ` Also provide replyTranslation of replyEnglish in ${transLang}.` : ''
    }`;

    const schemaProperties: Record<string, { type: Type }> = {
      replyEnglish: { type: Type.STRING },
      hasMistake: { type: Type.BOOLEAN },
      correctedEnglish: { type: Type.STRING },
      explanation: { type: Type.STRING },
      suggestedNextReply: { type: Type.STRING },
    };
    const requiredFields = [
      'replyEnglish',
      'hasMistake',
      'correctedEnglish',
      'explanation',
      'suggestedNextReply',
    ];
    if (transLang) {
      schemaProperties.replyTranslation = { type: Type.STRING };
      requiredFields.push('replyTranslation');
    }

    const raceTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
      let timer: NodeJS.Timeout;
      return Promise.race([
        promise.finally(() => clearTimeout(timer)),
        new Promise<never>((_resolve, reject) => {
          timer = setTimeout(() => reject(new Error('Request timeout')), ms);
        }),
      ]);
    };

    const callChatModel = (model: string, thinkingLevel: ThinkingLevel) =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: schemaProperties,
            required: requiredFields,
          },
        },
      });

    const startedAt = Date.now();
    const response = await raceTimeout(
      new Promise<Awaited<ReturnType<typeof ai.models.generateContent>>>((resolve, reject) => {
        let settled = false;
        let activePending = 0;
        let transientRetries = 0;
        let lastErr: unknown = null;
        const hedgeTimers: NodeJS.Timeout[] = [];
        const clearHedges = () => hedgeTimers.forEach((t) => clearTimeout(t));

        let hedgeStarted = false;
        const startHedge = () => {
          if (hedgeStarted || settled) return;
          hedgeStarted = true;
          launch('gemini-4-hydrogen', ThinkingLevel.LOW);
        };

        const launch = (model: string, thinkingLevel: ThinkingLevel) => {
          if (settled) return;
          activePending += 1;
          callChatModel(model, thinkingLevel)
            .then((resObj) => {
              activePending -= 1;
              if (settled) return;
              settled = true;
              clearHedges();
              resolve(resObj);
            })
            .catch((err: unknown) => {
              activePending -= 1;
              lastErr = err;
              if (settled) return;
              startHedge();
              const msg = err instanceof Error ? err.message : String(err);
              const isTransient =
                msg.includes('503') ||
                msg.includes('UNAVAILABLE') ||
                msg.includes('DEADLINE_EXCEEDED') ||
                msg.includes('429') ||
                msg.includes('RESOURCE_EXHAUSTED');
              if (isTransient && transientRetries < 2 && Date.now() - startedAt < 8000) {
                transientRetries += 1;
                const delay = transientRetries * 450;
                setTimeout(() => {
                  if (!settled) launch('gemini-3.1-flash-lite', ThinkingLevel.MINIMAL);
                }, delay);
                return;
              }
              if (activePending <= 0) {
                settled = true;
                clearHedges();
                reject(lastErr || new Error('Chat error'));
              }
            });
        };

        // Primary fast model at t=0ms; hedge to gemini-4-hydrogen only on error or after 2500ms
        launch('gemini-3.1-flash-lite', ThinkingLevel.MINIMAL);
        hedgeTimers.push(setTimeout(startHedge, 2500));
      }),
      12500
    );

    const parsed = JSON.parse((response.text ?? '{}').trim());
    return res.json(parsed);
  } catch (err: unknown) {
    console.error('Chat error:', err);
    const { status, message } = formatServerError(
      err,
      'Server is temporarily busy. Please try again.'
    );
    return res.status(status).json({ error: message });
  }
});

// 2. Generate 5 Key English Phrases for the active conversation
app.post('/api/phrases', async (req, res) => {
  try {
    const { scenarioId, level, recentMessages } = req.body as {
      scenarioId: string;
      level: string;
      recentMessages: Array<{ sender: string; text: string }>;
    };

    const ai = getAiClient();
    const scenarioInfo = SCENARIO_CONTEXT[scenarioId] || SCENARIO_CONTEXT.conversation;
    const levelInfo = LEVEL_INSTRUCTIONS[level] || LEVEL_INSTRUCTIONS.beginner;

    const contextLines = (recentMessages || [])
      .slice(-4)
      .map((m) => `${m.sender === 'user' ? 'Learner' : 'Alex'}: ${String(m.text || '').slice(0, 300)}`)
      .join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `Generate 5 practical spoken English phrases to use in this conversation.\nScenario: ${scenarioInfo}\nLevel: ${levelInfo}\nRecent chat:\n${contextLines || 'Start'}`,
      config: {
        systemInstruction:
          'You are a friendly native English tutor. Return exactly 5 useful spoken English phrases suited to the context and level, each with a brief explanation/synonym in simple English (meaning) and 1 short usage tip in simple English (usageNote).',
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              english: { type: Type.STRING },
              meaning: { type: Type.STRING },
              usageNote: { type: Type.STRING },
            },
            required: ['english', 'meaning', 'usageNote'],
          },
        },
      },
    });

    const items = JSON.parse((response.text ?? '[]').trim()) as Array<{
      english: string;
      meaning: string;
      usageNote: string;
    }>;

    const phrases = items.slice(0, 5).map((item, idx) => ({
      id: `gen-${Date.now()}-${idx}`,
      english: item.english,
      meaning: item.meaning,
      usageNote: item.usageNote,
      memorized: false,
    }));

    return res.json({ phrases });
  } catch (err: unknown) {
    console.error('Phrases error:', err);
    const { status, message } = formatServerError(
      err,
      'Unable to generate new phrases right now. Please try again.'
    );
    return res.status(status).json({ error: message });
  }
});

// 3A. Progressive Streaming TTS (raw L16 PCM 24kHz mono in English)
app.post('/api/tts/stream', async (req, res) => {
  try {
    const { text, level, slow } = req.body as {
      text: string;
      level?: string;
      slow?: boolean;
    };

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for speech.' });
    }

    const ai = getAiClient();
    const shouldSpeakSlow = Boolean(slow);
    const style = shouldSpeakSlow
      ? 'Speak strictly in clear, warm standard American English (en-US) gently at a comfortable pace for a learner.'
      : level === 'beginner'
      ? 'Speak strictly in clear, warm standard American English (en-US) at a natural, steady pace.'
      : 'Friendly, articulate native American English (en-US) speaker at a natural conversational pace.';

    let ttsClientClosed = false;
    res.on('close', () => {
      if (!res.writableEnded) {
        ttsClientClosed = true;
      }
    });

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 1500),
              speechMetadata: { style },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    let headersFlushed = false;
    for await (const chunk of responseStream) {
      if (ttsClientClosed) break;
      const data = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (data) {
        if (!headersFlushed) {
          headersFlushed = true;
          res.setHeader('Content-Type', 'application/octet-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.flushHeaders?.();
        }
        res.write(Buffer.from(data, 'base64'));
      }
    }

    if (!headersFlushed && !res.headersSent) {
      return res.status(502).json({ error: 'No audio chunks returned from TTS model.' });
    }
    return res.end();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('TTS stream error:', msg);
    if (!res.headersSent) {
      const isQuota = msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED');
      return res.status(isQuota ? 429 : 500).json({ error: 'Failed to stream speech audio.' });
    }
    return res.end();
  }
});

// 3B. Unary Text-to-Speech (WAV fallback in English)
app.post('/api/tts', async (req, res) => {
  try {
    const { text, level, slow } = req.body as {
      text: string;
      level?: string;
      slow?: boolean;
    };

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for speech.' });
    }

    const ai = getAiClient();
    const shouldSpeakSlow = Boolean(slow);
    const style = shouldSpeakSlow
      ? 'Speak strictly in clear, warm standard American English (en-US) gently at a comfortable pace for a learner.'
      : level === 'beginner'
      ? 'Speak strictly in clear, warm standard American English (en-US) at a natural, steady pace.'
      : 'Friendly, articulate native American English (en-US) speaker at a natural conversational pace.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 1500),
              speechMetadata: {
                style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio returned from TTS model.' });
    }

    return res.json({ audioBase64: base64Audio, mimeType: 'audio/wav' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('TTS error:', msg);
    const isQuota = msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED');
    return res.status(isQuota ? 429 : 500).json({ error: 'Failed to synthesize speech audio.' });
  }
});

// 4. Audio Transcription (Microphone voice input)
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body as {
      audioBase64: string;
      mimeType?: string;
    };

    if (!audioBase64 || typeof audioBase64 !== 'string') {
      return res.status(400).json({ error: 'Audio data is required.' });
    }

    const ai = getAiClient();
    const cleanMime = (mimeType || 'audio/webm').split(';')[0];

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: cleanMime,
              data: audioBase64,
            },
          },
          {
            text: 'Transcribe the spoken audio accurately in the exact language spoken (likely English or mixed with another language). Return ONLY the transcribed text without quotes or commentary. If the audio is silent or unintelligible, return an empty string.',
          },
        ],
      },
    });

    return res.json({ text: (response.text ?? '').trim() });
  } catch (err: unknown) {
    console.error('Transcribe error:', err);
    const { status, message } = formatServerError(err, 'Failed to transcribe audio.');
    return res.status(status).json({ error: message });
  }
});

// 5. On-demand Translation from English to any world language
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguageName } = req.body as {
      text: string;
      targetLanguageName: string;
    };

    if (!text || !targetLanguageName || typeof text !== 'string' || typeof targetLanguageName !== 'string') {
      return res.status(400).json({ error: 'Text and target language are required.' });
    }

    const ai = getAiClient();
    const systemInstruction = `Translate the user's English text accurately and naturally into ${targetLanguageName.slice(0, 80)}. Return ONLY the translated text with no quotes, labels, or commentary.`;

    const raceTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
      let timer: NodeJS.Timeout;
      return Promise.race([
        promise.finally(() => clearTimeout(timer)),
        new Promise<never>((_resolve, reject) => {
          timer = setTimeout(() => reject(new Error('Translation timeout')), ms);
        }),
      ]);
    };

    const response = await raceTimeout(
      new Promise<Awaited<ReturnType<typeof ai.models.generateContent>>>((resolve, reject) => {
        let settled = false;
        let failures = 0;
        let lastErr: unknown = null;

        const launch = (model: string, thinkingLevel: ThinkingLevel) => {
          ai.models
            .generateContent({
              model,
              contents: text.slice(0, 2000),
              config: {
                systemInstruction,
                thinkingConfig: { thinkingLevel },
              },
            })
            .then((resObj) => {
              if (settled) return;
              settled = true;
              resolve(resObj);
            })
            .catch((err: unknown) => {
              lastErr = err;
              failures += 1;
              if (settled) return;
              if (failures >= 2) {
                settled = true;
                reject(lastErr || new Error('Translation failed'));
              }
            });
        };

        launch('gemini-3.1-flash-lite', ThinkingLevel.MINIMAL);
        launch('gemini-4-hydrogen', ThinkingLevel.LOW);
      }),
      9000
    );

    return res.json({ translation: (response.text ?? '').trim() });
  } catch (err: unknown) {
    console.error('Translate error:', err);
    const { status, message } = formatServerError(
      err,
      'Translation is temporarily unavailable. Please try again.'
    );
    return res.status(status).json({ error: message });
  }
});

const LOGO_FILES: Record<string, string> = {
  english: 'english-logo.jpg',
  italian: 'italian-logo.jpg',
  french: 'french-logo.jpg',
};

const resolveLogosDir = () => {
  const candidates = [
    path.resolve(__dirname, 'dist', 'logos'),
    path.resolve(__dirname, 'public', 'logos'),
    path.resolve(process.cwd(), 'dist', 'logos'),
    path.resolve(process.cwd(), 'public', 'logos'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return isProd ? path.resolve(__dirname, 'dist', 'logos') : path.resolve(__dirname, 'public', 'logos');
};

app.get('/api/logos/:lang/download', (req, res) => {
  const filename = LOGO_FILES[String(req.params.lang || '').toLowerCase()];
  if (!filename) {
    return res.status(404).json({ error: 'Logo not found.' });
  }
  return res.download(path.join(resolveLogosDir(), filename), filename);
});

app.get(['/logos', '/logos/'], (_req, res) => {
  return res.sendFile(path.join(resolveLogosDir(), 'index.html'));
});

async function startServer() {
  if (!isProd && !isVercel) {
    const vitePkg = 'vite';
    const { createServer: createViteServer } = await import(vitePkg);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const httpServer = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
  httpServer.keepAliveTimeout = 65000;
  httpServer.headersTimeout = 66000;
}

if (!isVercel) {
  startServer();
}

export default app;
