#!/usr/bin/env python3
"""通过 GitHub API 部署 out/ 到 GitHub Pages"""
import os, json, base64, urllib.request, urllib.error, sys, ssl

TOKEN = os.environ.get("GH_TOKEN", "")
if not TOKEN:
    print("❌ 请设置 GH_TOKEN 环境变量")
    sys.exit(1)

REPO = "lhyhy123/lhyhy123.github.io"
API = f"https://api.github.com/repos/{REPO}"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "out")

def api(method, path, data=None):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    url = f"{API}{path}"
    hdrs = {"Authorization": f"Bearer {TOKEN}", "Accept": "application/vnd.github+json"}
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=hdrs, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60, context=ctx) as resp:
            return json.loads(resp.read())
    except Exception as e:
        print(f"  API ERROR: {e}")
        return None

print("🚀 通过 GitHub API 部署...")

ref = api("GET", "/git/ref/heads/main")
current_sha = ref["object"]["sha"]
print(f"   当前 HEAD: {current_sha[:8]}")

os.chdir(OUT)
blobs = []
count = 0
for root, dirs, files in os.walk("."):
    dirs[:] = [d for d in dirs if d != ".git"]
    for f in files:
        fpath = os.path.join(root, f)
        relpath = fpath[2:]
        with open(fpath, "rb") as fh:
            content = base64.b64encode(fh.read()).decode()
        result = api("POST", "/git/blobs", {"content": content, "encoding": "base64"})
        if result and "sha" in result:
            blobs.append({"path": relpath, "sha": result["sha"]})
            count += 1
            if count % 20 == 0:
                print(f"   已上传 {count} 个文件...")

print(f"   共 {count} 个文件")
tree = api("POST", "/git/trees", {"tree": [{"path": b["path"], "mode": "100644", "type": "blob", "sha": b["sha"]} for b in blobs]})
commit = api("POST", "/git/commits", {"message": "🚀 部署", "tree": tree["sha"], "parents": [current_sha]})
api("PATCH", "/git/refs/heads/main", {"sha": commit["sha"], "force": True})
print(f"✅ 部署完成! {commit['sha'][:8]}")
