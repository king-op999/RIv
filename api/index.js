// api/index.js - BRONX REAL FEMALE VOICE API (ELEVENLABS)
const express = require('express');
const axios = require('axios');
const app = express();

// 🔥 ELEVENLABS - World's Most Realistic AI Voice
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_KEY || 'YOUR_ELEVENLABS_API_KEY';
const ELEVENLABS_VOICE_ID = process.env.VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // 🔥 Rachel - American Female

// 🔥 BEST REALISTIC FEMALE VOICES (ElevenLabs):
const FEMALE_VOICES = {
    rachel: { id: '21m00Tcm4TlvDq8ikWAM', name: '👩‍🦰 Rachel', style: 'American - Warm & Friendly', accent: 'US' },
    bella: { id: 'EXAVITQu4vr4xnSDxMaL', name: '👩 Bella', style: 'American - Soft & Gentle', accent: 'US' },
    emily: { id: 'LcfcDJNUP1GQjkzn1xUU', name: '👩‍💼 Emily', style: 'American - Professional', accent: 'US' },
    grace: { id: 'oWAxZDx7w5VEj9dCyTzz', name: '👩‍🎤 Grace', style: 'American - Sweet & Clear', accent: 'US' },
    lily: { id: 'pFZP5JQG7iQjIQuC4Bku', name: '👩 Lily', style: 'British - Elegant', accent: 'UK' },
    indian_female: { id: 'ThT5KcBeYPX3keUQqHPh', name: '👩‍🦱 Priya', style: 'Indian - Natural Hindi/English', accent: 'IN' },
};

app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();
    next();
});

