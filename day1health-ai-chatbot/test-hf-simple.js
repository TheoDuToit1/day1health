// Simple test for Hugging Face API
const { HfInference } = require('@huggingface/inference');

const token = process.env.HUGGINGFACE_API_KEY || 'your_token_here';
const hf = new HfInference(token);

async function test() {
  try {
    console.log('Testing Hugging Face API...');
    
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: 'User: Hello\nAssistant:',
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
        return_full_text: false,
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
