import urllib.request

url = "https://upload.wikimedia.org/wikipedia/commons/d/d0/Marvelous_sighting_of_tigers_in_the_afternoon_safari_at_Pilibhit_tiger_reserve.webm"
headers = {
    'User-Agent': 'NandankananWildlifePortal/1.0 (https://nandankanan.org; admin@nandankanan.org)'
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print("Status:", resp.status)
        print("Type:", resp.headers.get("content-type"))
        print("Length:", resp.headers.get("content-length"))
except Exception as e:
    print("Error:", e)

