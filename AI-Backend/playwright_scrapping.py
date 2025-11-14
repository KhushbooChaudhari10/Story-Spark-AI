from playwright.sync_api import sync_playwright

url = "https://kids.kiddle.co/Tiger"

with sync_playwright() as p:
    # WHY Playwright instead of requests/BeautifulSoup:
    # -------------------------------------------------
    # Some Kiddle pages load formatting/clean text better through a real browser engine.
    # Playwright ensures:
    # - Full page rendering (JS, layout engine)
    # - Accurate extraction for pages where BS4 misses content
    # - Ability to debug visually with headless=False
    browser = p.chromium.launch(headless=False)

    page = browser.new_page()

    # Navigating to target page. Full browser means the scraper
    # behaves exactly like a real human visit.
    page.goto(url)

    # WHY simple timeout instead of waiting for selectors:
    # ---------------------------------------------------
    # Kiddle pages load static HTML quickly.
    # No JS-heavy content → no dynamic elements to wait for.
    # 3-second pause is enough for testing without complex logic.
    page.wait_for_timeout(3000)

    # WHY querying all <p> tags:
    # --------------------------
    # Kiddle structures content cleanly using paragraphs.
    # This ensures more consistent text extraction than selecting divs.
    paragraphs = page.query_selector_all("p")

    # Extracting text while ignoring empty paragraphs.
    # Using inner_text() gives visible text exactly as children see it.
    texts = [p.inner_text().strip() for p in paragraphs if p.inner_text().strip()]

    # Printing only first 5 for quick debugging.
    print("TEXTS:", texts[:5])

    browser.close()
