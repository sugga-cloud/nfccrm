const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const paths = {
  reactApp: path.join(__dirname, 'digital-profile-hub'),
  laravelServer: path.join(__dirname, 'dph-server'),
  reactDist: path.join(__dirname, 'digital-profile-hub', 'dist'), // Change to 'build' if using Create React App
  laravelPublic: path.join(__dirname, 'dph-server', 'public'),
};

async function deploy() {
  try {
    console.log('🚀 Starting Deployment Process...');

    // 1. Build the React Project
    console.log('📦 Building React project...');
    execSync('npm run build', { cwd: paths.reactApp, stdio: 'inherit' });

    // 2. Clear old assets in Laravel public (optional but recommended)
    // Be careful not to delete Laravel's native files like index.php or robots.txt
    console.log('🧹 Cleaning target directory...');
    const itemsToPreserve = ['index.php', '.htaccess', 'favicon.ico', 'robots.txt', 'storage'];
    const existingFiles = fs.readdirSync(paths.laravelPublic);
    
    for (const file of existingFiles) {
      if (!itemsToPreserve.includes(file)) {
        fs.removeSync(path.join(paths.laravelPublic, file));
      }
    }

    // 3. Copy Build Assets to Laravel Public
    console.log('📂 Copying assets to Laravel...');
    fs.copySync(paths.reactDist, paths.laravelPublic);

    // 4. Rename index.html to app.html
    const oldPath = path.join(paths.laravelPublic, 'index.html');
    const newPath = path.join(paths.laravelPublic, 'app.html');

    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log('✅ Successfully renamed index.html to app.html');
    }

    console.log('🎉 Deployment Complete! Your React app is now hosted at /app.html');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
  }
}

deploy();