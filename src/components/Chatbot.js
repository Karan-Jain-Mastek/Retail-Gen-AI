import { useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  useEffect(() => {
    // Create script element for the chatbot widget
    const script = document.createElement('script');
    script.id = '__intelli__assist--Widget';
    script.src = 'https://api-staging.intelli-assist.com/Static-QA/js/widgetV3.js?corporate=MastekQA&env=QA&widgetID=KindThread'; 
    script.async = true;

    // Append the script to the body
    document.body.appendChild(script);

    // Function to initialize the widget
    const initializeWidget = () => {
      if (typeof window.WidgetV3 === 'function') {
        try {
          new window.WidgetV3();
          console.log('WidgetV3 initialized successfully.');
        } catch (error) {
          console.error('Error initializing WidgetV3:', error);
        }
      } else {
        console.error('WidgetV3 function is not defined.');
      }
    };

    // Ensure the widget script is loaded and then initialize it
    script.onload = initializeWidget;

    // Cleanup: Remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // No need to render anything here, as the button is managed by the API
};

export default Chatbot;
