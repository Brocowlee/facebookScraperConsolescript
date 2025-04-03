# Facebook Posts Scraper

This script is designed to scrape posts from Facebook when executed in the browser's console. It collects information such as the post's author, content, reactions count, and comments count. The scraped data is saved as a JSON file for further analysis.

## Features

- Automatically scrolls through the Facebook feed to load more posts.
- Expands "See More" links to capture the full content of posts.
- Extracts the following details for each post:
  - **Author**: The name of the person or page that created the post.
  - **Content**: The text content of the post.
  - **Reactions Count**: The number of reactions (likes, loves, etc.) on the post.
  - **Comments Count**: The number of comments on the post.
- Saves the scraped data as a JSON file.

## How to Use

1. **Open Facebook**: Navigate to the Facebook page or feed you want to scrape.
2. **Open the Browser Console**:
   - In Chrome: Press `Ctrl + Shift + J` (Windows/Linux) or `Cmd + Option + J` (Mac).
   - In Firefox: Press `Ctrl + Shift + K` (Windows/Linux) or `Cmd + Option + K` (Mac).
3. **Paste the Script**:
   - Copy the contents of `consoleScript.js`.
   - Paste it into the browser's console.
4. **Start Scraping**:
   - The script will automatically start scraping posts.
   - To stop the scraper at any time, type the following in the console:
     ```javascript
     window.stopFacebookScraper = "stop";
     ```
5. **Download the Data**:
   - Once the scraping is complete, the script will automatically download a JSON file named `facebook_posts.json` containing the scraped data.

## Configuration

You can customize the script's behavior by modifying the `config` object at the top of the script:

- `scrollDelay`: Time (in milliseconds) between scrolls.
- `maxScrolls`: Maximum number of scrolls to perform.
- `pauseBetweenActions`: Pause time (in milliseconds) between processing actions.
- `expandTextDelay`: Delay (in milliseconds) after clicking "See More" buttons.
- `stopVariableName`: The global variable name used to stop the scraper.

## Notes

- This script is intended for educational purposes only. Ensure you comply with Facebook's terms of service and privacy policies when using this script.
- The script may need adjustments if Facebook changes its HTML structure or class names.
- For best results, scroll manually through the feed a bit before running the script to ensure posts are loaded.

## Disclaimer

This script is provided "as is" without any warranty. Use it at your own risk.
