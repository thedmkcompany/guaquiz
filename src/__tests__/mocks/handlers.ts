import { http, HttpResponse } from 'msw';

// Add your API mock handlers here
export const handlers = [
  // Example: Mock Wix API
  http.post('https://www.wixapis.com/*', () => {
    return HttpResponse.json({ success: true });
  }),

  // Example: Mock Razorpay API
  http.post('https://api.razorpay.com/*', () => {
    return HttpResponse.json({ id: 'order_test123' });
  }),
];
