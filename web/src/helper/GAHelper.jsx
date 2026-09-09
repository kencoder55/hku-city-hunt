/**
 * Google Analytics Helper
 * Format and send events to Google Analytics (GA) in a consistent way across the application.
 */

/**
 * Send a custom event to Google Analytics
 * @param {string} eventName - Event name (e.g., 'button_click', 'form_submit')
 * @param {object} eventParams - Event parameters (e.g., { button_name: 'submit_form', page_location: '/contact' })
 *
 * @example
 * sendGAEvent('button_click', {
 *   button_name: 'submit_form',
 *   page_location: '/contact'
 * });
 */
export const sendGAEvent = (eventName, eventParams = {}) => {
  // Mock GA events in development environment to avoid polluting real analytics data
  if (process.env.NODE_ENV === "development") {
    console.log("[GA Event - Development]", eventName, eventParams);
    return;
  }

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
};

/**
 * Track a page view
 * @param {string} url - Page URL
 * @param {string} title - Page title
 */
export const sendPageView = (url, title) => {
  sendGAEvent("page_view", {
    page_location: url,
    page_title: title,
  });
};

/**
 * Track a button click
 * @param {string} buttonName - Button name (e.g., 'submit_form', 'add_to_cart')
 * @param {object} additionalParams - Additional parameters to include with the event (e.g., { page_location: '/contact' })
 */
export const sendButtonClick = (buttonName, additionalParams = {}) => {
  sendGAEvent("button_click", {
    button_name: buttonName,
    ...additionalParams,
  });
};

/**
 * Track a form submission
 * @param {string} formName - Form name (e.g., 'contact_form', 'signup_form')
 * @param {object} additionalParams - Additional parameters to include with the event (e.g., { page_location: '/contact' })
 */
export const sendFormSubmit = (formName, additionalParams = {}) => {
  sendGAEvent("form_submit", {
    form_name: formName,
    ...additionalParams,
  });
};

/**
 * Track a user login
 * @param {object} additionalParams - Additional parameters
 */
export const sendLogin = (additionalParams = {}) => {
  sendGAEvent("login", additionalParams);
};

/**
 * Track a user sign-up
 * @param {object} additionalParams - Additional parameters
 */
export const sendSignUp = (additionalParams = {}) => {
  sendGAEvent("sign_up", additionalParams);
};

/**
 * Track a search event
 * @param {string} searchTerm - Search term
 */
export const sendSearch = searchTerm => {
  sendGAEvent("search", {
    search_term: searchTerm,
  });
};

/**
 * Track a conversion event
 * @param {string} conversionName - Conversion event name
 * @param {object} additionalParams - Additional parameters
 */
export const sendConversion = (conversionName, additionalParams = {}) => {
  sendGAEvent(conversionName, additionalParams);
};
