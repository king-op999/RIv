// api/index.js - BRONX INDIAN FEMALE VOICE API (Real Desi Girl)
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
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>DESI GIRL VOICE</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000010;color:#fff;font-family:'Rajdhani',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
.card{background:rgba(10,10,30,.9);border:1px solid rgba(255,100,0,.1);border-radius:24px;padding:30px;max-width:650px;width:100%;text-align:center}
h1{font-family:'Orbitron',sans-serif;font-size:30px;background:linear-gradient(90deg,#ff6600,#ff9900,#ff0066);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.badge{display:inline-block;background:rgba(255,100,0,.1);color:#ff6600;padding:5px 16px;border-radius:20px;font-size:11px;letter-spacing:2px;margin:10px 0}
.real{color:#00ff88;font-size:10px;margin:6px 0}
.row{display:flex;gap:8px;margin:16px 0;flex-wrap:wrap}
.row input{flex:1;min-width:200px;padding:15px;background:#000;border:1px solid #222;border-radius:14px;color:#fff;font-size:14px;outline:none;font-family:'Rajdhani',sans-serif}
.row input:focus{border-color:#ff6600}
.row button{padding:15px 28px;background:linear-gradient(135deg,#ff6600,#ff0066);color:#fff;border:none;border-radius:14px;font-weight:700;cursor:pointer;font-family:'Orbitron',sans-serif}
select{padding:10px;background:#000;border:1px solid #222;border-radius:10px;color:#fff;font-size:12px;outline:none;font-family:'Rajdhani',sans-serif;margin:4px}
.result{margin-top:16px;display:none}.result audio{width:100%}
code{display:block;background:rgba(0,0,0,.5);color:#ff6600;padding:12px;border-radius:12px;font-size:10px;margin:8px 0;word-break:break-all}
</style></head><body><div class="card">
<h1>🎤 DESI GIRL VOICE</h1><p class="badge">🇮🇳 Real Indian Female Voice</p>
<p class="real">✅ Natural Hindi - Bilkul Indian Ladki Jaisi!</p>
<select id="lang"><option value="hi">🇮🇳 Hindi (Desi Girl)</option><option value="bn">🇧🇩 Bangla</option><option value="en">🇺🇸 English (Indian Accent)</option><option value="ta">🇮🇳 Tamil</option><option value="te">🇮🇳 Telugu</option><option value="mr">🇮🇳 Marathi</option><option value="gu">🇮🇳 Gujarati</option></select>
<select id="sp"><option value="0.7">Very Slow</option><option value="0.85" selected>Slow & Natural</option><option value="1.0">Normal</option></select>
<div class="row"><input type="text" id="txt" placeholder="Kuch bhi likho... नमस्ते, कैसे हो?" onkeypress="if(event.key==='Enter')speak()"><button onclick="speak()">🔊 BOLO</button></div>
<div class="result" id="res"><audio id="audio" controls></audio></div>
<code>GET ${url}/voice?text=Namaste&lang=hi&speed=0.85</code>
</div><script>
function speak(){var t=document.getElementById('txt').value.trim();var l=document.getElementById('lang').value;var s=document.getElementById('sp').value;if(!t)return;document.getElementById('res').style.display='block';document.getElementById('audio').src='/voice?text='+encodeURIComponent(t)+'&lang='+l+'&speed='+s}
</script></body></html>`);
});

// ========== 🎤 INDIAN FEMALE VOICE API ==========
app.get('/voice', async (req, res) => {
    try {
        const text = req.query.text || req.query.q || '';
        const lang = req.query.lang || 'hi';
        const speed = req.query.speed || '0.85';
        
        if (!text || text.trim().length === 0) {
            return res.json({ error: 'Missing text. Use: /voice?text=Namaste&lang=hi' });
        }
        
        if (text.length > 500) {
            return res.json({ error: 'Text too long. Max 500 chars.' });
        }

        console.log(`🎤 [${lang}] "${text.substring(0, 80)}"`);

        // 🔥 GOOGLE HINDI FEMALE TTS - Most Natural Indian Voice
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(text)}&ttsspeed=${speed}`;
        
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 25000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'audio/mpeg,audio/*',
                'Accept-Language': 'hi-IN,hi;q=0.9,en-US;q=0.8',
                'Referer': 'https://translate.google.co.in/',
                'Origin': 'https://translate.google.co.in'
            }
        });

        const audioData = Buffer.from(response.data);

        if (audioData.length < 100) {
            throw new Error('Audio too small');
        }

        console.log(`✅ Generated: ${audioData.length} bytes`);

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', audioData.length);
        res.setHeader('X-Language', lang);
        res.setHeader('X-Voice', 'Indian Female');
        res.send(audioData);

    } catch (e) {
        console.error('Error:', e.message);
        
        // 🔥 RETRY with Indian domain
        try {
            const text = req.query.text || 'hello';
            const lang = req.query.lang || 'hi';
            
            const url = `https://translate.google.co.in/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(text)}`;
            
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                timeout: 20000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 13; SM-S908B) AppleWebKit/537.36',
                    'Accept': '*/*',
                    'Referer': 'https://translate.google.co.in/'
                }
            });

            const audioData = Buffer.from(response.data);
            
            if (audioData.length > 100) {
                res.setHeader('Content-Type', 'audio/mpeg');
                res.send(audioData);
                return;
            }
        } catch (retryError) {
            console.error('Retry failed:', retryError.message);
        }

        res.status(500).json({ 
            error: 'Voice failed. Try shorter text or different language.',
            tip: 'Hindi text under 200 chars works best'
        });
    }
});

// ========== POST ==========
app.post('/voice', async (req, res) => {
    try {
        const { text, lang, speed } = req.body;
        if (!text) return res.json({ error: 'Missing text' });
        if (text.length > 500) return res.json({ error: 'Max 500 chars' });

        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang||'hi'}&q=${encodeURIComponent(text)}&ttsspeed=${speed||'0.85'}`;
        
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 25000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://translate.google.co.in/'
            }
        });

        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(response.data));

    } catch (e) {
        res.status(500).json({ error: 'Failed' });
    }
});

// ========== TEST ==========
app.get('/test', (req, res) => {
    const url = `${req.protocol}://${req.get('host')}`;
    res.json({
        status: '✅ INDIAN FEMALE VOICE API ONLINE',
        languages: ['hi','bn','en','ta','te','mr','gu'],
        sample: `${url}/voice?text=Namaste kaise ho&lang=hi&speed=0.85`
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('🎤 INDIAN FEMALE VOICE API ONLINE!');
    console.log(`🇮🇳 Hindi | Bangla | Tamil | Telugu | Marathi | Gujarati`);
    console.log(`🔗 /voice?text=Namaste&lang=hi`);
    console.log(`🚀 PORT: ${PORT}`);
});
module.exports = app;
