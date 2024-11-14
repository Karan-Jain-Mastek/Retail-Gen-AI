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
          // Now that the widget is initialized, let's replace the images
          replaceLogos();
        } catch (error) {
          console.error('Error initializing WidgetV3:', error);
        }
      } else {
        console.error('WidgetV3 function is not defined.');
      }
    };

    // Ensure the widget script is loaded and then initialize it
    script.onload = initializeWidget;

    // Image replacement function
    const replaceLogos = () => {
      // Check every 500ms if the images have been loaded
      const intervalId = setInterval(() => {  

        const firstImage = document.querySelector('img[src="https://image.isu.pub/220606134901-e7dc18a7c73e787292ff81100bf50b56/jpg/page_1_thumb_large.jpg"] [alt="logo"] [style="width: 40px; height: 40px; margin-right: 10px; border-radius: 12.5px"]');
        if (firstImage) {
          firstImage.src = 'mastek_branding_logo_image.jpg';
        } else {
            console.log('First image not found.');
        }
  
        const secondImage = document.querySelector('img[alt="Logo"] [src="https://image.isu.pub/220606134901-e7dc18a7c73e787292ff81100bf50b56/jpg/page_1_thumb_large.jpg"] [style="width: 30px; height: 30px; top: 21%; border-radius: 50%; margin-left: 4px"]');
        if (secondImage) {
          secondImage.src = 'mastek_branding_logo_image.jpg';
        } else {
            console.log('Second image not found.');
        }
  
        const thirdImage = document.querySelector('img[src="https://image.isu.pub/220606134901-e7dc18a7c73e787292ff81100bf50b56/jpg/page_1_thumb_large.jpg"] [alt="Company Logo"] [style="width: 100px; height: 100px; margin-bottom: 2px; border-radius: 12.5px"]');
        if (thirdImage) {
          thirdImage.src = 'mastek_logo.jpg';
        } else {
            console.log('Third image not found.');
        }
  
        // If all images are replaced, stop the interval
        if (firstImage && secondImage && thirdImage) {
          clearInterval(intervalId);
          console.log('All logos replaced successfully.');
        }
      }, 500); // Check every 500ms
    };

    // Cleanup: Remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // No need to render anything here, as the button is managed by the API
};

export default Chatbot;
