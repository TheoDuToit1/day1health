import React from 'react';

type WhatsAppButtonProps = {
  phone?: string; // E.g. 27727205511 (no plus, no spaces)
  presetText?: string;
};

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phone = '27727205511',
  presetText = 'Hello Day1 Health',
}) => {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(presetText)}`;
  return (
    <div className="light-button">
      <a className="bt" href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <div className="light-holder">
          <div className="dot"></div>
          <div className="light"></div>
        </div>
        <div className="button-holder">
          <svg className="socialSvg whatsappSvg text-green-600" viewBox="0 0 16 16">
            <path
              d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"
            ></path>
          </svg>
          <p>WhatsApp</p>
        </div>
      </a>
      <style>{`
        .light-button {
          margin-top: 20px;
        }
        .light-button .bt {
          position: relative;
          height: 200px;
          display: flex;
          align-items: flex-end;
          outline: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .light-button .bt .button-holder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100px;
          width: 100px;
          background-color: #0a0a0a;
          border-radius: 5px;
          color: #0f0f0f;
          font-weight: 700;
          transition: 300ms;
          outline: #0f0f0f 2px solid;
          outline-offset: 20;
        }

        .light-button .bt .button-holder svg {
          height: 50px;
          fill: #0f0f0f;
          transition: 300ms;
        }

        .light-button .bt .light-holder {
          position: absolute;
          height: 200px;
          width: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .light-button .bt .light-holder .dot {
          position: absolute;
          top: 0;
          width: 10px;
          height: 10px;
          background-color: #0a0a0a;
          border-radius: 10px;
          z-index: 2;
        }

        .light-button .bt .light-holder .light {
          position: absolute;
          top: 0;
          width: 200px;
          height: 200px;
          clip-path: polygon(50% 0%, 25% 100%, 75% 100%);
          background: transparent;
        }

        .light-button .bt:hover .button-holder svg {
          fill: rgba(0, 215, 87, 1);
        }

        .light-button .bt:hover .button-holder {
          color: rgba(0, 215, 87, 1);
          outline: rgba(0, 215, 87, 1) 2px solid;
          outline-offset: 2px;
        }

        .light-button .bt:hover .light-holder .light {
          background: rgb(255, 255, 255);
          background: linear-gradient(
            180deg,
            rgba(0, 215, 87, 1) 0%,
            rgba(255, 255, 255, 0) 75%,
            rgba(255, 255, 255, 0) 100%
          );
        }
      `}</style>
    </div>
  );
};

export default WhatsAppButton;
