#!/usr/bin/env python3
"""Generate Zippy's narration clips with ElevenLabs.

Reads every caption line from the `L = { ... }` object in js/game.js and writes one MP3 per
caption box to assets/audio/vo/ (<key>.mp3, or <key>_<n>.mp3 for a line written as an array),
the file names js/game.js looks for.

Voice: IJcDvoySqim22F7eo0y8, model eleven_multilingual_v2. The accent comes from the voice
itself; the settings below keep the output close to it (high similarity, moderate stability,
little style exaggeration) so it stays Indian English rather than drifting to a neutral accent.

Usage (the key is read from the environment, never stored in the repo):
    export ELEVENLABS_API_KEY=...        # your key
    python3 tools/generate_vo.py             # all lines
    python3 tools/generate_vo.py intro1 tutIf   # only these keys
    python3 tools/generate_vo.py --dry-run   # list what would be generated
"""
import json, os, re, sys, time, urllib.request, urllib.error

VOICE_ID = "IJcDvoySqim22F7eo0y8"
MODEL_ID = "eleven_multilingual_v2"
VOICE_SETTINGS = {"stability": 0.5, "similarity_boost": 0.85, "style": 0.15, "use_speaker_boost": True}
OUTPUT_FORMAT = "mp3_44100_128"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAME_JS = os.path.join(ROOT, "js", "game.js")
OUT_DIR = os.path.join(ROOT, "assets", "audio", "vo")


def read_lines():
    """[(file stem, text, previous box text, next box text)] from the L object in game.js."""
    src = open(GAME_JS, encoding="utf-8").read()
    block = src[src.index("const L = {"):]
    block = block[:block.index("\n};")]
    out = []
    for m in re.finditer(r'^\s*(\w+):\s*(".*"|\[.*\])\s*,?\s*$', block, re.M):
        key, boxes = m.group(1), json.loads(m.group(2))
        boxes = boxes if isinstance(boxes, list) else [boxes]
        for i, text in enumerate(boxes):
            stem = f"{key}_{i + 1}" if len(boxes) > 1 else key
            prev = boxes[i - 1] if i > 0 else None
            nxt = boxes[i + 1] if i < len(boxes) - 1 else None
            out.append((key, stem, text, prev, nxt))
    return out


def synth(api_key, text, prev, nxt):
    body = {"text": text, "model_id": MODEL_ID, "voice_settings": VOICE_SETTINGS}
    # neighbouring caption boxes of the same line: keeps intonation continuous across the split
    if prev: body["previous_text"] = prev
    if nxt: body["next_text"] = nxt
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format={OUTPUT_FORMAT}",
        data=json.dumps(body).encode(), method="POST",
        headers={"xi-api-key": api_key, "Content-Type": "application/json", "Accept": "audio/mpeg"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")[:300]
            if e.code in (429, 500, 502, 503) and attempt < 3:
                time.sleep(2 * (attempt + 1)); continue
            raise SystemExit(f"ElevenLabs error {e.code}: {msg}")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dry = "--dry-run" in sys.argv
    lines = [l for l in read_lines() if not args or l[0] in args or l[1] in args]
    if not lines: raise SystemExit("No matching lines.")
    if dry:
        for _, stem, text, _, _ in lines: print(f"{stem}.mp3  {text}")
        print(f"\n{len(lines)} clips"); return
    api_key = os.environ.get("ELEVENLABS_API_KEY")
    if not api_key: raise SystemExit("Set ELEVENLABS_API_KEY first.")
    os.makedirs(OUT_DIR, exist_ok=True)
    for n, (_, stem, text, prev, nxt) in enumerate(lines, 1):
        audio = synth(api_key, text, prev, nxt)
        open(os.path.join(OUT_DIR, stem + ".mp3"), "wb").write(audio)
        print(f"[{n}/{len(lines)}] {stem}.mp3")
    print(f"Done: {len(lines)} clips in assets/audio/vo/")


if __name__ == "__main__":
    main()
