#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const PID_FILE = path.join(__dirname, '..', '.server-pid');
const LOCK_FILE = path.join(__dirname, '..', '.server-lock');

function stopServer() {
  try {
    // Check if PID file exists
    if (fs.existsSync(PID_FILE)) {
      const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'));
      
      console.log(`Attempting to stop server with PID: ${pid}`);
      
      try {
        // Try to kill the process
        process.kill(pid, 'SIGTERM');
        console.log(`✅ Server with PID ${pid} has been stopped.`);
      } catch (err) {
        if (err.code === 'ESRCH') {
          console.log(`Server with PID ${pid} was not running.`);
        } else {
          console.error(`Error stopping server: ${err.message}`);
        }
      }
      
      // Remove PID file
      fs.unlinkSync(PID_FILE);
    } else {
      console.log('No PID file found. Server may not be running.');
    }
    
    // Remove lock file if it exists
    if (fs.existsSync(LOCK_FILE)) {
      fs.unlinkSync(LOCK_FILE);
      console.log('✅ Lock file removed.');
    }
    
    console.log('Server stopped and lock files cleaned up.');
  } catch (err) {
    console.error(`Error stopping server: ${err.message}`);
    process.exit(1);
  }
}

// Run the stop function
stopServer();