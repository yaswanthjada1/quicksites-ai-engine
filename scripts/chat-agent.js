import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 🧠 DYNAMIC PORT CHECKER FOR DEV TESTING
// If your server tells you it booted on port 53241, you can run: NODE_PORT=53241 node scripts/chat-agent.js
const TARGET_PORT = process.env.NODE_PORT || 5001;
const API_URL = `http://localhost:${TARGET_PORT}/api/generate`;

let sharedCodeState = ""; // Tracks your component's code across multiple prompts

console.log("🤖 QuickSites AI Engine - Interactive Terminal Tester");
console.log(`📡 Target API Gateway: ${API_URL}`);
console.log("Type your component request below. Type 'exit' to quit.\n");

function askPrompt() {
  rl.question('👤 User Prompt: ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    console.log("⏳ Brainstorming and writing code...");

    try {
      // 📡 Dynamic endpoint targeting based on active infrastructure runtime
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: input,
          currentCode: sharedCodeState
        })
      });

      const data = await response.json();

      if (data.error) {
        console.log(`❌ Engine Error: ${data.error}`);
      } else {
        // Save the updated code to state so subsequent requests can modify it
        sharedCodeState = data.code;

        console.log(`\n🤖 Agent Action: ${data.layoutSummary}`);
        console.log(`🎯 Component Target: ${data.componentTarget}`);
        console.log("💻 Compiled React Code Block:");
        console.log("------------------------------------------------");
        console.log(sharedCodeState);
        console.log("------------------------------------------------\n");
      }
    } catch (err) {
      console.log(`\n❌ Network Failure: Could not reach the server at ${API_URL}`);
      console.log(`👉 Check your server terminal. If it's running on a dynamic port (e.g., 53241), exit this script and run:`);
      console.log(`   Windows (CMD):  set NODE_PORT=53241 && node scripts/chat-agent.js`);
      console.log(`   Windows (PowerShell): $env:NODE_PORT="53241"; node scripts/chat-agent.js\n`);
    }

    askPrompt(); // Loop the interface
  });
}

// Fire up the interface loop
askPrompt();