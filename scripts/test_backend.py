import subprocess
import time
import urllib.request
import json
import sys

python_exe = "C:\\Users\\USER\\AppData\\Local\\Programs\\Python\\Python312\\python.exe"
proc = subprocess.Popen([python_exe, "backend/manage.py", "runserver", "127.0.0.1:8000", "--noreload"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

print("Starting Django on 127.0.0.1:8000...")
time.sleep(3)

endpoints = [
    "http://127.0.0.1:8000/api/animals/",
    "http://127.0.0.1:8000/api/cameras/",
    "http://127.0.0.1:8000/api/markers/",
    "http://127.0.0.1:8000/api/stories/",
    "http://127.0.0.1:8000/api/sponsorships/",
    "http://127.0.0.1:8000/api/stats/"
]

all_passed = True
try:
    for ep in endpoints:
        req = urllib.request.Request(ep)
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            count = len(data) if isinstance(data, list) else len(data.keys())
            print(f"PASS: {ep} -> status {resp.status}, count/keys: {count}")
except Exception as e:
    print(f"FAIL: {e}")
    all_passed = False
finally:
    proc.terminate()
    proc.kill()
    print("Django test server terminated.")

if not all_passed:
    sys.exit(1)
print("ALL BACKEND ENDPOINTS PASSED SUCCESSFULLY!")

