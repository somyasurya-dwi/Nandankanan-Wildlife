import subprocess
import time
import urllib.request
import sys

proc = subprocess.Popen(["npm.cmd", "run", "preview", "--", "--port", "5173", "--host", "127.0.0.1"], cwd="frontend", stdout=subprocess.PIPE, stderr=subprocess.PIPE)

print("Starting Vite preview on 127.0.0.1:5173...")
time.sleep(3)

passed = False
try:
    req = urllib.request.Request("http://127.0.0.1:5173/")
    with urllib.request.urlopen(req, timeout=5) as resp:
        html = resp.read().decode('utf-8')
        if "NANDANKANAN" in html:
            print("PASS: Frontend loaded successfully, found NANDANKANAN in HTML!")
            passed = True
        else:
            print("FAIL: NANDANKANAN not in HTML")
except Exception as e:
    print(f"FAIL: {e}")
finally:
    proc.terminate()
    proc.kill()
    print("Vite preview terminated.")

if not passed:
    sys.exit(1)
print("FRONTEND PRODUCTION PREVIEW VERIFIED!")

