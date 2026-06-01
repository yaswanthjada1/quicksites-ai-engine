// chat-agent.js
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let sharedCodeState = ""; // Tracks your component's code across multiple prompts

console.log("🤖 QuickSites AI Engine - Interactive Terminal Tester");
console.log("Type your component request below. Type 'exit' to quit.\n");

function askPrompt() {
  rl.question('👤 User Prompt: ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    console.log("⏳ Brainstorming and writing code...");

    try {
      const response = await fetch('http://localhost:5000/api/generate', {
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
      console.log(`❌ Network Failure: Could not reach the server. Make sure 'npm run dev' is running.`);
    }

    askPrompt(); // Loop the interface
  });
}

// Fire up the interface loop
askPrompt();