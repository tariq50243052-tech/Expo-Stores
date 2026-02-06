const https = require('https');
const fs = require('fs');
const path = require('path');

// Specific high-quality Al Wasl Plaza image from Unsplash
const url = "https://images.unsplash.com/photo-1546412414-e1885259563a?q=80&w=1974&auto=format&fit=crop"; 
const dest = path.join(__dirname, 'client/src/assets/login-bg.jpg');

const download = (url, dest, cb) => {
  const file = fs.createWriteStream(dest);
  const request = https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  }, (response) => {
    // Handle redirects
    if (response.statusCode === 301 || response.statusCode === 302) {
      return download(response.headers.location, dest, cb);
    }

    if (response.statusCode !== 200) {
      console.error(`Failed to download: Status Code ${response.statusCode}`);
      fs.unlink(dest, () => {}); // Delete partial file
      return;
    }

    response.pipe(file);
    file.on('finish', () => {
      file.close(cb);
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error('Error downloading image:', err.message);
  });
};

console.log(`Downloading to ${dest}...`);
download(url, dest, () => {
  console.log('Download completed!');
});
