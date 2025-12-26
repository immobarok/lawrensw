import { StaticImageData } from "next/image";

export interface Ship {
  id: number;
  name: string;
  image: string | StaticImageData;
  capacity: string;
  comfortLevel: string;
  description: string;
  yearBuilt: number;
  length: string;
  iceClass: string;
  features: string[];
}
