import subprocess
import time
import os
import urllib.request
import json

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
args = [
    chrome_path,
    "--remote-debugging-port=9222",
    "--remote-allow-origins=*",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "http://localhost:5173/"
]

print("Launching Chrome...")
p = subprocess.Popen(args)
time.sleep(3)

print("Checking port 9222...")
try:
    with urllib.request.urlopen("http://127.0.0.1:9222/json/version", timeout=3) as resp:
        print("Chrome DevTools ready:", json.loads(resp.read().decode('utf-8')))
except Exception as e:
    print("Could not connect to DevTools port:", e)

dev_port_file = os.path.expanduser(r"~\AppData\Local\Google\Chrome\User Data\DevToolsActivePort")
print("DevToolsActivePort file exists:", os.path.exists(dev_port_file))
if os.path.exists(dev_port_file):
    with open(dev_port_file) as f:
        print("DevToolsActivePort contents:", f.read().strip())

