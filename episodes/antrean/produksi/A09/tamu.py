# Tiga "layar" tanpa kepala membuka halaman polling selama 10 detik
from playwright.sync_api import sync_playwright
import time
with sync_playwright() as p:
    b = p.chromium.launch()
    for _ in range(3): b.new_page().goto("http://localhost:4004/")
    time.sleep(10); b.close()
