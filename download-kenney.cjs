const fs = require('fs');
const https = require('https');
const path = require('path');
const { execSync } = require('child_process');

const url = 'https://kenney.nl/content/3-assets/4-city-kit-roads/city-kit-roads.zip';
const zipPath = path.join(__dirname, 'city-kit-roads.zip');

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  if (res.statusCode !== 200 && res.statusCode !== 302) {
    console.error(`Failed to download: ${res.statusCode}`);
    return;
  }
  
  // Handle redirect if needed (Kenney might use 302)
  if (res.statusCode === 302) {
    console.log("Redirected to: ", res.headers.location);
    https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
        const fileStream = fs.createWriteStream(zipPath);
        res2.pipe(fileStream);
        fileStream.on('finish', () => {
            fileStream.close();
            try {
                execSync(`powershell -command "Expand-Archive -Force '${zipPath}' 'kenney-roads'"`);
                console.log('Unzipped.');
            } catch (e) {
                console.log("Unzip failed", e);
            }
        });
    });
  } else {
    const fileStream = fs.createWriteStream(zipPath);
    res.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();
      try {
          execSync(`powershell -command "Expand-Archive -Force '${zipPath}' 'kenney-roads'"`);
          console.log('Unzipped.');
      } catch (e) {
          console.log("Unzip failed", e);
      }
    });
  }
}).on('error', (err) => {
  console.error('Error:', err.message);
});
