import urllib.request
import re

url = 'https://pgnexa.com/assets/index-BEMcSnrU.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

matches = re.findall(r'"([A-Za-z0-9\s,\.\?\!\:\'\-]{8,70})"', content)
keywords = ['pg', 'hostel', 'rent', 'room', 'bed', 'tenant', 'staff', 'branch', 'visitor', 'screen', 'phone', 'whatsapp', 'feature', 'question', 'faq', 'city', 'demo', 'owner', 'pricing', 'month', 'profit']

seen = set()
for m in matches:
    m_clean = m.strip()
    if m_clean not in seen and any(k in m_clean.lower() for k in keywords):
        seen.add(m_clean)
        print('>', m_clean)
