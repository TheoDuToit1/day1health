import React from 'react';

const FacebookButton: React.FC = () => {
  return (
    <div className="light-button">
      <button className="bt">
        <div className="light-holder">
          <div className="dot"></div>
          <div className="light"></div>
        </div>
        <div className="button-holder">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            fill="currentColor"
            className="bi bi-facebook text-blue-600"
            viewBox="0 0 16 16"
          >
            <path
              d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"
            ></path>
          </svg>
          <p>Facebook</p>
        </div>
      </button>
      <style>{`
        .light-button {
          margin-top: 20px;
        }
        .light-button button.bt {
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

        .light-button button.bt .button-holder {
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

        .light-button button.bt .button-holder svg {
          height: 50px;
          fill: #0f0f0f;
          transition: 300ms;
        }

        .light-button button.bt .light-holder {
          position: absolute;
          height: 200px;
          width: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .light-button button.bt .light-holder .dot {
          position: absolute;
          top: 0;
          width: 10px;
          height: 10px;
          background-color: #0a0a0a;
          border-radius: 10px;
          z-index: 2;
        }

        .light-button button.bt .light-holder .light {
          position: absolute;
          top: 0;
          width: 200px;
          height: 200px;
          clip-path: polygon(50% 0%, 25% 100%, 75% 100%);
          background: transparent;
        }

        .light-button button.bt:hover .button-holder svg {
          fill: rgb(66, 81, 245);
        }

        .light-button button.bt:hover .button-holder {
          color: rgba(66, 81, 245);
          outline: rgba(66, 81, 245) 2px solid;
          outline-offset: 2px;
        }

        .light-button button.bt:hover .light-holder .light {
          background: rgb(255, 255, 255);
          background: linear-gradient(
            180deg,
            rgba(66, 81, 245) 0%,
            rgba(255, 255, 255, 0) 75%,
            rgba(255, 255, 255, 0) 100%
          );
        }
      `}</style>
    </div>
  );
};

export default FacebookButton;
