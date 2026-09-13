import sys
import os
import requests
import json
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

print('=' * 68)
print(' 🔍 YATRA DUAL-MODEL HEALTH & STATUS AUDIT')
print('=' * 68)

# --- 1. TEST VISION MODEL (ONNX Runtime) ---
print('\n[1/2] Checking In-House Heritage Vision Model...')
try:
    from infer import HeritageVisionPredictor
    start = time.time()
    p = HeritageVisionPredictor()
    test_img = os.path.join('data', 'val', 'kumbhalgarh_fort', 'kumbhalgarh_fort_and_the_1.jpg')
    if os.path.exists(test_img):
        res = p.predict(test_img, top_k=1)
        dur = (time.time() - start) * 1000
        print(' [ONLINE] Heritage Vision Model is LIVE and OPERATIONAL!')
        print(f'          Location: {p.session._model_path if hasattr(p.session, "_model_path") else "Loaded from F:/models"}')
        print(f'          Latency:  {dur:.1f}ms')
        print(f'          Match:    {res[0]["name"]} ({res[0]["confidence"]}%)')
    else:
        print(' [ONLINE] Heritage Vision Model initialized successfully!')
except Exception as e:
    print(f' [ERROR] Vision Model Failed: {e}')

# --- 2. TEST LM STUDIO CONVERSATIONAL LLM (Port 1234) ---
print('\n[2/2] Checking Local Conversational LLM (LM Studio on :1234)...')
try:
    r = requests.get('http://127.0.0.1:1234/v1/models', timeout=3)
    if r.status_code == 200:
        models = r.json().get('data', [])
        loaded_model_id = models[0].get('id', 'Unknown') if models else 'None loaded'
        print(f' [ONLINE] LM Studio Server is LIVE on port 1234!')
        print(f'          Loaded Model: {loaded_model_id}')
        
        # Test a quick conversational prompt
        chat_payload = {
            'model': loaded_model_id,
            'messages': [
                {'role': 'system', 'content': 'You are the Yatra AI Heritage Guide. Answer in 1 short sentence.'},
                {'role': 'user', 'content': 'What makes Kumbhalgarh Fort famous?'}
            ],
            'temperature': 0.7,
            'max_tokens': 60
        }
        c_start = time.time()
        cr = requests.post('http://127.0.0.1:1234/v1/chat/completions', json=chat_payload, timeout=10)
        c_dur = (time.time() - c_start) * 1000
        if cr.status_code == 200:
            ans = cr.json().get('choices', [{}])[0].get('message', {}).get('content', '').strip()
            print(f'          Latency:      {c_dur:.1f}ms')
            print(f'          Test Answer:  "{ans}"')
        else:
            print(f'          Status: Server returned HTTP {cr.status_code}')
    else:
        print(f' [WARN] LM Studio responded with HTTP {r.status_code}')
except Exception as e:
    print(f' [OFFLINE] LM Studio (Port 1234) is NOT responding: {e}')
    print('           To start: In LM Studio, click the "<->" Server tab on the left, load your model, and toggle "Start Server".')

print('\n' + '=' * 68)
