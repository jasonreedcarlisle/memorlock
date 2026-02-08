#!/usr/bin/env node

/**
 * Memorlock Deployment Tool
 * Simple script to handle deployments to staging and production
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const SERVER_USER = 'ubuntu';
const SERVER_IP = '100.22.228.18';
const STAGING_DIR = '/home/ubuntu/hippomemory-staging';
const PRODUCTION_DIR = '/home/ubuntu/hippomemory-production';
const PROJECT_DIR = __dirname;

function exec(command, options = {}) {
  try {
    console.log(`\n📋 Running: ${command}\n`);
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'inherit',
      ...options 
    });
    return output;
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function commitAndPush(branch) {
  console.log(`\n📝 Committing and pushing to ${branch}...`);
  
  // Check if there are changes
  try {
    execSync('git diff --quiet && git diff --cached --quiet', { stdio: 'ignore' });
    console.log('ℹ️  No changes to commit.');
    return false;
  } catch (e) {
    // There are changes
  }
  
  const message = await question('Enter commit message: ');
  if (!message.trim()) {
    console.log('❌ Commit message required. Aborting.');
    return false;
  }
  
  exec(`git add .`);
  exec(`git commit -m "${message}"`);
  exec(`git checkout ${branch}`);
  if (branch === 'staging') {
    exec(`git merge main`);
  }
  exec(`git push origin ${branch}`);
  exec(`git checkout main`);
  
  return true;
}

function deployToServer(environment) {
  const dir = environment === 'staging' ? STAGING_DIR : PRODUCTION_DIR;
  const script = environment === 'staging' ? 'deploy-staging.sh' : 'deploy-production.sh';
  
  console.log(`\n🚀 Deploying to ${environment}...`);
  console.log(`📡 Connecting to server...`);
  
  const command = `ssh ${SERVER_USER}@${SERVER_IP} "cd ${dir} && ./${script}"`;
  exec(command);
}

async function deployToStaging() {
  console.log('\n🎯 Deploying to Staging');
  console.log('='.repeat(50));
  
  const committed = await commitAndPush('staging');
  if (!committed) {
    const proceed = await question('\nNo new commits. Deploy anyway? (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
      console.log('❌ Deployment cancelled.');
      return;
    }
  }
  
  deployToServer('staging');
  
  console.log('\n✅ Staging deployment complete!');
  console.log('🌐 Test at: https://staging.memorlock.com');
}

async function deployToProduction() {
  console.log('\n🎯 Deploying to Production');
  console.log('='.repeat(50));
  
  // First deploy to staging
  console.log('\n📋 Step 1: Deploying to staging first (for testing)...');
  const stagingCommitted = await commitAndPush('staging');
  if (!stagingCommitted) {
    const proceed = await question('\nNo new commits. Deploy to staging anyway? (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
      console.log('❌ Deployment cancelled.');
      return;
    }
  }
  deployToServer('staging');
  
  // Ask for confirmation before production
  console.log('\n⚠️  Staging deployed. Please test at https://staging.memorlock.com');
  const confirm = await question('\nDeploy to PRODUCTION? (yes/no): ');
  if (confirm.toLowerCase() !== 'yes') {
    console.log('❌ Production deployment cancelled.');
    return;
  }
  
  // Deploy to production
  console.log('\n📋 Step 2: Deploying to production...');
  exec(`git checkout main`);
  exec(`git merge staging`);
  exec(`git push origin main`);
  deployToServer('production');
  
  console.log('\n✅ Production deployment complete!');
  console.log('🌐 Live at: https://memorlock.com');
}

async function main() {
  console.log('\n🎮 Memorlock Deployment Tool');
  console.log('='.repeat(50));
  console.log('1. Deploy to Staging');
  console.log('2. Deploy to Production (via Staging)');
  console.log('3. Exit');
  
  const choice = await question('\nSelect option (1-3): ');
  
  // Change to project directory
  process.chdir(PROJECT_DIR);
  
  switch(choice) {
    case '1':
      await deployToStaging();
      break;
    case '2':
      await deployToProduction();
      break;
    case '3':
      console.log('👋 Goodbye!');
      break;
    default:
      console.log('❌ Invalid option.');
  }
  
  rl.close();
}

// Handle command line arguments
const arg = process.argv[2];
if (arg === 'staging') {
  process.chdir(PROJECT_DIR);
  deployToStaging().then(() => rl.close()).catch(error => {
    console.error('❌ Error:', error);
    rl.close();
    process.exit(1);
  });
} else if (arg === 'production') {
  process.chdir(PROJECT_DIR);
  deployToProduction().then(() => rl.close()).catch(error => {
    console.error('❌ Error:', error);
    rl.close();
    process.exit(1);
  });
} else {
  main().catch(error => {
    console.error('❌ Error:', error);
    rl.close();
    process.exit(1);
  });
}
