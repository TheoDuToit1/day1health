// Test chat completion with a free model
const { HfInference } = require('@huggingface/inference');

const token = process.env.HUGGINGFACE_API_KEY || 'your_token_here';
const hf = new HfInference(token);

async function test() {
  try {
    console.log('Testing chat completion with Qwen...');
    
    const response = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        { role: 'user', content: 'Hello, can you help me with health insurance?' }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    console.log('✅ SUCCESS!');
    console.log('Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

test();
