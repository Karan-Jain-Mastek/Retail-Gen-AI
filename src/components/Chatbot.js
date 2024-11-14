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
          // Wait a little bit after initialization for images to render
          setTimeout(() => {
            replaceLogos(); // Try replacing logos after a short delay
          }, 1000); // 1 second delay, adjust as needed

          // Use MutationObserver to detect when images are added to the DOM
          observeImageChanges();
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

        const firstImage = document.querySelector('img[src="https://image.isu.pub/220606134901-e7dc18a7c73e787292ff81100bf50b56/jpg/page_1_thumb_large.jpg"] [alt="logo"] [style="width: 40px; height: 40px; margin-right: 10px; border-radius: 12.5px"]');
        if (firstImage) {
          firstImage.src = '/mastek_branding_logo_image.jpg';
        } else {
            console.log('First image not found.');
        }
  
        const secondImage = document.querySelector('img[alt="Logo"] [src="https://image.isu.pub/220606134901-e7dc18a7c73e787292ff81100bf50b56/jpg/page_1_thumb_large.jpg"] [style="width: 30px; height: 30px; top: 21%; border-radius: 50%; margin-left: 4px"]');
        if (secondImage) {
          secondImage.src = '/mastek_branding_logo_image.jpg';
        } else {
            console.log('Second image not found.');
        }
  
        const thirdImage = document.querySelector('img[src="https://image.isu.pub/220606134901-e7dc18a7c73e787292ff81100bf50b56/jpg/page_1_thumb_large.jpg"] [alt="Company Logo"] [style="width: 100px; height: 100px; margin-bottom: 2px; border-radius: 12.5px"]');
        if (thirdImage) {
          thirdImage.src = '/chatbot.png';
        } else {
            console.log('Third image not found.');
        }

        console.log('All logos replaced successfully.');
      };

    // Use MutationObserver to watch for DOM changes and detect image insertion
    const observeImageChanges = () => {
      const observer = new MutationObserver(() => {
        // Check for new images in the DOM
        const firstImage = document.querySelector('img[src="https://image.isu.pub/220606134901-e7dc18a7c73e787292ff81100bf50b56/jpg/page_1_thumb_large.jpg"] [alt="logo"] [style="width: 40px; height: 40px; margin-right: 10px; border-radius: 12.5px"]');
        const secondImage = document.querySelector('img[alt="Logo"] [src="https://image.isu.pub/220606134901-e7dc18a7c73e787292ff81100bf50b56/jpg/page_1_thumb_large.jpg"] [style="width: 30px; height: 30px; top: 21%; border-radius: 50%; margin-left: 4px"]');
        const thirdImage = document.querySelector('img[src="https://image.isu.pub/220606134901-e7dc18a7c73e787292ff81100bf50b56/jpg/page_1_thumb_large.jpg"] [alt="Company Logo"] [style="width: 100px; height: 100px; margin-bottom: 2px; border-radius: 12.5px"]');

        if (firstImage && secondImage && thirdImage) {
          // Replace the images as soon as all are found
          firstImage.src = '/mastek_branding_logo_image.jpg';
          secondImage.src = '/mastek_branding_logo_image.jpg';
          thirdImage.src = '/mastek_logo.jpg';

          console.log('Logos replaced successfully.');
          observer.disconnect(); // Stop observing after images are replaced
        }
      });

      // Start observing the body (or a more specific container if you know where the images are)
      observer.observe(document.body, { childList: true, subtree: true });
    };

    // Cleanup: Remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // No need to render anything here, as the button is managed by the API
};

export default Chatbot;
