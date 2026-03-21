// Test Hugging Face API with new endpoint
const { HfInference } = require('@huggingface/inference');

const token = process.env.HUGGINGFACE_API_KEY || 'your_token_here';
const hf = new HfInference(token, {
  baseUrl: 'https://router.huggingface.co',
});

async function test() {
  try {
    console.log('Testing Hugging Face API with new endpoint...');
    
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: 'Say hello in one sentence.',
      parameters: {
        max_new_tokens: 50,
        temperature: 0.7,
        return_full_text: false,
      },
    });

    console.log('✅ SUCCESS!');
    console.log('Response:', response.generated_text);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

test();
