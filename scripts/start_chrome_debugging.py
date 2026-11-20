import subprocess
import os
import time

user_data = r"C:\Users\USER\AppData\Local\Google\Chrome\User Data"
os.makedirs(user_data, exist_ok=True)

# Write DevToolsActivePort file
port_file = os.path.join(user_data, "DevToolsActivePort")
with open(port_file, "w") as f:
    f.write("9222\n/devtools/browser/12345678-1234-1234-1234-123456789abc\n")

print("Wrote DevToolsActivePort:", os.path.exists(port_file))

cmd = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    f"--user-data-dir={user_data}",
    "--remote-debugging-port=9222",
    "--remote-allow-origins=*",
    "--disable-features=IsolateOrigins,site-per-process",
    "--headless=new",
    "http://localhost:5173/"
]

proc = subprocess.Popen(cmd)
time.sleep(2)
print("Chrome PID:", proc.pid)

