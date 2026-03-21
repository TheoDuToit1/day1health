// Test conversational API
const { HfInference } = require('@huggingface/inference');

const token = process.env.HUGGINGFACE_API_KEY || 'your_token_here';
const hf = new HfInference(token);

async function test() {
  try {
    console.log('Testing Hugging Face Conversational API...');
    
    const response = await hf.conversational({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: {
        text: 'Hello, can you help me with health insurance?',
        past_user_inputs: [],
        generated_responses: [],
      },
      parameters: {
        max_length: 200,
        temperature: 0.7,
      },
    });

    console.log('✅ SUCCESS!');
    console.log('Response:', response.generated_text);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Full error:', error);
  }
}

test();
