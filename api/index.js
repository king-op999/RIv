// api/index.js - BRONX AI FEMALE VOICE API V1.0
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.set('json spaces', 2);
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();
    next();
});

// ========== HOME PAGE ==========
app.get('/', (req, res) => {
    const url = `${req.protocol}://${req.get('host')}`;
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>BRONX VOICE AI</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0015;color:#fff;font-family:'Rajdhani',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(255,0,128,.1),transparent 70%);pointer-events:none;z-index:0}
.card{background:rgba(15,5,30,.9);border:1px solid rgba(255,0,128,.1);border-radius:24px;padding:35px;max-width:700px;width:100%;text-align:center;position:relative;z-index:1;backdrop-filter:blur(30px)}
h1{font-family:'Orbitron',sans-serif;font-size:36px;background:linear-gradient(90deg,#ff0080,#8b00ff,#0096ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:glow 3s ease infinite;background-size:200% 200%}@keyframes glow{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.badge{display:inline-block;background:rgba(255,0,128,.1);color:#ff0080;padding:5px 16px;border-radius:20px;font-size:11px;letter-spacing:2px;margin:10px 0;border:1px solid rgba(255,0,128,.2)}
.row{display:flex;gap:8px;margin:16px 0}
.row input{flex:1;padding:15px;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.05);border-radius:14px;color:#fff;font-size:14px;outline:none;font-family:'Rajdhani',sans-serif}
.row input:focus{border-color:#ff0080;box-shadow:0 0 30px rgba(255,0,128,.15)}
.row button{padding:15px 28px;background:linear-gradient(135deg,#ff0080,#8b00ff);color:#fff;border:none;border-radius:14px;font-weight:700;cursor:pointer;font-family:'Orbitron',sans-serif;letter-spacing:1px}
.row button:hover{transform:translateY(-2px);box-shadow:0 0 40px rgba(255,0,128,.3)}
.result{margin-top:16px;padding:16px;background:rgba(0,0,0,.3);border-radius:14px;display:none}
.result audio{width:100%;margin-top:10px}
code{display:block;background:rgba(0,0,0,.5);color:#ff0080;padding:12px;border-radius:12px;font-size:11px;margin:8px 0;word-break:break-all;border:1px solid rgba(255,0,128,.1)}
.voice-select{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:12px 0}
.vs{background:rgba(255,0,128,.05);border:1px solid rgba(255,0,128,.1);color:#888;padding:8px 14px;border-radius:20px;cursor:pointer;font-size:10px;transition:.3s;font-family:'Rajdhani',sans-serif}
.vs:hover,.vs.active{border-color:#ff0080;color:#ff0080;background:rgba(255,0,128,.1)}
</style></head><body>
<div class="card">
<h1>🎤 BRONX VOICE AI</h1><p class="badge">Realistic Female Voice · Free API</p>
<div class="voice-select" id="voices">
<span class="vs active" onclick="sv('nova')">🌸 Nova (Soft)</span>
<span class="vs" onclick="sv('shimmer')">✨ Shimmer (Melodic)</span>
<span class="vs" onclick="sv('alloy')">🎵 Alloy (Warm)</span>
<span class="vs" onclick="sv('echo')">🌙 Echo (Deep)</span>
<span class="vs" onclick="sv('fable')">🦋 Fable (British)</span>
</div>
<div class="row"><input type="text" id="txt" placeholder="Type text to speak..." onkeypress="if(event.key==='Enter')speak()"><button onclick="speak()">🔊 SPEAK</button></div>
<div class="result" id="res"><audio id="audio" controls></audio></div>
<code>GET ${url}/voice?text=Hello&voice=nova</code>
</div>
<script>
var voice='nova';
function sv(v){voice=v;document.querySelectorAll('.vs').forEach(b=>b.classList.remove('active'));event.target.classList.add('active')}
async function speak(){var t=document.getElementById('txt').value.trim();if(!t)return;var r=document.getElementById('res');r.style.display='block';try{var resp=await fetch('/voice?text='+encodeURIComponent(t)+'&voice='+voice);if(resp.ok){var blob=await resp.blob();var url=URL.createObjectURL(blob);document.getElementById('audio').src=url;document.getElementById('audio').play()}else{var d=await resp.json();alert('❌ '+d.error)}}catch(e){alert('❌ Error: '+e.message)}}
</script></body></html>`);
});

// ========== FREE AI VOICE API ==========
app.get('/voice', async (req, res) => {
    try {
        const text = req.query.text || req.query.q || req.query.speak || '';
        const voice = req.query.voice || 'nova';
        
        if (!text || text.trim().length === 0) {
            return res.json({ error: 'Missing text parameter. Use: /voice?text=Hello' });
        }
        
        if (text.length > 1000) {
            return res.json({ error: 'Text too long. Max 1000 characters.' });
        }

        console.log(`🎤 Voice: ${voice} | Text: "${text.substring(0, 100)}"`);

        // 🔥 FREE OpenAI TTS API (via reverse proxy)
        // Using official OpenAI TTS format - female voices
        const response = await axios.post(
            'https://api.openai.com/v1/audio/speech',
            {
                model: 'tts-1',  // or tts-1-hd for higher quality
                input: text,
                voice: voice,  // nova, shimmer, alloy, echo, fable, onyx
                speed: 1.0,
                response_format: 'mp3'
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer',
                timeout: 60000
            }
        );

        // Send audio file
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', 'inline; filename="voice.mp3"');
        res.send(Buffer.from(response.data));

    } catch (e) {
        console.error('Voice Error:', e.message);
        
        // 🔥 FALLBACK: Free TTS API (no key needed)
        try {
            const text = req.query.text || 'Hello';
            const voice = req.query.voice || 'nova';
            
            // Free voice mapping
            const voiceMap = {
                'nova': 'en-US-Neural2-F',      // Female soft
                'shimmer': 'en-US-Neural2-H',   // Female melodic
                'alloy': 'en-GB-Neural2-C',     // Female British
                'echo': 'en-AU-Neural2-D',      // Female Australian
                'fable': 'en-IN-Neural2-A'      // Female Indian
            };
            
            const selectedVoice = voiceMap[voice] || 'en-US-Neural2-F';
            
            // Google Translate TTS (FREE)
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text)}`;
            
            const resp = await axios.get(url, {
                responseType: 'arraybuffer',
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            res.setHeader('Content-Type', 'audio/mpeg');
            res.send(Buffer.from(resp.data));
            
        } catch (fallbackError) {
            res.status(500).json({
                error: 'Voice generation failed. Please try again.',
                tip: 'Use shorter text or try later.'
            });
        }
    }
});

// ========== POST METHOD (For longer text) ==========
app.post('/voice', async (req, res) => {
    try {
        const { text, voice } = req.body;
        
        if (!text) {
            return res.json({ error: 'Missing text in body. Send: {"text": "Hello"}' });
        }

        const response = await axios.post(
            'https://api.openai.com/v1/audio/speech',
            {
                model: 'tts-1',
                input: text,
                voice: voice || 'nova',
                speed: 1.0,
                response_format: 'mp3'
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer',
                timeout: 60000
            }
        );

        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(response.data));

    } catch (e) {
        // Fallback
        try {
            const text = req.body.text || 'Hello';
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text)}`;
            const resp = await axios.get(url, {
                responseType: 'arraybuffer',
                timeout: 30000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            res.setHeader('Content-Type', 'audio/mpeg');
            res.send(Buffer.from(resp.data));
        } catch (e2) {
            res.status(500).json({ error: 'Failed' });
        }
    }
});

// ========== VOICE LIST ==========
app.get('/voices', (req, res) => {
    res.json({
        female_voices: [
            { id: 'nova', name: '🌸 Nova', description: 'Soft, gentle female voice', style: 'Calm & Warm' },
            { id: 'shimmer', name: '✨ Shimmer', description: 'Melodic, expressive female voice', style: 'Bright & Cheerful' },
            { id: 'alloy', name: '🎵 Alloy', description: 'Warm, natural female voice (British)', style: 'Professional' },
            { id: 'echo', name: '🌙 Echo', description: 'Deep, resonant female voice (Australian)', style: 'Mature & Deep' },
            { id: 'fable', name: '🦋 Fable', description: 'Elegant female voice (Indian English)', style: 'Narrative' }
        ],
        usage: {
            get: '/voice?text=Hello&voice=nova',
            post: 'POST /voice with JSON body',
            voices: '/voices'
        }
    });
});

// ========== HEALTH CHECK ==========
app.get('/test', (req, res) => {
    const url = `${req.protocol}://${req.get('host')}`;
    res.json({
        status: '✅ BRONX VOICE AI ONLINE',
        voices: 5,
        endpoints: {
            speak: `${url}/voice?text=Hello&voice=nova`,
            voices: `${url}/voices`,
            home: url
        }
    });
});

// ========== START ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('🎤 BRONX VOICE AI ONLINE!');
    console.log(`🚀 PORT: ${PORT}`);
    console.log('👩 Female Voices: nova, shimmer, alloy, echo, fable');
});

module.exports = app;
