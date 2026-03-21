// Test with a different model that supports text generation
const { HfInference } = require('@huggingface/inference');

const token = process.env.HUGGINGFACE_API_KEY || 'your_token_here';
const hf = new HfInference(token);

async function test() {
  try {
    console.log('Testing with microsoft/Phi-3-mini-4k-instruct...');
    
    const response = await hf.textGeneration({
      model: 'microsoft/Phi-3-mini-4k-instruct',
      inputs: '<|user|>\nHello, can you help me with health insurance?<|end|>\n<|assistant|>\n',
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        return_full_text: false,
      },
    });

    console.log('✅ SUCCESS!');
    console.log('Response:', response.generated_text);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

test();