// ========== HOME PAGE ==========
app.get('/', (req, res) => {
    const url = `${req.protocol}://${req.get('host')}`;
    const voiceButtons = Object.entries(FEMALE_VOICES).map(([k, v]) => 
        `<span class="vs" onclick="sv('${k}')">${v.name} (${v.accent})</span>`
    ).join('');
    
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>BRONX REAL VOICE</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0015;color:#fff;font-family:'Rajdhani',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(255,0,128,.1),transparent 70%);pointer-events:none;z-index:0}
.card{background:rgba(15,5,30,.9);border:1px solid rgba(255,0,128,.1);border-radius:24px;padding:35px;max-width:750px;width:100%;text-align:center;position:relative;z-index:1}
h1{font-family:'Orbitron',sans-serif;font-size:36px;background:linear-gradient(90deg,#ff0080,#8b00ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.badge{display:inline-block;background:rgba(255,0,128,.1);color:#ff0080;padding:5px 16px;border-radius:20px;font-size:11px;letter-spacing:2px;margin:10px 0;border:1px solid rgba(255,0,128,.2)}
.voice-select{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin:12px 0}
.vs{background:rgba(255,0,128,.05);border:1px solid rgba(255,0,128,.1);color:#888;padding:8px 14px;border-radius:20px;cursor:pointer;font-size:10px;transition:.3s;font-family:'Rajdhani',sans-serif}
.vs:hover,.vs.active{border-color:#ff0080;color:#ff0080;background:rgba(255,0,128,.1)}
.row{display:flex;gap:8px;margin:16px 0}
.row input{flex:1;padding:15px;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.05);border-radius:14px;color:#fff;font-size:14px;outline:none;font-family:'Rajdhani',sans-serif}
.row input:focus{border-color:#ff0080}
.row button{padding:15px 28px;background:linear-gradient(135deg,#ff0080,#8b00ff);color:#fff;border:none;border-radius:14px;font-weight:700;cursor:pointer;font-family:'Orbitron',sans-serif}.row button:hover{transform:translateY(-2px);box-shadow:0 0 40px rgba(255,0,128,.3)}
.result{margin-top:16px;display:none}.result audio{width:100%}
code{display:block;background:rgba(0,0,0,.5);color:#ff0080;padding:12px;border-radius:12px;font-size:11px;margin:8px 0;word-break:break-all}
.real-badge{background:rgba(0,255,136,.1);color:#00ff88;padding:4px 12px;border-radius:15px;font-size:9px;display:inline-block;margin-top:6px}
</style></head><body>
<div class="card">
<h1>🎤 BRONX REAL VOICE</h1><p class="badge">👩 Realistic Female Voice · ElevenLabs</p>
<p class="real-badge">✅ NOT ROBOTIC - REAL HUMAN SOUNDING!</p>
<div class="voice-select" id="voices">
<span class="vs active" onclick="sv('rachel')">👩‍🦰 Rachel (US)</span>
<span class="vs" onclick="sv('bella')">👩 Bella (US)</span>
<span class="vs" onclick="sv('emily')">👩‍💼 Emily (US)</span>
<span class="vs" onclick="sv('grace')">👩‍🎤 Grace (US)</span>
<span class="vs" onclick="sv('lily')">👩 Lily (UK)</span>
<span class="vs" onclick="sv('indian_female')">👩‍🦱 Priya (IN)</span>
</div>
<div class="row"><input type="text" id="txt" placeholder="Type anything... (Hindi/English)" onkeypress="if(event.key==='Enter')speak()"><button onclick="speak()">🔊 SPEAK</button></div>
<div class="result" id="res"><audio id="audio" controls></audio></div>
<code>GET ${url}/voice?text=Hello&voice=rachel</code>
</div>
<script>
var voice='rachel';
function sv(v){voice=v;document.querySelectorAll('.vs').forEach(b=>b.classList.remove('active'));event.target.classList.add('active')}
async function speak(){var t=document.getElementById('txt').value.trim();if(!t)return;var r=document.getElementById('res');r.style.display='block';document.getElementById('audio').src='/voice?text='+encodeURIComponent(t)+'&voice='+voice}
</script></body></html>`);
});

// ========== VOICE API ==========
app.get('/voice', async (req, res) => {
    try {
        const text = req.query.text || req.query.q || '';
        const voiceKey = req.query.voice || 'rachel';
        
        if (!text || text.trim().length === 0) {
            return res.json({ error: 'Missing text. Use: /voice?text=Hello' });
        }
        
        if (text.length > 500) {
            return res.json({ error: 'Text too long. Max 500 characters.' });
        }

        const voiceData = FEMALE_VOICES[voiceKey] || FEMALE_VOICES['rachel'];
        console.log(`🎤 Voice: ${voiceData.name} | Text: "${text.substring(0, 80)}"`);

        // 🔥 ElevenLabs REAL VOICE API
        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceData.id}`,
            {
                text: text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.5,      // Voice consistency
                    similarity_boost: 0.75 // How close to original voice
                }
            },
            {
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVENLABS_API_KEY
                },
                responseType: 'arraybuffer',
                timeout: 60000
            }
        );

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', 'inline; filename="voice.mp3"');
        res.send(Buffer.from(response.data));

    } catch (e) {
        console.error('ElevenLabs Error:', e.message);
        
        // 🔥 FALLBACK: Free Google TTS (Still female sounding)
        try {
            const text = req.query.text || 'Hello';
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text)}`;
            
            const resp = await axios.get(url, {
                responseType: 'arraybuffer',
                timeout: 30000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            
            res.setHeader('Content-Type', 'audio/mpeg');
            res.send(Buffer.from(resp.data));
            
        } catch (fallbackError) {
            res.status(500).json({ error: 'Voice generation failed. Try again.' });
        }
    }
});

// ========== POST METHOD ==========
app.post('/voice', async (req, res) => {
    try {
        const { text, voice } = req.body;
        if (!text) return res.json({ error: 'Missing text' });

        const voiceData = FEMALE_VOICES[voice || 'rachel'] || FEMALE_VOICES['rachel'];

        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceData.id}`,
            {
                text: text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: { stability: 0.5, similarity_boost: 0.75 }
            },
            {
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVENLABS_API_KEY
                },
                responseType: 'arraybuffer',
                timeout: 60000
            }
        );

        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(response.data));

    } catch (e) {
        res.status(500).json({ error: 'Failed' });
    }
});

// ========== VOICES LIST ==========
app.get('/voices', (req, res) => {
    res.json({
        status: '✅ REAL FEMALE VOICES',
        provider: 'ElevenLabs (Most Realistic AI Voice)',
        voices: FEMALE_VOICES
    });
});

// ========== TEST ==========
app.get('/test', (req, res) => {
    res.json({ status: '✅ BRONX REAL VOICE ONLINE', voices: Object.keys(FEMALE_VOICES).length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('🎤 BRONX REAL FEMALE VOICE ONLINE!');
    console.log(`🚀 PORT: ${PORT}`);
});
module.exports = app;
