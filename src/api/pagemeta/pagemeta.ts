export interface PageMetaData {
  id: number;
  title: string;
  description: string;
  lang_id: number;
  language: string;
}

interface BackendMetaResponse {
  status: boolean;
  message: string;
  data: PageMetaData[];
  code: number;
}

export const getPageMetaData = async (
  endpoint: string,
  language: string = "English",
  defaultTitle = "Default Title",
  defaultDescription = "Default Description"
): Promise<PageMetaData> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BackendMetaResponse = await response.json();

    if (data.status && data.data && data.data.length > 0) {
      // First try to find meta data for the requested language
      const languageSpecificMeta = data.data.find(
        (meta) => meta.language.toLowerCase() === language.toLowerCase()
      );

      if (languageSpecificMeta) {
        return languageSpecificMeta;
      }

      // Fallback to English if requested language not found
      const englishMeta = data.data.find(
        (meta) => meta.language.toLowerCase() === "english"
      );

      if (englishMeta) {
        return englishMeta;
      }

      // If neither found, return the first available
      return data.data[0];
    }
  } catch (error) {
    console.error(`Error fetching meta data from ${endpoint}:`, error);
  }

  // Return default meta data with proper structure
  return {
    id: 0,
    title: defaultTitle,
    description: defaultDescription,
    lang_id: 1,
    language: "English",
  };
};

export const getHomePageMetaData = (language: string = "English") =>
  getPageMetaData(
    "/homePageMetaTagApi/index",
    language,
    "Home",
    "Default Home Description"
  );

export const getAboutPageMetaData = (language: string = "English") =>
  getPageMetaData(
    "/aboutPageMetaTagApi/index",
    language,
    "About Us",
    "Default About Description"
  );

export const getContactPageMetaData = (language: string = "English") =>
  getPageMetaData(
    "/contactPageMetaTagApi/index",
    language,
    "Contact Us",
    "Default Contact Description"
  );

export const getAllNatureTripsPageMetaData = (language: string = "English") =>
  getPageMetaData(
    "/naturePageMetaTagApi/index",
    language,
    "all Nature Trips ",
    "Default Trips Description"
  );

export const getShipsPageMetaData = (language: string = "English") =>
  getPageMetaData(
    "/shipPageMetaTagApi/index",
    language,
    "Ships",
    "Default Ships Description"
  );
