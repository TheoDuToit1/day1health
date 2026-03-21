// Simple test to check if API key works
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyULJuFntyGd_cHJKjL6mfbUtdUBIDty1k';
const genAI = new GoogleGenerativeAI(apiKey);

async function testAPI() {
  try {
    console.log('Testing API key...');
    
    // Try gemini-pro
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Say hello');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS! API key works!');
    console.log('Response:', text);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Status:', error.status);
    
    // Try listing models
    try {
      console.log('\nTrying to list available models...');
      const models = await genAI.listModels();
      console.log('Available models:', models);
    } catch (listError) {
      console.error('Could not list models:', listError.message);
    }
  }
}

testAPI();
