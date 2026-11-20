import { useCallback, useEffect, useRef, useState } from 'react';
import { ProficiencyLevel } from '../types';

interface PlayOptions {
  id: string;
  text: string;
  level: ProficiencyLevel;
  slow?: boolean;
  liteMode?: boolean;
}

function pcmBytesToWavBlob(pcmBytes: Uint8Array, sampleRate = 24000): Blob {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const dataSize = pcmBytes.byteLength;

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  return new Blob([header, pcmBytes.buffer as ArrayBuffer], { type: 'audio/wav' });
}

function pickEnglishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  const isEnUs = (v: SpeechSynthesisVoice) => v.lang.toLowerCase().replace('_', '-') === 'en-us';
  const isEn = (v: SpeechSynthesisVoice) => v.lang.toLowerCase().startsWith('en');

  return (
    voices.find((v) => isEnUs(v) && /google|samsung|samantha|natural|aria|jenny|guy|alex/i.test(v.name)) ||
    voices.find((v) => isEnUs(v)) ||
    voices.find((v) => isEn(v) && /google|samsung|natural|english/i.test(v.name)) ||
    voices.find((v) => isEn(v)) ||
    voices.find((v) => /english/i.test(v.name)) ||
    null
  );
}

export function useSpeechAudio(onSlowNetwork?: () => void) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const cacheRef = useRef<Map<string, string>>(new Map());
  const speechTimerRef = useRef<number | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const stop = useCallback(() => {
    if (speechTimerRef.current) {
      window.clearTimeout(speechTimerRef.current);
      speechTimerRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (activeSourcesRef.current.length > 0) {
      activeSourcesRef.current.forEach((src) => {
        try {
          src.onended = null;
          src.stop();
        } catch {
          // Ignore already-stopped nodes
        }
      });
      activeSourcesRef.current = [];
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setLoadingId(null);
    setPlayingId(null);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        voicesRef.current = window.speechSynthesis.getVoices();
      };
      loadVoices();
      window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
      return () => {
        window.speechSynthesis.removeEventListener?.('voiceschanged', loadVoices);
        stop();
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close().catch(() => {});
        }
        cacheRef.current.forEach((url) => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      };
    }

    return () => {
      stop();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
      cacheRef.current.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [stop]);

  const fallbackSpeak = useCallback((id: string, text: string, slow: boolean) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAudioError('Voice playback is not supported on this browser.');
      return;
    }
    if (speechTimerRef.current) {
      window.clearTimeout(speechTimerRef.current);
      speechTimerRef.current = null;
    }

    const startSpeech = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesRef.current = voices;
      }
      const englishVoice = pickEnglishVoice(voicesRef.current);

      const utterance = new SpeechSynthesisUtterance(text);
      if (englishVoice) {
        utterance.voice = englishVoice;
        utterance.lang = englishVoice.lang;
      } else {
        utterance.lang = 'en-US';
      }
      utterance.rate = slow ? 0.78 : 0.96;
      utterance.onstart = () => setPlayingId(id);
      utterance.onend = () => setPlayingId((curr) => (curr === id ? null : curr));
      utterance.onerror = () => {
        setPlayingId((curr) => (curr === id ? null : curr));
      };
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      } catch {
        setPlayingId((curr) => (curr === id ? null : curr));
      }
    };

    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
      speechTimerRef.current = window.setTimeout(() => {
        speechTimerRef.current = null;
        startSpeech();
      }, 35);
    } else {
      startSpeech();
    }
  }, []);

  const unlockAudio = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx({ sampleRate: 24000 });
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
    } catch {
      // Ignore audio unlock errors
    }
  }, []);

  const play = useCallback(
    async ({ id, text, level, slow, liteMode }: PlayOptions) => {
      setAudioError(null);

      if (playingId === id) {
        stop();
        return;
      }

      stop();

      const useSlow = Boolean(slow);
      const cacheKey = `${useSlow ? 'slow' : level}:${text}`;

      // 1. Instant replay if cached
      const cachedUrl = cacheRef.current.get(cacheKey);
      if (cachedUrl) {
        const audio = new Audio(cachedUrl);
        audioRef.current = audio;
        setPlayingId(id);
        audio.onended = () => setPlayingId((curr) => (curr === id ? null : curr));
        audio.onerror = () => {
          setPlayingId(null);
          fallbackSpeak(id, text, useSlow);
        };
        await audio.play().catch(() => fallbackSpeak(id, text, useSlow));
        return;
      }

      // 2. Local English browser speech when liteMode is active
      if (liteMode) {
        fallbackSpeak(id, text, useSlow || level === 'beginner');
        return;
      }

      // 3. Progressive streaming PCM via AudioContext with 2.8s first-byte timeout
      const controller = new AbortController();
      abortRef.current = controller;
      setLoadingId(id);
      let timedOut = false;
      let firstByteTimer: number | null = window.setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, 2800);

      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) {
          throw new Error('No AudioContext');
        }

        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new AudioCtx({ sampleRate: 24000 });
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          await Promise.race([
            ctx.resume().catch(() => {}),
            new Promise<void>((resolve) => window.setTimeout(resolve, 200)),
          ]);
        }

        const response = await fetch('/api/tts/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, level, slow: useSlow }),
          signal: controller.signal,
        });

        if (response.status === 429 || response.status >= 500) {
          onSlowNetwork?.();
          throw new Error('TTS unavailable');
        }

        if (!response.ok || !response.body) {
          throw new Error('Streaming TTS failed');
        }

        const reader = response.body.getReader();
        const collectedChunks: Uint8Array[] = [];
        let leftover: Uint8Array = new Uint8Array(0);
        let nextPlayTime = ctx.currentTime + 0.04;
        let started = false;
        let scheduledCount = 0;

        while (true) {
          let readTimer: number | null = window.setTimeout(() => {
            timedOut = true;
            controller.abort();
          }, 4000);
          const { value, done } = await reader.read().finally(() => {
            if (readTimer !== null) {
              window.clearTimeout(readTimer);
              readTimer = null;
            }
          });
          if (done) break;
          if (!value || value.byteLength === 0) continue;

          if (firstByteTimer !== null) {
            window.clearTimeout(firstByteTimer);
            firstByteTimer = null;
          }

          // Combine leftover odd byte (if any) with incoming chunk
          const combined = new Uint8Array(leftover.length + value.length);
          combined.set(leftover, 0);
          combined.set(value, leftover.length);

          const evenLen = combined.length - (combined.length % 2);
          leftover = combined.slice(evenLen);

          if (evenLen === 0) continue;

          const pcmSlice = combined.slice(0, evenLen);
          collectedChunks.push(pcmSlice);

          const sampleCount = evenLen / 2;
          const floatSamples = new Float32Array(sampleCount);
          const dataView = new DataView(pcmSlice.buffer, pcmSlice.byteOffset, pcmSlice.byteLength);
          for (let i = 0; i < sampleCount; i++) {
            floatSamples[i] = dataView.getInt16(i * 2, true) / 32768;
          }

          const audioBuffer = ctx.createBuffer(1, sampleCount, 24000);
          audioBuffer.copyToChannel(floatSamples, 0);

          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);

          if (nextPlayTime < ctx.currentTime) {
            nextPlayTime = ctx.currentTime + 0.01;
          }

          if (!started) {
            started = true;
            setLoadingId(null);
            setPlayingId(id);
          }

          scheduledCount += 1;
          activeSourcesRef.current.push(source);

          source.onended = () => {
            activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
            if (activeSourcesRef.current.length === 0 && abortRef.current === null) {
              setPlayingId((curr) => (curr === id ? null : curr));
            }
          };

          source.start(nextPlayTime);
          nextPlayTime += audioBuffer.duration;
        }

        if (firstByteTimer !== null) {
          window.clearTimeout(firstByteTimer);
          firstByteTimer = null;
        }
        abortRef.current = null;
        setLoadingId(null);

        if (scheduledCount === 0) {
          throw new Error('No audio chunks received');
        }

        // Cache complete WAV for instant zero-latency replay later
        const totalBytes = collectedChunks.reduce((acc, c) => acc + c.byteLength, 0);
        const fullPcm = new Uint8Array(totalBytes);
        let offset = 0;
        for (const chunk of collectedChunks) {
          fullPcm.set(chunk, offset);
          offset += chunk.byteLength;
        }
        const wavBlob = pcmBytesToWavBlob(fullPcm, 24000);
        cacheRef.current.set(cacheKey, URL.createObjectURL(wavBlob));
      } catch (err: unknown) {
        if (firstByteTimer !== null) {
          window.clearTimeout(firstByteTimer);
          firstByteTimer = null;
        }
        if (err instanceof DOMException && err.name === 'AbortError' && !timedOut) {
          return;
        }
        abortRef.current = null;
        setLoadingId(null);
        if (timedOut) {
          onSlowNetwork?.();
        }
        fallbackSpeak(id, text, useSlow || level === 'beginner');
      }
    },
    [fallbackSpeak, onSlowNetwork, playingId, stop]
  );

  return {
    loadingId,
    playingId,
    audioError,
    play,
    stop,
    unlockAudio,
  };
}
