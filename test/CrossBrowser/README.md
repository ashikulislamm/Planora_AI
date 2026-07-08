# Cross-Browser Testing Documentation

This document outlines the testing strategy to ensure Planora_AI renders correctly across all major desktop browsers.

## Verified Browsers
- **Google Chrome**: Version 114+ (Primary target)
- **Mozilla Firefox**: Version 113+
- **Microsoft Edge**: Version 114+ (Chromium)
- *Note: Safari testing is simulated via Playwright WebKit.*

## Testing Scope
1. **Layout Integrity**: Ensure flexbox and CSS Grid alignments hold up across render engines.
2. **Animations**: Verify Framer Motion animations play smoothly in all browsers without frame drops.
3. **Form Elements**: Check default browser stylings on Inputs and Buttons (ensuring Tailwind CSS resets them properly).

## Known Layout Differences (Expected)
- **Scrollbars**: Firefox uses a native thin scrollbar whereas Chrome/Edge uses the custom webkit scrollbar defined in `globals.css`. This is expected and acceptable.
- **Font Rendering**: Text might appear slightly bolder in Chrome on MacOS due to antialiasing defaults compared to Firefox.

## Execution
Run Playwright cross-browser tests using:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```
Evidence is stored in `test/Evidence/screenshots/cross-browser/`.
