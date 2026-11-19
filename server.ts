import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

function getCleanApiKey(): string | null {
  const raw = process.env.GEMINI_API_KEY;
  if (!raw) return null;
  const cleaned = raw.trim().replace(/^["']|["']$/g, '').trim();
  if (!cleaned || cleaned === 'MY_GEMINI_API_KEY') return null;
  return cleaned;
}

function getAiClient() {
  const apiKey = getCleanApiKey();
  if (!apiKey) {
    throw new Error('MISSING_GEMINI_API_KEY');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function formatServerError(err: unknown, fallbackMsg: string): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes('MISSING_GEMINI_API_KEY')) {
    return {
      status: 503,
      message: 'GEMINI_API_KEY is missing in Render Environment Variables.',
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
      message: 'Invalid GEMINI_API_KEY in server Environment Variables.',
    };
  }
  if (raw.includes('429') || raw.includes('RESOURCE_EXHAUSTED')) {
    return {
      status: 429,
      message: 'Rate limit reached. Please wait a few seconds and tap Retry.',
    };
  }
  if (raw.includes('NOT_FOUND') || raw.includes('404')) {
    return {
      status: 502,
      message: 'AI model not available for this API key. Check your Gemini API key access.',
    };
  }
  if (raw.includes('timeout') || raw.includes('Timeout') || raw.includes('503') || raw.includes('UNAVAILABLE')) {
    return {
      status: 503,
      message: 'Server is waking up or timed out. Please tap Retry.',
    };
  }
  return {
    status: 500,
    message: fallbackMsg,
  };
}

const SCENARIO_CONTEXT: Record<string, string> = {
  conversation:
    'Open everyday Italian conversation on any topic the learner chooses. Keep the tone warm, natural, and engaging.',
  airport:
    'At an Italian airport (Rome Fiumicino or Milan Malpensa — check-in desk, security, boarding gate, baggage claim). Act as a helpful travel partner or airport staff member.',
  work:
    'At an Italian workplace / studio. Act as a friendly Italian coworker chatting before a meeting, discussing tasks, deadlines, and teamwork.',
  doctor:
    'At an Italian clinic / farmacia. Act as a warm, reassuring Italian doctor asking about symptoms and explaining next steps clearly.',
  meeting:
    'Meeting someone new at a casual social gathering or piazza in Italy. Act as a friendly Italian conversation partner who enjoys making new friends and sharing culture.',
};

const LEVEL_INSTRUCTIONS: Record<string, string> = {
  beginner:
    'BEGINNER (A1-A2): Use very simple, high-frequency Italian words and short sentences (1-2 short sentences max). Avoid complex idioms or slang. Speak gently and patiently.',
  intermediate:
    'INTERMEDIATE (B1-B2): Use natural everyday conversational Italian, common expressions, and 2-3 friendly sentences. Ask engaging follow-up questions.',
  advanced:
    'ADVANCED (C1-C2): Use authentic, idiomatic Italian with natural expressions, subtle humor, and rich conversational depth.',
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      apiConfigured: Boolean(getCleanApiKey()),
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

    const replyItalianRaw = extract('[REPLY]', ['[MISTAKE]', '[CORRECTED]', '[EXPLAIN]', '[TRANS]', '[HINT]']);
    const replyItalian =
      replyItalianRaw ||
      (raw.indexOf('[REPLY]') === -1
        ? raw.split(/\[(?:MISTAKE|CORRECTED|EXPLAIN|TRANS|HINT)\]/)[0].trim()
        : '');
    const mistakeFlag = extract('[MISTAKE]', ['[CORRECTED]', '[EXPLAIN]', '[TRANS]', '[HINT]']).toUpperCase();
    const correctedItalian = extract('[CORRECTED]', ['[EXPLAIN]', '[TRANS]', '[HINT]']);
    const explanation = extract('[EXPLAIN]', ['[TRANS]', '[HINT]']);
    const replyTranslation = extract('[TRANS]', ['[HINT]']);
    const suggestedNextReply = extract('[HINT]', []);

    const hasMistake =
      mistakeFlag.startsWith('YES') ||
      mistakeFlag.startsWith('TRUE') ||
      (correctedItalian.length > 0 && correctedItalian.toLowerCase() !== 'none');

    return {
      hasMistake,
      correctedItalian: hasMistake && correctedItalian.toLowerCase() !== 'none' ? correctedItalian : '',
      explanation: hasMistake && explanation.toLowerCase() !== 'none' ? explanation : '',
      replyItalian,
      replyTranslation,
      suggestedNextReply,
    };
  }

  function buildChatPrompts(
    scenarioId: string,
    level: string,
    history: Array<{ sender: 'user' | 'marco'; text: string }>,
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

  // 1A. Streaming Conversational Chat (SSE)
  app.post('/api/chat/stream', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Encoding', 'identity');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();
    // Flush a 1KB SSE comment immediately so reverse proxies (Render/Nginx/Cloudflare) stream tokens without buffering
    res.write(`: connected ${' '.repeat(1024)}\n\n`);

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
        history: Array<{ sender: 'user' | 'marco'; text: string }>;
        userMessage: string;
        targetLanguageName?: string;
      };

      if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
        res.write(`data: ${JSON.stringify({ type: 'error', status: 400, error: 'Message text is required.' })}\n\n`);
        return res.end();
      }

      const ai = getAiClient();
      const { scenarioInfo, levelInfo, prompt } = buildChatPrompts(scenarioId, level, history, userMessage);
      const transLang = targetLanguageName?.trim();
      const transMarkerInstruction = transLang
        ? `[TRANS]\nAccurate natural translation of [REPLY] into ${transLang}\n`
        : '';

      const systemInstruction = `You are a friendly native Italian conversation partner in "Learn Italian via Conversation".
Context: ${scenarioInfo}
Level: ${levelInfo}
Rules:
- Reply directly in natural Italian to what the learner actually asked or said. Follow their topic even if it changes (sports, food, culture, travel, daily life).
- If they write broken Italian or mix another language, understand their intent, answer directly in Italian, and teach the natural Italian phrasing in [CORRECTED] + [EXPLAIN].
- Keep [REPLY] concise (1-2 short natural Italian sentences + 1 short follow-up question in Italian).

Use ONLY these exact markers in order, starting immediately with [REPLY]:
[REPLY]
Your direct Italian reply
[MISTAKE]
YES or NO (ignore minor punctuation/capitalization; if NO, omit [CORRECTED] and [EXPLAIN])
[CORRECTED]
Natural Italian version of learner's message (only if YES)
[EXPLAIN]
1 short simple-English grammar tip explaining why (only if YES)
${transMarkerInstruction}[HINT]
1 short Italian reply the learner can say next`;

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
            let hedgeStarted = false;
            let failures = 0;
            let lastErr: unknown = null;
            let hedgeTimer: NodeJS.Timeout | null = null;

            const launch = (model: string, thinkingLevel: ThinkingLevel) => {
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
                  const firstStep = await iter.next();
                  if (settled || clientClosed) {
                    iter.return?.().catch(() => {});
                    return;
                  }
                  settled = true;
                  if (hedgeTimer) clearTimeout(hedgeTimer);
                  resolve({ iter, firstStep });
                })
                .catch((err: unknown) => {
                  lastErr = err;
                  failures += 1;
                  if (settled) return;
                  if (!hedgeStarted) {
                    hedgeStarted = true;
                    if (hedgeTimer) clearTimeout(hedgeTimer);
                    launch('gemini-4-hydrogen', ThinkingLevel.LOW);
                  } else if (failures >= 2) {
                    settled = true;
                    if (hedgeTimer) clearTimeout(hedgeTimer);
                    reject(lastErr || new Error('Service temporarily busy.'));
                  }
                });
            };

            launch('gemini-3.1-flash-lite', ThinkingLevel.MINIMAL);
            hedgeTimer = setTimeout(() => {
              if (!settled && !hedgeStarted && !clientClosed) {
                hedgeStarted = true;
                launch('gemini-4-hydrogen', ThinkingLevel.LOW);
              }
            }, 1200);
          }),
          15000,
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
            if (replyStart !== -1) {
              let afterTag = fullText.slice(replyStart + '[REPLY]'.length);
              const nextMarkerIdx = afterTag.search(/\n?\[(?:MISTAKE|CORRECTED|EXPLAIN|TRANS|HINT)\]/);
              if (nextMarkerIdx !== -1) {
                afterTag = afterTag.slice(0, nextMarkerIdx);
                const finalReplyChunk = afterTag.replace(/^\s+/, '').trim();
                if (!replyCompletedSent && finalReplyChunk) {
                  replyCompletedSent = true;
                  lastSentReply = finalReplyChunk;
                  res.write(`data: ${JSON.stringify({ type: 'reply_complete', replyItalian: finalReplyChunk })}\n\n`);
                }
              } else {
                afterTag = afterTag.replace(/\n?\[[A-Z_]{0,12}$/, '');
                const cleanReply = afterTag.replace(/^\s+/, '');
                if (cleanReply && cleanReply.length > lastSentReply.length && cleanReply.startsWith(lastSentReply)) {
                  const delta = cleanReply.slice(lastSentReply.length);
                  lastSentReply = cleanReply;
                  res.write(`data: ${JSON.stringify({ type: 'reply_delta', delta })}\n\n`);
                } else if (cleanReply && cleanReply !== lastSentReply) {
                  lastSentReply = cleanReply;
                  res.write(`data: ${JSON.stringify({ type: 'reply', replyItalian: cleanReply })}\n\n`);
                }
              }
            }
          }
          step = await withTimeout(activeIter.next(), 4500, 'chat stream next chunk');
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
      if (!parsed.replyItalian && lastSentReply) {
        parsed.replyItalian = lastSentReply;
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

  // 1B. Standard JSON Chat Endpoint (Non-streaming fallback)
  app.post('/api/chat', async (req, res) => {
    try {
      const { scenarioId, level, history, userMessage, targetLanguageName } = req.body as {
        scenarioId: string;
        level: string;
        history: Array<{ sender: 'user' | 'marco'; text: string }>;
        userMessage: string;
        targetLanguageName?: string;
      };

      if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
        return res.status(400).json({ error: 'Message text is required.' });
      }

      const ai = getAiClient();
      const { scenarioInfo, levelInfo, prompt } = buildChatPrompts(scenarioId, level, history, userMessage);
      const transLang = targetLanguageName?.trim();

      const systemInstruction = `You are a friendly native Italian conversation partner.
Context: ${scenarioInfo}
Level: ${levelInfo}
Reply directly in natural Italian to what the learner actually asked/said (follow their topic even if it changes). Keep replyItalian concise (1-2 short Italian sentences + 1 short Italian question). Set hasMistake=true only for real Italian mistakes or non-Italian words, and give correctedItalian + 1 short encouraging explanation in English. Always give suggestedNextReply in natural Italian.${
        transLang ? ` Also provide replyTranslation of replyItalian in ${transLang}.` : ''
      }`;

      const schemaProperties: Record<string, { type: Type }> = {
        replyItalian: { type: Type.STRING },
        hasMistake: { type: Type.BOOLEAN },
        correctedItalian: { type: Type.STRING },
        explanation: { type: Type.STRING },
        suggestedNextReply: { type: Type.STRING },
      };
      const requiredFields = [
        'replyItalian',
        'hasMistake',
        'correctedItalian',
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

      const response = await raceTimeout(
        new Promise<Awaited<ReturnType<typeof ai.models.generateContent>>>((resolve, reject) => {
          let settled = false;
          let hedgeStarted = false;
          let failures = 0;
          let lastErr: unknown = null;
          let hedgeTimer: NodeJS.Timeout | null = null;

          const launch = (model: string, thinkingLevel: ThinkingLevel) => {
            ai.models
              .generateContent({
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
              })
              .then((resObj) => {
                if (settled) return;
                settled = true;
                if (hedgeTimer) clearTimeout(hedgeTimer);
                resolve(resObj);
              })
              .catch((err: unknown) => {
                lastErr = err;
                failures += 1;
                if (settled) return;
                if (!hedgeStarted) {
                  hedgeStarted = true;
                  if (hedgeTimer) clearTimeout(hedgeTimer);
                  launch('gemini-4-hydrogen', ThinkingLevel.LOW);
                } else if (failures >= 2) {
                  settled = true;
                  if (hedgeTimer) clearTimeout(hedgeTimer);
                  reject(lastErr || new Error('Chat failed'));
                }
              });
          };

          launch('gemini-3.1-flash-lite', ThinkingLevel.MINIMAL);
          hedgeTimer = setTimeout(() => {
            if (!settled && !hedgeStarted) {
              hedgeStarted = true;
              launch('gemini-4-hydrogen', ThinkingLevel.LOW);
            }
          }, 2600);
        }),
        18000
      );

      const parsed = JSON.parse((response.text ?? '{}').trim());
      return res.json(parsed);
    } catch (err: unknown) {
      console.error('Chat error:', err);
      const { status, message } = formatServerError(
        err,
        'The server is temporarily busy. Please try again.'
      );
      return res.status(status).json({ error: message });
    }
  });

  // 2. Generate 5 Key Italian Phrases for the active conversation
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
        .map((m) => `${m.sender === 'user' ? 'Learner' : 'Marco'}: ${String(m.text || '').slice(0, 300)}`)
        .join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `Generate 5 practical spoken Italian phrases to practice.\nScenario: ${scenarioInfo}\nLevel: ${levelInfo}\nRecent chat:\n${contextLines || 'Opening'}`,
        config: {
          systemInstruction:
            'You are a native Italian coach. Return exactly 5 useful spoken Italian phrases matching the scenario and level, each with a concise simple-English meaning and a brief 1-sentence usage tip in English.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                italian: { type: Type.STRING },
                meaning: { type: Type.STRING },
                usageNote: { type: Type.STRING },
              },
              required: ['italian', 'meaning', 'usageNote'],
            },
          },
        },
      });

      const items = JSON.parse((response.text ?? '[]').trim()) as Array<{
        italian: string;
        meaning: string;
        usageNote: string;
      }>;

      const phrases = items.slice(0, 5).map((item, idx) => ({
        id: `gen-${Date.now()}-${idx}`,
        italian: item.italian,
        meaning: item.meaning,
        usageNote: item.usageNote,
        memorized: false,
      }));

      return res.json({ phrases });
    } catch (err: unknown) {
      console.error('Phrases error:', err);
      const { status, message } = formatServerError(
        err,
        'Could not generate new phrases right now. Please try again.'
      );
      return res.status(status).json({ error: message });
    }
  });

  // 3A. Progressive Streaming TTS (raw L16 PCM 24kHz mono in Italian)
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
        ? 'Speak clear, warm standard Italian gently at a comfortable pace for a learner.'
        : level === 'beginner'
        ? 'Speak clear, warm standard Italian at a natural, steady pace.'
        : 'Friendly, articulate native Italian speaker at a natural conversational pace.';

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

  // 3B. Unary Text-to-Speech (WAV fallback in Italian)
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
        ? 'Speak clear, warm standard Italian gently at a comfortable pace for a learner.'
        : level === 'beginner'
        ? 'Speak clear, warm standard Italian at a natural, steady pace.'
        : 'Friendly, articulate native Italian speaker at a natural conversational pace.';

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
              text: 'Transcribe the spoken audio accurately in the exact language spoken (likely Italian or mixed with another language). Return ONLY the transcribed text without quotes or commentary. If the audio is silent or unintelligible, return an empty string.',
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

  // 5. On-demand Translation from Italian to any world language
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
      const systemInstruction = `Translate the user's Italian text accurately and naturally into ${targetLanguageName.slice(0, 80)}. Return ONLY the translated text with no quotes, labels, or commentary.`;

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: text.slice(0, 2000),
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          },
        });
      } catch {
        response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: text.slice(0, 2000),
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });
      }

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

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
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

startServer();
