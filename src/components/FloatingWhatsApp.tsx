// Floating WhatsApp button (bottom-right)
// Opens WhatsApp chat to the configured number
export default function FloatingWhatsApp() {
  // SA number 072 720 5511 -> WhatsApp international format 27727205511
  const whatsappHref = 'https://wa.me/27727205511';
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full flex items-center justify-center shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 cursor-pointer select-none"
      style={{ backgroundColor: '#25D366' }}
      title="Chat with us on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M20.52 3.48A11.9 11.9 0 0 0 12.06 0C5.46 0 .08 5.38.06 12.01A11.94 11.94 0 0 0 1.6 17.5L0 24l6.66-1.74a11.96 11.96 0 0 0 5.4 1.34h.02c6.62 0 12-5.38 12.02-12A11.93 11.93 0 0 0 20.52 3.48ZM12.08 21.5c-1.7 0-3.35-.44-4.8-1.28l-.35-.2-3.56.93.95-3.48-.22-.36A9.44 9.44 0 0 1 2.63 12C2.65 6.7 6.78 2.56 12.08 2.56c2.5 0 4.86.97 6.64 2.73a9.33 9.33 0 0 1 2.74 6.62c-.02 5.3-4.15 9.59-9.38 9.59Zm5.15-7.19c-.28-.14-1.67-.82-1.92-.92-.26-.09-.45-.14-.64.14-.19.28-.73.92-.89 1.1-.16.19-.33.21-.61.07-.28-.14-1.19-.43-2.27-1.41-.84-.75-1.41-1.68-1.58-1.96-.16-.28-.02-.43.13-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.49.09-.2.05-.37-.02-.52-.07-.15-.64-1.54-.88-2.1-.23-.56-.46-.48-.64-.5-.16-.01-.35-.01-.54-.01-.2 0-.52.07-.79.37-.28.28-1.08 1.05-1.08 2.57 0 1.52 1.11 2.98 1.27 3.19.16.21 2.19 3.35 5.32 4.7.74.32 1.32.51 1.77.65.74.24 1.41.2 1.94.12.59-.09 1.79-.69 2.06-1.36.25-.66.25-1.24.17-1.36-.07-.12-.28-.19-.57-.33Z" />
      </svg>
    </a>
  );
}
