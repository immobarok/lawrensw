export interface AboutHeroData {
  id: number;
  header: string;
  title: string;
  image: string;
  alt_tag: string;
}


interface AboutHeroResponse {
  status: boolean;
  message: string;
  data: AboutHeroData[];
  code: number;
}

export const getOurStory = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/ourstoryApi/index`, {
    method: "GET",
  });
};

export const getDestinationWeCover = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/destinationCoverApi/index`, {
    method: "GET",
  });
};

export const getAllpeopleBehindApi = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/peopleBehindApi/index`, {
    method: "GET",
  });
};

export const getresponsibleTravelApi = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/responsibleTravelApi/index`, {
    method: "GET",
  });
};

export const getUniueFeatures = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/uniqueFeaturesApi/index`, {
    method: "GET",
  });
};

export const getOurMission = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/missionApi/index`, {
    method: "GET",
  });
};

export const getAboutHeroSection = async (): Promise<AboutHeroData[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exploreNatTrvlWitBanApi/index`);

    if (response.ok) {
      const data = await response.json();
      if (
        typeof data === "object" &&
        data !== null &&
        "status" in data &&
        "data" in data
      ) {
        const nestedResponse = data as AboutHeroResponse;
        if (nestedResponse.status && Array.isArray(nestedResponse.data)) {
          return nestedResponse.data;
        }
      }
      if (Array.isArray(data)) {
        return data as AboutHeroData[];
      }
    }

    return [];
  } catch (error) {
    console.error("Error fetching about hero section:", error);
    return [];
  }
};
