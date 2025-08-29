export const speakText = (text: string) => {
  // Check if the browser supports the Web Speech API
  if ('speechSynthesis' in window) {
    // Stop any currently playing speech
    window.speechSynthesis.cancel();
    
    // Create a new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoices = [
      'Google UK English Female',
      'Google UK English Male',
      'Google US English',
      'Microsoft David - English (United States)',
      'Microsoft Zira - English (United States)'
    ];
    
    // Try to find a preferred voice, or use the first available one
    const voice = voices.find(v => preferredVoices.includes(v.name)) || voices[0];
    if (voice) {
      utterance.voice = voice;
    }
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
    
    return {
      stop: () => window.speechSynthesis.cancel(),
      isSpeaking: () => window.speechSynthesis.speaking
    };
  } else {
    console.warn('Text-to-speech not supported in this browser');
    return {
      stop: () => {},
      isSpeaking: () => false
    };
  }
};
