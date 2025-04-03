// Facebook Posts Scraper
// Copy and paste this into your browser's console when viewing Facebook

// Configuration variables
const config = {
    scrollDelay: 2000,              // Time between scrolls in ms
    maxScrolls: 50,                 // Maximum number of scrolls to perform
    pauseBetweenActions: 1000,      // Pause between actions in ms
    expandTextDelay: 500,           // Delay after clicking "See more" buttons
    stopVariableName: "stopFacebookScraper"  // Global variable to stop the scraper
  };
  
  // Initialize data storage
  let posts = [];
  let scrollCount = 0;
  let stopSignal = false;
  
  // Create a global variable to stop the script
  window[config.stopVariableName] = null;
  
  // Check for stop signal
  function checkForStopSignal() {
    if (window[config.stopVariableName] === "stop") {
      console.log("Stop signal received. Finishing scraping...");
      stopSignal = true;
      return true;
    }
    return false;
  }
  
  // Sleep function for pausing between actions
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Expand "See more" links in a post
  async function expandSeeMoreLinks(postElement) {
    try {
      const seeMoreButtons = postElement.querySelectorAll('div[role="button"]:not([aria-expanded])');
      
      for (const button of seeMoreButtons) {
        const text = button.textContent.trim().toLowerCase();
        if (text.includes("voir plus") || text.includes("see more") || text.includes("en voir plus")) {
          console.log("Clicking 'See More' button...");
          button.click();
          await sleep(config.expandTextDelay);
        }
      }
    } catch (error) {
      console.warn("Error expanding 'See More' links:", error);
    }
  }
  
  // Extract post content
  function extractPostContent(postElement) {
    try {
      // Target the content div
      const contentDivs = postElement.querySelectorAll('div[data-ad-rendering-role="story_message"]');
      if (contentDivs.length > 0) {
        return contentDivs[0].textContent.trim();
      }
      
      // Fallback to other possible content selectors
      const fallbackContentDivs = postElement.querySelectorAll('div[data-ad-preview="message"]');
      if (fallbackContentDivs.length > 0) {
        return fallbackContentDivs[0].textContent.trim();
      }
      
      
      return "Content not found";
    } catch (error) {
      console.warn("Error extracting post content:", error);
      return "Error extracting content";
    }
  }
  
  // Extract post author
  function extractPostAuthor(postElement) {
    try {
      // Look for h2 with author information
      const authorH2 = postElement.querySelector('h2');
      if (authorH2) {
        const authorLink = authorH2.querySelector('a');
        if (authorLink) {
          return authorLink.textContent.trim();
        }
      }
      
      // Fallback to other possible author selectors
      const strongAuthor = postElement.querySelector('strong');
      if (strongAuthor) {
        return strongAuthor.textContent.trim();
      }
      
      // Another fallback
      const spanAuthor = postElement.querySelector('span.x1vvkbs');
      if (spanAuthor) {
        return spanAuthor.textContent.trim();
      }
      
      return "Author not found";
    } catch (error) {
      console.warn("Error extracting post author:", error);
      return "Error extracting author";
    }
  }
  
  // Extract reactions count
  function extractReactionsCount(postElement) {
    try {
      // Look for reaction spans
      const reactionSpans = postElement.querySelectorAll('span.xt0b8zv, span.x10wlt62, span.xrbpyxo');
      for (const span of reactionSpans) {
        const count = span.textContent.trim();
        if (/^\d+$/.test(count.replace(/\s/g, ''))) {
          return count;
        }
      }
      
      // Fallback to other reaction selectors
      const likeSpans = postElement.querySelectorAll('[aria-label*="reactions"], [aria-label*="réactions"]');
      if (likeSpans.length > 0) {
        const match = likeSpans[0].getAttribute('aria-label').match(/(\d+)/);
        if (match) {
          return match[1];
        }
      }
      
      return "0";
    } catch (error) {
      console.warn("Error extracting reactions count:", error);
      return "0";
    }
  }
  
  // Extract comments count
  function extractCommentsCount(postElement) {
    try {
      // Look for comment spans
      const commentSpans = postElement.querySelectorAll('span.xkrqix3'); 
      for (const span of commentSpans) {
        const text = span.textContent.trim();
        if (text.includes("commentaire") || text.includes("comment")) {
          return text.split(/\s+/)[0];
        }
      }
      
      // Alternative approach without using contains in selector (to avoid the error)
      const allSpans = postElement.querySelectorAll('span');
      for (const span of allSpans) {
        const text = span.textContent.trim();
        if (text.match(/^\d+\s+(commentaires?|comments?)$/)) {
          return text.split(/\s+/)[0];
        }
      }
      
      return "0";
    } catch (error) {
      console.warn("Error extracting comments count:", error);
      return "0";
    }
  }
  
  // Process a post element
  async function processPost(postElement) {
    try {
      // First expand any "See more" links
      await expandSeeMoreLinks(postElement);
      
      // Extract post data
      const content = extractPostContent(postElement);
      const author = extractPostAuthor(postElement);
      const reactionsCount = extractReactionsCount(postElement);
      const commentsCount = extractCommentsCount(postElement);
      
      // Create post object
      const post = {
        author,
        content,
        reactionsCount,
        commentsCount,
      };
      
      // Check if post is not duplicate (simple content comparison)
      const isDuplicate = posts.some(p => p.content === content);
      if (!isDuplicate && content !== "Content not found" && content.length > 5) {
        posts.push(post);
        console.log(`Post scraped: ${author} - ${content.substring(0, 50)}...`);
        return true;
      }
      return false;
    } catch (error) {
      console.warn("Error processing post:", error);
      return false;
    }
  }
  
  // Download data as JSON file
  function downloadData() {
    try {
      const dataStr = JSON.stringify(posts, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'facebook_posts'+ '.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      console.log(`Data downloaded: ${posts.length} posts saved to ${exportFileDefaultName}`);
    } catch (error) {
      console.error("Error downloading data:", error);
      alert("Error downloading data. Check console for details.");
    }
  }
  
  // Scroll function to load more content
  async function scrollDown() {
    window.scrollTo(0, document.body.scrollHeight);
    scrollCount++;
    console.log(`Scroll #${scrollCount}/${config.maxScrolls} completed`);
    await sleep(config.scrollDelay);
  }
  

// Main function to start scraping
async function startScraping() {
  console.log("Facebook posts scraper started...");
  console.log(`To stop scraping, type: window.${config.stopVariableName} = "stop"`);
  
  try {
    // Initial scroll to load content
    await scrollDown();
    
    // Main loop
    while (scrollCount < config.maxScrolls && !stopSignal) {
      // Check for stop signal
      if (checkForStopSignal()) {
        break;
      }
      
      // Find all elements on the page
      const allElements = document.querySelectorAll('div[class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd"]');
      console.log(`Found ${allElements.length} elements on the page`);
      
      // Process each element
      let newPostsCount = 0;
      for (let i = 0; i < allElements.length; i++) {
        if (checkForStopSignal()) break;
        
        const added = await processPost(allElements[i]);
        if (added) newPostsCount++;
        
        // Pause briefly between processing elements to avoid overloading
        await sleep(config.pauseBetweenActions / 2);
      }
      
      console.log(`Processed ${newPostsCount} new posts. Total posts: ${posts.length}`);
      
      // Scroll down to load more
      await scrollDown();
    }
    
    // Finalize and download data
    console.log("Scraping completed!");
    console.log(`Total posts scraped: ${posts.length}`);
    
    if (posts.length > 0) {
      downloadData();
    } else {
      console.warn("No posts were scraped. Try adjusting the selectors or scrolling manually first.");
    }
    
  } catch (error) {
    console.error("Error in scraping process:", error);
  }
}

// ...existing code...
  
  // Start the scraping process
  startScraping();