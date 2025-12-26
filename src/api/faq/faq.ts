export const getAllFAQItems= async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/faqApi/index`, {
    method: "GET",
  });
};