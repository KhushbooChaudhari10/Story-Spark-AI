from playwright.sync_api import sync_playwright

url = "https://kids.kiddle.co/Tiger"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto(url)

    # no waiting for selector - simpler
    page.wait_for_timeout(3000)  # wait 3 seconds

    paragraphs = page.query_selector_all("p")
    texts = [p.inner_text().strip() for p in paragraphs if p.inner_text().strip()]

    print("TEXTS:", texts[:5])  # print only first 5 paragraphs for test

    browser.close()
