<!-- docs/FRONTEND_DEMO_REFERENCE.md -->
# Frontend Demo Reference

## Purpose
This document provides links to two live frontend implementations for team reference. Use these demos to understand the target user experience and create Jira tickets for building similar features.

## Live Demo URLs

| Frontend | URL | Technology |
|----------|-----|------------|
| Demo 1 | https://autoloan.thanhphongle.net/ | React + MUI (Material UI) |
| Demo 2 | https://autoloan1.thanhphongle.net/ | React + Emotion |

Both frontends connect to the same backend API.

## Upcoming Experimental Frontends
Two additional reference frontends are planned:
- Pure Rails Views (server-side rendering)
- Tailwind CSS implementation

## How to Compare Frontends Using Chrome DevTools Lighthouse

### Steps:
1. Open one of the demo URLs in Chrome browser
2. Press `F12` or right-click → "Inspect" to open DevTools
3. Click the **Lighthouse** tab in DevTools panel
4. Configure analysis:
   - **Mode:** Navigation (Default)
   - **Device:** Desktop
   - **Categories:** Select all (Performance, Accessibility, Best Practices, SEO)
5. Click **Analyze page load**
6. Review the generated report
7. Repeat for the second frontend URL to compare results

### What to Compare:
- Performance scores
- Accessibility compliance
- Best practices adherence
- SEO optimization
- Load times and metrics

## Next Steps for Team
Based on these demos, team members can create Jira tickets to implement:
- UI components matching the demo look and feel
- User interaction flows
- Performance optimizations
- Accessibility features
