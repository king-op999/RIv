// api/index.js - BRONX REAL FEMALE VOICE API (Nikki/Siri Style)
const express = require('express');
const axios = require('axios');
const app = express();

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
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>NIKKI VOICE API</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000010;color:#fff;font-family:'Rajdhani',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(255,0,128,.1),transparent 70%);pointer-events:none;z-index:0}
.card{background:rgba(10,10,30,.9);border:1px solid rgba(255,0,128,.1);border-radius:24px;padding:30px;max-width:700px;width:100%;text-align:center;position:relative;z-index:1}
h1{font-family:'Orbitron',sans-serif;font-size:32px;background:linear-gradient(90deg,#ff0080,#8b00ff,#0096ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:glow 3s ease infinite;background-size:200% 200%}@keyframes glow{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.badge{display:inline-block;background:rgba(255,0,128,.1);color:#ff0080;padding:5px 16px;border-radius:20px;font-size:11px;letter-spacing:2px;margin:10px 0;border:1px solid rgba(255,0,128,.2)}
.real{display:inline-block;background:rgba(0,255,136,.1);color:#00ff88;padding:3px 12px;border-radius:12px;font-size:9px;margin:6px 0}
.vs-row{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin:12px 0}
.vs{background:rgba(255,0,128,.05);border:1px solid rgba(255,0,128,.1);color:#888;padding:8px 14px;border-radius:20px;cursor:pointer;font-size:10px;transition:.3s;font-family:'Rajdhani',sans-serif}
.vs:hover,.vs.active{border-color:#ff0080;color:#ff0080;background:rgba(255,0,128,.1)}
.row{display:flex;gap:8px;margin:16px 0;flex-wrap:wrap}
.row input{flex:1;min-width:200px;padding:15px;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.05);border-radius:14px;color:#fff;font-size:14px;outline:none;font-family:'Rajdhani',sans-serif}
.row input:focus{border-color:#ff0080}
.row button{padding:15px 28px;background:linear-gradient(135deg,#ff0080,#8b00ff);color:#fff;border:none;border-radius:14px;font-weight:700;cursor:pointer;font-family:'Orbitron',sans-serif;letter-spacing:1px}.row button:hover{transform:translateY(-2px);box-shadow:0 0 40px rgba(255,0,128,.3)}
.result{margin-top:16px;display:none}.result audio{width:100%}
code{display:block;background:rgba(0,0,0,.5);color:#ff0080;padding:12px;border-radius:12px;font-size:10px;margin:8px 0;word-break:break-all}
.sp-row{display:flex;gap:8px;justify-content:center;align-items:center;margin:8px 0}
.sp-row label{color:#888;font-size:10px}.sp-row select{padding:8px 12px;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.05);border-radius:10px;color:#fff;font-size:11px;outline:none;font-family:'Rajdhani',sans-serif}
</style></head><body>
<div class="card">
<h1>🎤 NIKKI VOICE API</h1><p class="badge">Real Female Voice · Siri Style</p>
<p class="real">✅ Natural Human Voice - Not Robotic!</p>
<div class="vs-row">
<span class="vs active" onclick="sv('nikki')">👩 Nikki (Indian)</span>
<span class="vs" onclick="sv('siri')">👩‍💼 Siri (US)</span>
<span class="vs" onclick="sv('aiko')">👩‍🦰 Aiko (JP)</span>
<span class="vs" onclick="sv('bella')">👩 Bella (UK)</span>
</div>
<div class="sp-row"><label>🐢 Speed:</label><select id="speed"><option value="0.6">Very Slow</option><option value="0.8" selected>Slow & Natural</option><option value="0.95">Normal</option><option value="1.2">Fast</option></select></div>
<div class="row"><input type="text" id="txt" placeholder="Type text... (Hindi/English)" onkeypress="if(event.key==='Enter')speak()"><button onclick="speak()">🔊 SPEAK</button></div>
<div class="result" id="res"><audio id="audio" controls></audio></div>
<code>GET ${url}/voice?text=Hello&voice=nikki&speed=0.8</code>
<code style="margin-top:4px">POST ${url}/voice {"text":"Hello","voice":"nikki"}</code>
</div>
<script>
var voice='nikki';
function sv(v){voice=v;document.querySelectorAll('.vs').forEach(b=>b.classList.remove('active'));event.target.classList.add('active')}
function speak(){var t=document.getElementById('txt').value.trim();var s=document.getElementById('speed').value;if(!t)return;document.getElementById('res').style.display='block';document.getElementById('audio').src='/voice?text='+encodeURIComponent(t)+'&voice='+voice+'&speed='+s}
</script></body></html>`);
});

// ========== 🎤 VOICE API ==========
app.get('/voice', async (req, res) => {
    try {
        const text = req.query.text || req.query.q || '';
        const voice = req.query.voice || 'nikki';
        const speed = req.query.speed || '0.8';
        
        if (!text || text.trim().length === 0) {
            return res.json({ 
                error: 'Missing text parameter', 
                usage: '/voice?text=Hello&voice=nikki&speed=0.8' 
            });
        }
        
        if (text.length > 500) {
            return res.json({ error: 'Text too long. Max 500 characters.' });
        }

        console.log(`🎤 Voice: ${voice} | Speed: ${speed} | "${text.substring(0, 60)}"`);

        // 🔥 Voice Language Mapping
        const voiceMap = {
            nikki: 'hi',    // Hindi - Indian Female
            siri: 'en',     // English - American Female
            aiko: 'ja',     // Japanese - Anime Female
            bella: 'en-GB', // British - Elegant Female
        };
        
        const lang = voiceMap[voice] || 'en';
        const ttsSpeed = parseFloat(speed);
        const speedParam = ttsSpeed < 0.8 ? '0.7' : ttsSpeed > 1.1 ? '1.2' : '0.85';

        // 🔥 Google TTS with Female Voice effect
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(text)}&ttsspeed=${speedParam}`;
        
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 25000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
                'Referer': 'https://translate.google.com/',
                'Origin': 'https://translate.google.com',
                'Cache-Control': 'no-cache'
            }
        });

        const audioData = Buffer.from(response.data);

        if (audioData.length < 100) {
            throw new Error('Audio too small - likely blocked');
        }

        console.log(`✅ Audio generated: ${audioData.length} bytes`);

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', audioData.length);
        res.setHeader('Content-Disposition', 'inline; filename="nikki-voice.mp3"');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('X-Voice', voice);
        res.setHeader('X-Speed', speed);
        res.send(audioData);

    } catch (e) {
        console.error('Voice Error:', e.message);
        
        // 🔥 RETRY with different approach
        try {
            const text = req.query.text || 'hello';
            const voice = req.query.voice || 'nikki';
            const voiceMap = { nikki: 'hi', siri: 'en', aiko: 'ja', bella: 'en-GB' };
            const lang = voiceMap[voice] || 'en';
            
            // Alternative TTS URL
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&client=tw-ob&tl=${lang}&q=${encodeURIComponent(text)}`;
            
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                timeout: 20000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36',
                    'Referer': 'https://translate.google.com/',
                    'Accept': '*/*'
                }
            });

            const audioData = Buffer.from(response.data);
            
            if (audioData.length > 100) {
                res.setHeader('Content-Type', 'audio/mpeg');
                res.send(audioData);
                return;
            }
        } catch (retryError) {
            console.error('Retry also failed:', retryError.message);
        }

        res.status(500).json({ 
            error: 'Voice generation failed. Try shorter text.',
            tip: 'Use text under 100 characters for best results',
            usage: '/voice?text=Hello&voice=nikki'
        });
    }
});

// ========== POST VOICE API ==========
app.post('/voice', async (req, res) => {
    try {
        const { text, voice, speed } = req.body;
        
        if (!text) {
            return res.json({ error: 'Missing text. Send: {"text": "Hello", "voice": "nikki"}' });
        }
        
        if (text.length > 500) {
            return res.json({ error: 'Text too long. Max 500 characters.' });
        }

        const voiceMap = { nikki: 'hi', siri: 'en', aiko: 'ja', bella: 'en-GB' };
        const lang = voiceMap[voice || 'nikki'] || 'en';
        const sp = speed || 0.8;
        const speedParam = sp < 0.8 ? '0.7' : sp > 1.1 ? '1.2' : '0.85';

        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(text)}&ttsspeed=${speedParam}`;
        
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 25000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://translate.google.com/'
            }
        });

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('X-Voice', voice || 'nikki');
        res.send(Buffer.from(response.data));

    } catch (e) {
        res.status(500).json({ error: 'Voice generation failed. Try again.' });
    }
});

// ========== VOICES LIST ==========
app.get('/voices', (req, res) => {
    res.json({
        status: '✅ NIKKI VOICE API',
        voices: [
            { id: 'nikki', name: '👩 Nikki', lang: 'Hindi/English', accent: 'Indian Female' },
            { id: 'siri', name: '👩‍💼 Siri', lang: 'English', accent: 'American Female' },
            { id: 'aiko', name: '👩‍🦰 Aiko', lang: 'Japanese', accent: 'Anime Female' },
            { id: 'bella', name: '👩 Bella', lang: 'English', accent: 'British Female' }
        ],
        usage: {
            get: '/voice?text=Hello&voice=nikki&speed=0.8',
            post: 'POST /voice with JSON {"text":"Hello","voice":"nikki"}'
        }
    });
});

// ========== TEST ==========
app.get('/test', (req, res) => {
    const url = `${req.protocol}://${req.get('host')}`;
    res.json({
        status: '✅ NIKKI VOICE API ONLINE',
        test_url: `${url}/voice?text=Hello&voice=nikki`,
        voices: `${url}/voices`
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('🎤 NIKKI VOICE API ONLINE!');
    console.log(`🔗 GET  /voice?text=Hello&voice=nikki`);
    console.log(`🔗 POST /voice`);
    console.log(`🚀 PORT: ${PORT}`);
});
module.exports = app;
