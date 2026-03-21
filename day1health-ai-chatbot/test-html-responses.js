// Test script to demonstrate HTML responses from the chatbot
// Run with: node test-html-responses.js

const testMessages = [
  {
    name: "Simple HTML Greeting",
    response: {
      messageType: "text",
      content: {
        text: "<p>Welcome to <strong>Day1Health</strong>! 👋</p><p>I'm here to help you find the perfect medical insurance plan.</p>"
      }
    }
  },
  {
    name: "Styled Feature List",
    response: {
      messageType: "text",
      content: {
        text: `<div class='space-y-3'>
          <p class='font-semibold text-lg text-teal-900'>Day-to-Day Plan Benefits:</p>
          <ul class='space-y-2 list-none'>
            <li>✅ <strong>GP Visits:</strong> Unlimited consultations</li>
            <li>✅ <strong>Acute Medication:</strong> Prescribed by your doctor</li>
            <li>✅ <strong>Basic Dentistry:</strong> Cleanings and check-ups</li>
            <li>✅ <strong>Optometry:</strong> Eye tests and glasses</li>
          </ul>
          <p class='text-sm text-gray-600 mt-3'>Starting at just <span class='font-bold text-teal-600'>R385/month</span></p>
        </div>`
      }
    }
  },
  {
    name: "Information Box",
    response: {
      messageType: "text",
      content: {
        text: `<div class='bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg'>
          <p class='font-semibold text-indigo-900 mb-2'>💡 Did You Know?</p>
          <p class='text-indigo-800'>Comprehensive plans combine day-to-day AND hospital cover, giving you complete peace of mind for just <strong>R665/month</strong>!</p>
        </div>`
      }
    }
  },
  {
    name: "Comparison Table",
    response: {
      messageType: "text",
      content: {
        text: `<div class='space-y-3'>
          <p class='font-semibold text-lg'>Quick Comparison:</p>
          <div class='overflow-x-auto'>
            <table class='w-full text-sm border-collapse'>
              <thead>
                <tr class='bg-gray-100 border-b-2 border-gray-300'>
                  <th class='text-left py-2 px-3'>Feature</th>
                  <th class='text-left py-2 px-3'>Day-to-Day</th>
                  <th class='text-left py-2 px-3'>Hospital</th>
                  <th class='text-left py-2 px-3'>Comprehensive</th>
                </tr>
              </thead>
              <tbody>
                <tr class='border-b'>
                  <td class='py-2 px-3 font-medium'>GP Visits</td>
                  <td class='py-2 px-3 text-green-600'>✓ Unlimited</td>
                  <td class='py-2 px-3 text-red-600'>✗ Not covered</td>
                  <td class='py-2 px-3 text-green-600'>✓ Unlimited</td>
                </tr>
                <tr class='border-b'>
                  <td class='py-2 px-3 font-medium'>Hospital Stays</td>
                  <td class='py-2 px-3 text-red-600'>✗ Not covered</td>
                  <td class='py-2 px-3 text-green-600'>✓ Up to R500k</td>
                  <td class='py-2 px-3 text-green-600'>✓ Up to R500k</td>
                </tr>
                <tr class='border-b'>
                  <td class='py-2 px-3 font-medium'>Chronic Meds</td>
                  <td class='py-2 px-3 text-red-600'>✗ Not covered</td>
                  <td class='py-2 px-3 text-red-600'>✗ Not covered</td>
                  <td class='py-2 px-3 text-green-600'>✓ 27 conditions</td>
                </tr>
                <tr>
                  <td class='py-2 px-3 font-medium'>Price</td>
                  <td class='py-2 px-3 font-bold text-teal-600'>R385/mo</td>
                  <td class='py-2 px-3 font-bold text-indigo-600'>R390/mo</td>
                  <td class='py-2 px-3 font-bold text-purple-600'>R665/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>`
      }
    }
  },
  {
    name: "Multi-section Response",
    response: {
      messageType: "text",
      content: {
        text: `<div class='space-y-4'>
          <div>
            <h4 class='font-bold text-lg text-purple-900 mb-2'>Executive Plan Overview</h4>
            <p class='text-gray-700'>Our premium comprehensive plan with the highest benefit limits.</p>
          </div>
          
          <div class='bg-purple-50 p-4 rounded-lg'>
            <p class='font-semibold text-purple-900 mb-2'>Key Features:</p>
            <ul class='space-y-1 text-purple-800'>
              <li>🏥 Hospital cover up to <strong>R1,000,000</strong></li>
              <li>👨‍⚕️ Unlimited GP and specialist visits</li>
              <li>💊 Chronic medication for 27+ conditions</li>
              <li>🦷 Advanced dental procedures</li>
            </ul>
          </div>
          
          <div class='border-t pt-3'>
            <p class='text-sm text-gray-600'>
              <strong>Price:</strong> R665 per adult + R266 per child<br>
              <strong>Waiting Period:</strong> 3 months general, 12 months specific
            </p>
          </div>
        </div>`
      }
    }
  }
];

console.log("=".repeat(80));
console.log("HTML RESPONSE EXAMPLES FOR DAY1HEALTH CHATBOT");
console.log("=".repeat(80));
console.log("\nThese examples show how the bot can return beautifully formatted HTML responses.\n");

testMessages.forEach((test, index) => {
  console.log(`\n${index + 1}. ${test.name}`);
  console.log("-".repeat(80));
  console.log("JSON Response:");
  console.log(JSON.stringify(test.response, null, 2));
  console.log("\nRendered HTML Preview:");
  console.log(test.response.content.text);
  console.log("-".repeat(80));
});

console.log("\n✅ All examples generated successfully!");
console.log("\nTo test in the actual chatbot:");
console.log("1. Start the dev server: npm run dev");
console.log("2. Open http://localhost:3000");
console.log("3. Ask questions and the bot will respond with formatted HTML");
console.log("\nThe bot will automatically use HTML when it makes responses more readable!");
