// app/trip2tripDetails/[id]/ExpeditionDetailsClient.tsx (Client Component)
"use client";

import { useState } from "react";
import {
  IoArrowForward,
  IoArrowBack,
  IoClose,
  IoBoatOutline,
} from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { HiMiniTicket } from "react-icons/hi2";
import { Trip } from "@/app/types/trip";

import TravelAdvisor from "@/components/shared/TravelAdvisor";

import { formatPrice } from '@/app/lib/formatPrice';
import TripTwoHero from "../__components/TripTwoHero";
import Itineraries from "../__components/Itineraries";
import ShipGallery from "../__components/ShipGallery";
import ShipDetailsAndCabinInfo from "../__components/ShipDetailsAndCabinInfo";
import Included from "../__components/Included";
import TripNote from "./TripNote";


interface ExpeditionDetailsClientProps {
  expeditionData: Trip;
  children?: React.ReactNode;
}

const ExpeditionDetailsClient = ({
  expeditionData,
  children,
}: ExpeditionDetailsClientProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

 

  //console.log("trip two details",expeditionData);

  const expeditionInfo = [
    {
      label: "Destination",
      value: expeditionData.destinations?.[0]?.name || "No destination Found",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
        >
          <path
            d="M17 14.6818C17 14.4699 17.1355 14.2847 17.3256 14.1911C17.64 14.0362 17.9277 13.8261 18.1737 13.5676L18.1905 13.5499L18.23 13.5078C18.2618 13.4739 18.3059 13.4265 18.3605 13.3669C18.4697 13.2479 18.6219 13.0797 18.803 12.8731C19.1624 12.463 19.6488 11.8867 20.1422 11.2348C20.6271 10.5939 21.1657 9.8189 21.5962 9.01717C21.9762 8.30939 22.5 7.17619 22.5 5.92857C22.5 5.82713 22.6084 5.76453 22.6825 5.83379C22.8806 6.01888 23 6.28132 23 6.56468V20.5647C23 20.8861 22.8455 21.188 22.5847 21.3759C22.3239 21.5639 21.9887 21.615 21.6838 21.5134L18.8274 20.5613C18.4028 20.4197 18.0512 20.3038 17.7535 20.2104C17.3142 20.0725 17 19.6701 17 19.2097V14.6818Z"
            fill="#637381"
          />
          <path
            d="M9.08629 7.16647C9.22522 6.8518 9.61478 7.01769 9.70809 7.34877C9.89542 8.01345 10.1755 8.59205 10.4038 9.01717L11.8578 11.2348L13.197 12.8731C13.3781 13.0797 13.5303 13.2479 13.6395 13.3669C13.6941 13.4264 13.7382 13.4739 13.77 13.5078L13.805 13.5451L13.8185 13.5594L13.8266 13.5679C14.0726 13.8265 14.3603 14.0364 14.6744 14.1912C14.8645 14.2848 15 14.47 15 14.6819V19.5554C15 19.953 14.7642 20.3127 14.406 20.4854C14.1446 20.6115 13.8414 20.762 13.4833 20.941L11.2411 22.0623C10.8836 22.2412 10.556 22.4052 10.2484 22.5502C9.64185 22.8362 9 22.3757 9 21.705V7.57401C9 7.43093 9.03052 7.29277 9.08629 7.16647Z"
            fill="#637381"
          />
          <path
            d="M5.85418 22.8934C6.44574 23.0726 7 22.6127 7 21.9946V7.91968C7 7.45924 6.68578 7.05686 6.24646 6.919C5.94884 6.8256 5.59717 6.70965 5.17257 6.56811L2.31623 5.616C2.01128 5.51435 1.67606 5.56549 1.41529 5.75344C1.15452 5.94139 1 6.24324 1 6.56468V20.5647C1 20.9951 1.27543 21.3773 1.68377 21.5134L4.72046 22.5257C5.13180 22.663 5.50562 22.7878 5.85418 22.8934Z"
            fill="#637381"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.2627 12.1758L15.2717 12.1852L15.2754 12.1891C15.4641 12.3875 15.7262 12.5 16 12.5C16.2738 12.5 16.5362 12.3872 16.7249 12.1888L16.7283 12.1852L16.7373 12.1758L16.7695 12.1414C16.7972 12.1118 16.837 12.0691 16.8871 12.0145C16.9873 11.9053 17.1292 11.7485 17.2989 11.5549C17.6375 11.1686 18.0913 10.6305 18.5474 10.0278C19.0007 9.42886 19.4719 8.74567 19.8341 8.07102C20.1793 7.42832 20.5 6.66039 20.5 5.92857C20.5 3.4634 18.4657 1.5 16 1.5C13.5343 1.5 11.5 3.4634 11.5 5.92857C11.5 6.66039 11.8207 7.42832 12.1659 8.07102C12.5281 8.74567 12.9993 9.42886 13.4526 10.0278C13.9087 10.6305 14.3625 11.1686 14.7011 11.5549C14.8708 11.7485 15.0127 11.9053 15.1129 12.0145C15.163 12.0691 15.2028 12.1118 15.2305 12.1414L15.2627 12.1758Z"
            fill="#637381"
          />
        </svg>
      ),
    },
    {
      label: "Duration",
      value: `${expeditionData.duration} Days , ${
        expeditionData.duration - 1
      } Nights`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.5 22.5C18.0228 22.5 22.5 18.0228 22.5 12.5C22.5 6.97715 18.0228 2.5 12.5 2.5C6.97715 2.5 2.5 6.97715 2.5 12.5C2.5 18.0228 6.97715 22.5 12.5 22.5ZM13.25 7.5C13.25 7.08579 12.9142 6.75 12.5 6.75C12.0858 6.75 11.75 7.08579 11.75 7.5V12.5C11.75 12.8228 11.9566 13.1094 12.2628 13.2115L15.2628 14.2115C15.6558 14.3425 16.0805 14.1301 16.2115 13.7372C16.3425 13.3442 16.1301 12.9195 15.7372 12.7885L13.25 11.9594V7.5Z"
            fill="#637381"
          />
        </svg>
      ),
    },
    {
      label: "Ship",
      value: expeditionData.ship?.name,
      icon: <IoBoatOutline className="text-[#637381]" />,
    },
    {
      label: "Start Date",
      value: formatDate(expeditionData.departure_date),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.1 1.75C8.63848 1.75 9.075 2.18754 9.075 2.72727V3.71284C9.6529 3.70453 10.2784 3.70453 10.9537 3.70454H13.0463C13.7216 3.70453 14.3471 3.70453 14.925 3.71284V2.72727C14.925 2.18754 15.3615 1.75 15.9 1.75C16.4385 1.75 16.875 2.18754 16.875 2.72727V3.79947C17.0513 3.81556 17.221 3.83437 17.3843 3.85638C18.5544 4.01407 19.5397 4.35141 20.3221 5.13573C21.1046 5.92004 21.4412 6.90758 21.5985 8.08045C21.75 9.21014 21.75 10.6465 21.75 12.4285V14.526C21.75 16.308 21.75 17.7444 21.5985 18.8741C21.4412 20.047 21.1046 21.0345 20.3221 21.8188C19.5397 22.6031 18.5544 22.9405 17.3843 23.0982C16.2572 23.25 14.8242 23.25 13.0463 23.25H10.9537C9.17581 23.25 7.74279 23.25 6.61573 23.0982C5.44558 22.9405 4.46035 22.6031 3.67786 21.8188C2.89537 21.0345 2.5588 20.047 2.40148 18.8741C2.24995 17.7444 2.24998 16.3081 2.25 14.5261V12.4285C2.24998 10.6465 2.24995 9.21012 2.40148 8.08045C2.5588 6.90758 2.89537 5.92004 3.67786 5.13573C4.46035 4.35141 5.44558 4.01407 6.61573 3.85638C6.77902 3.83437 6.94874 3.81556 7.125 3.79947V2.72727C7.125 2.18754 7.56152 1.75 8.1 1.75ZM4.21386 10.25C4.20045 10.8958 4.20001 11.6378 4.20001 12.5V14.4545C4.20001 16.3249 4.20208 17.6294 4.3341 18.6137C4.46235 19.5698 4.69693 20.0761 5.05673 20.4367C5.41652 20.7974 5.92166 21.0325 6.87557 21.1611C7.85752 21.2934 9.15897 21.2955 11.025 21.2955H12.975C14.8411 21.2955 16.1425 21.2934 17.1245 21.1611C18.0784 21.0325 18.5835 20.7974 18.9433 20.4367C19.3031 20.0761 19.5377 19.5698 19.6659 18.6137C19.7979 17.6294 19.8 16.3249 19.8 14.4545V12.5C19.8 11.6378 19.7996 10.8958 19.7862 10.25H4.21386Z"
            fill="#637381"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7 13.7734C7 13.2212 7.44772 12.7734 8 12.7734H8.00897C8.56126 12.7734 9.00897 13.2212 9.00897 13.7734C9.00897 14.3257 8.56126 14.7734 8.00897 14.7734H8C7.44772 14.7734 7 14.3257 7 13.7734ZM10.9955 13.7734C10.9955 13.2212 11.4432 12.7734 11.9955 12.7734H12.0045C12.5568 12.7734 13.0045 13.2212 13.0045 13.7734C13.0045 14.3257 12.5568 14.7734 12.0045 14.7734H11.9955C11.4432 14.7734 10.9955 14.3257 10.9955 13.7734ZM14.991 13.7734C14.991 13.2212 15.4387 12.7734 15.991 12.7734H16C16.5523 12.7734 17 13.2212 17 13.7734C17 14.3257 16.5523 14.7734 16 14.7734H15.991C15.4387 14.7734 14.991 14.3257 14.991 13.7734ZM7 17.7734C7 17.2212 7.44772 16.7734 8 16.7734H8.00897C8.56126 16.7734 9.00897 17.2212 9.00897 17.7734C9.00897 18.3257 8.56126 18.7734 8.00897 18.7734H8C7.44772 18.7734 7 18.3257 7 17.7734ZM10.9955 17.7734C10.9955 17.2212 11.4432 16.7734 11.9955 16.7734H12.0045C12.5568 16.7734 13.0045 17.2212 13.0045 17.7734C13.0045 18.3257 12.5568 18.7734 12.0045 18.7734H11.9955C11.4432 18.7734 10.9955 18.3257 10.9955 17.7734Z"
            fill="#637381"
          />
        </svg>
      ),
    },
    {
      label: "End Date",
      value: formatDate(expeditionData.return_date),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.1 1.75C8.63848 1.75 9.075 2.18754 9.075 2.72727V3.71284C9.6529 3.70453 10.2784 3.70453 10.9537 3.70454H13.0463C13.7216 3.70453 14.3471 3.70453 14.925 3.71284V2.72727C14.925 2.18754 15.3615 1.75 15.9 1.75C16.4385 1.75 16.875 2.18754 16.875 2.72727V3.79947C17.0513 3.81556 17.221 3.83437 17.3843 3.85638C18.5544 4.01407 19.5397 4.35141 20.3221 5.13573C21.1046 5.92004 21.4412 6.90758 21.5985 8.08045C21.75 9.21014 21.75 10.6465 21.75 12.4285V14.526C21.75 16.308 21.75 17.7444 21.5985 18.8741C21.4412 20.047 21.1046 21.0345 20.3221 21.8188C19.5397 22.6031 18.5544 22.9405 17.3843 23.0982C16.2572 23.25 14.8242 23.25 13.0463 23.25H10.9537C9.17581 23.25 7.74279 23.25 6.61573 23.0982C5.44558 22.9405 4.46035 22.6031 3.67786 21.8188C2.89537 21.0345 2.5588 20.047 2.40148 18.8741C2.24995 17.7444 2.24998 16.3081 2.25 14.5261V12.4285C2.24998 10.6465 2.24995 9.21012 2.40148 8.08045C2.5588 6.90758 2.89537 5.92004 3.67786 5.13573C4.46035 4.35141 5.44558 4.01407 6.61573 3.85638C6.77902 3.83437 6.94874 3.81556 7.125 3.79947V2.72727C7.125 2.18754 7.56152 1.75 8.1 1.75ZM4.21386 10.25C4.20045 10.8958 4.20001 11.6378 4.20001 12.5V14.4545C4.20001 16.3249 4.20208 17.6294 4.3341 18.6137C4.46235 19.5698 4.69693 20.0761 5.05673 20.4367C5.41652 20.7974 5.92166 21.0325 6.87557 21.1611C7.85752 21.2934 9.15897 21.2955 11.025 21.2955H12.975C14.8411 21.2955 16.1425 21.2934 17.1245 21.1611C18.0784 21.0325 18.5835 20.7974 18.9433 20.4367C19.3031 20.0761 19.5377 19.5698 19.6659 18.6137C19.7979 17.6294 19.8 16.3249 19.8 14.4545V12.5C19.8 11.6378 19.7996 10.8958 19.7862 10.25H4.21386Z"
            fill="#637381"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7 13.7734C7 13.2212 7.44772 12.7734 8 12.7734H8.00897C8.56126 12.7734 9.00897 13.2212 9.00897 13.7734C9.00897 14.3257 8.56126 14.7734 8.00897 14.7734H8C7.44772 14.7734 7 14.3257 7 13.7734ZM10.9955 13.7734C10.9955 13.2212 11.4432 12.7734 11.9955 12.7734H12.0045C12.5568 12.7734 13.0045 13.2212 13.0045 13.7734C13.0045 14.3257 12.5568 14.7734 12.0045 14.7734H11.9955C11.4432 14.7734 10.9955 14.3257 10.9955 13.7734ZM14.991 13.7734C14.991 13.2212 15.4387 12.7734 15.991 12.7734H16C16.5523 12.7734 17 13.2212 17 13.7734C17 14.3257 16.5523 14.7734 16 14.7734H15.991C15.4387 14.7734 14.991 14.3257 14.991 13.7734ZM7 17.7734C7 17.2212 7.44772 16.7734 8 16.7734H8.00897C8.56126 16.7734 9.00897 17.2212 9.00897 17.7734C9.00897 18.3257 8.56126 18.7734 8.00897 18.7734H8C7.44772 18.7734 7 18.3257 7 17.7734ZM10.9955 17.7734C10.9955 17.2212 11.4432 16.7734 11.9955 16.7734H12.0045C12.5568 16.7734 13.0045 17.2212 13.0045 17.7734C13.0045 18.3257 12.5568 18.7734 12.0045 18.7734H11.9955C11.4432 18.7734 10.9955 18.3257 10.9955 17.7734Z"
            fill="#637381"
          />
        </svg>
      ),
    },
    {
      label: "Embarkation",
      value: expeditionData.starting_point,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.5 3.5C1.5 2.39543 2.39543 1.5 3.5 1.5H7.5C8.60457 1.5 9.5 2.39543 9.5 3.5V7.5C9.5 8.60457 8.60457 9.5 7.5 9.5H3.5C2.39543 9.5 1.5 8.60457 1.5 7.5V3.5ZM4.5 3.5H3.5V7.5H7.5V3.5H6.5V5.5H4.5V3.5Z"
            fill="#637381"
          />
          <path
            d="M11.5 6.5H18.1043C18.8751 6.5 19.5 7.12485 19.5 7.89565C19.5 8.4612 19.1587 8.97084 18.6357 9.18618L4.23188 15.1172C3.18394 15.5487 2.5 16.57 2.5 17.7033C2.5 19.2479 3.75214 20.5 5.29674 20.5H14.5V18.5H5.29674C4.85671 18.5 4.5 18.1433 4.5 17.7033C4.5 17.3804 4.69484 17.0895 4.99338 16.9665L19.3972 11.0355C20.6696 10.5116 21.5 9.27165 21.5 7.89565C21.5 6.02028 19.9797 4.5 18.1043 4.5H11.5V6.5Z"
            fill="#637381"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.2287 23.1848L20.2319 23.1814L20.2399 23.1729L20.2683 23.1423C20.2925 23.1161 20.3271 23.0784 20.3705 23.0303C20.4575 22.9342 20.5803 22.7963 20.727 22.6256C21.0196 22.2852 21.412 21.8093 21.8066 21.2708C22.1987 20.7358 22.6078 20.1191 22.9228 19.4988C23.2256 18.9027 23.5 18.1924 23.5 17.5C23.5 15.101 21.6744 13.5 19.5 13.5C17.3256 13.5 15.5 15.101 15.5 17.5C15.5 18.1924 15.7744 18.9027 16.0772 19.4988C16.3922 20.1191 16.8013 20.7358 17.1934 21.2708C17.588 21.8093 17.9804 22.2852 18.273 22.6256C18.4197 22.7963 18.5425 22.9342 18.6295 23.0303C18.6729 23.0784 18.7075 23.1161 18.7317 23.1423L18.7601 23.1729L18.7681 23.1814L18.7716 23.1851C18.9606 23.3859 19.2243 23.5 19.5 23.5C19.7757 23.5 20.0397 23.3856 20.2287 23.1848ZM17.5 17.5C17.5 16.2738 18.3607 15.5 19.5 15.5C20.6393 15.5 21.5 16.2738 21.5 17.5C21.5 17.714 21.3994 18.0818 21.1397 18.5931C20.8922 19.0802 20.5513 19.6002 20.1934 20.0886C19.9541 20.4151 19.7139 20.7186 19.5 20.9779C19.2861 20.7186 19.0459 20.4151 18.8066 20.0886C18.4487 19.6002 18.1078 19.0802 17.8603 18.5931C17.6006 18.0818 17.5 17.714 17.5 17.5Z"
            fill="#637381"
          />
        </svg>
      ),
    },
    {
      label: "Disembarkation",
      value: expeditionData.finishing_point,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.5 3.5C1.5 2.39543 2.39543 1.5 3.5 1.5H7.5C8.60457 1.5 9.5 2.39543 9.5 3.5V7.5C9.5 8.60457 8.60457 9.5 7.5 9.5H3.5C2.39543 9.5 1.5 8.60457 1.5 7.5V3.5ZM4.5 3.5H3.5V7.5H7.5V3.5H6.5V5.5H4.5V3.5Z"
            fill="#637381"
          />
          <path
            d="M11.5 6.5H18.1043C18.8751 6.5 19.5 7.12485 19.5 7.89565C19.5 8.4612 19.1587 8.97084 18.6357 9.18618L4.23188 15.1172C3.18394 15.5487 2.5 16.57 2.5 17.7033C2.5 19.2479 3.75214 20.5 5.29674 20.5H14.5V18.5H5.29674C4.85671 18.5 4.5 18.1433 4.5 17.7033C4.5 17.3804 4.69484 17.0895 4.99338 16.9665L19.3972 11.0355C20.6696 10.5116 21.5 9.27165 21.5 7.89565C21.5 6.02028 19.9797 4.5 18.1043 4.5H11.5V6.5Z"
            fill="#637381"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.2287 23.1848L20.2319 23.1814L20.2399 23.1729L20.2683 23.1423C20.2925 23.1161 20.3271 23.0784 20.3705 23.0303C20.4575 22.9342 20.5803 22.7963 20.727 22.6256C21.0196 22.2852 21.412 21.8093 21.8066 21.2708C22.1987 20.7358 22.6078 20.1191 22.9228 19.4988C23.2256 18.9027 23.5 18.1924 23.5 17.5C23.5 15.101 21.6744 13.5 19.5 13.5C17.3256 13.5 15.5 15.101 15.5 17.5C15.5 18.1924 15.7744 18.9027 16.0772 19.4988C16.3922 20.1191 16.8013 20.7358 17.1934 21.2708C17.588 21.8093 17.9804 22.2852 18.273 22.6256C18.4197 22.7963 18.5425 22.9342 18.6295 23.0303C18.6729 23.0784 18.7075 23.1161 18.7317 23.1423L18.7601 23.1729L18.7681 23.1814L18.7716 23.1851C18.9606 23.3859 19.2243 23.5 19.5 23.5C19.7757 23.5 20.0397 23.3856 20.2287 23.1848ZM17.5 17.5C17.5 16.2738 18.3607 15.5 19.5 15.5C20.6393 15.5 21.5 16.2738 21.5 17.5C21.5 17.714 21.3994 18.0818 21.1397 18.5931C20.8922 19.0802 20.5513 19.6002 20.1934 20.0886C19.9541 20.4151 19.7139 20.7186 19.5 20.9779C19.2861 20.7186 19.0459 20.4151 18.8066 20.0886C18.4487 19.6002 18.1078 19.0802 17.8603 18.5931C17.6006 18.0818 17.5 17.714 17.5 17.5Z"
            fill="#637381"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 overflow-x-hidden">
        <TripTwoHero expeditionData={expeditionData} />

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 -mt-20 sm:-mt-30 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column - Itinerary */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Overview */}
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                  Trip overview & key details
                </h2>
                <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-6">
                  Trip information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {expeditionInfo.map((info, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="text-xl sm:text-2xl">{info.icon}</div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {info.label}
                        </p>
                        <p className="font-semibold text-sm sm:text-base text-gray-800">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery Items */}
              {expeditionData.gallery && expeditionData.gallery.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 relative">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                    Adventure highlights
                  </h2>

                  {/* Main Grid Container (6 images - 3x2) - Always visible */}
                  <div className="grid grid-cols-3 grid-rows-2 gap-4 mb-6">
                    {expeditionData.gallery
                      .slice(0, 6)
                      .map((galleryItem, index) => (
                        <div
                          key={galleryItem.id}
                          className="relative aspect-square cursor-pointer group"
                          onClick={() => {
                            setSelectedImageIndex(index);
                            setIsImageModalOpen(true);
                          }}
                        >
                          <Image
                            src={galleryItem.image}
                            alt={`Gallery image ${index + 1}`}
                            fill
                            className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 1024px) 33vw, 16.666vw"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/api/placeholder/300/300";
                            }}
                          />
                        </div>
                      ))}
                  </div>

                  {/* Scrollable Section for remaining images */}
                  {expeditionData.gallery.length > 6 && (
                    <div className="relative">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        More Photos ({expeditionData.gallery.length - 6})
                      </h3>

                      {/* Navigation Arrows */}
                      <button
                        onClick={() => {
                          const container = document.getElementById(
                            "gallery-scroll-container"
                          );
                          if (container) {
                            container.scrollBy({
                              left: -300,
                              behavior: "smooth",
                            });
                          }
                        }}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <IoArrowBack size={20} />
                      </button>

                      <button
                        onClick={() => {
                          const container = document.getElementById(
                            "gallery-scroll-container"
                          );
                          if (container) {
                            container.scrollBy({
                              left: 300,
                              behavior: "smooth",
                            });
                          }
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <IoArrowForward size={20} />
                      </button>

                      {/* Scrollable Container */}
                      <div
                        id="gallery-scroll-container"
                        className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        {expeditionData.gallery
                          .slice(6)
                          .map((galleryItem, index) => (
                            <div
                              key={galleryItem.id}
                              className="flex-shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.67rem)] md:w-[calc(25%-0.75rem)] snap-start cursor-pointer group"
                              onClick={() => {
                                setSelectedImageIndex(index + 6);
                                setIsImageModalOpen(true);
                              }}
                            >
                              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                                <Image
                                  src={galleryItem.image}
                                  alt={`Gallery image ${index + 7}`}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/api/placeholder/300/300";
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Update your modal to show the correct image */}
              {isImageModalOpen && expeditionData.gallery && (
                <div
                  className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                  onClick={() => setIsImageModalOpen(false)}
                >
                  <button
                    onClick={() => setIsImageModalOpen(false)}
                    className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10 transition-all z-10"
                  >
                    <IoClose size={32} />
                  </button>

                  <div
                    className="relative max-w-full max-h-full w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative aspect-video max-h-[80vh] w-full">
                      <Image
                        src={
                          expeditionData.gallery[selectedImageIndex]?.image ||
                          "/api/placeholder/800/600"
                        }
                        alt="Expanded view"
                        fill
                        className="object-contain"
                        sizes="90vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/api/placeholder/800/600";
                        }}
                      />
                    </div>

                    {expeditionData.gallery.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setSelectedImageIndex((prev) =>
                              prev > 0
                                ? prev - 1
                                : expeditionData.gallery.length - 1
                            )
                          }
                          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70 transition-all"
                        >
                          <IoArrowBack size={20} />
                        </button>
                        <button
                          onClick={() =>
                            setSelectedImageIndex((prev) =>
                              prev < expeditionData.gallery.length - 1
                                ? prev + 1
                                : 0
                            )
                          }
                          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70 transition-all"
                        >
                          <IoArrowForward size={20} />
                        </button>
                      </>
                    )}

                    {/* Image counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImageIndex + 1} / {expeditionData.gallery.length}
                    </div>
                  </div>
                </div>
              )}

              <Itineraries expeditionData={expeditionData} />
              <ShipGallery gallery={expeditionData.ship?.gallery || []} />
              <ShipDetailsAndCabinInfo expeditionData={expeditionData} />
              <Included expeditionData={expeditionData} />
              <TripNote/>
            </div>

            {/* Right Column - Quick Facts */}
            <div className="space-y-6 md:space-y-8">
              {/* Quick Facts */}
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 sticky top-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                  Price & Booking
                </h3>

                <div className="bg-dark rounded-2xl p-4 mb-6">
                  <div className="flex justify-between ">
                    <p></p>
                    <p className="text-blue bg-white rounded-xl px-4 py-2 font-bold flex gap-3 items-center flex-row-reverse">
                      Price start from:
                      <span>
                        <HiMiniTicket />
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 mt-6 justify-center items-center text-gray-900">
                    <p className="font-bold text-2xl">
                      {formatPrice(
                        expeditionData.cabins[0].amount,
                        expeditionData.cabins[0].currency
                      )}
                    </p>
                    <p>per person</p>
                  </div>
                </div>

                <div className="bg-dark rounded-2xl p-4">
                  <p className="flex gap-3 items-center text-blue font-medium">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM12 13C12.5523 13 13 13.4477 13 14V15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15V14C11 13.4477 11.4477 13 12 13ZM12 7C12.5523 7 13 7.44772 13 8V11C13 11.5523 12.5523 12 12 12C11.4477 12 11 11.5523 11 11V8C11 7.44772 11.4477 7 12 7Z"
                        fill="#013A8A"
                      />
                    </svg>
                    Book this cruise before someone else takes your favorite
                    cabin!
                  </p>
                </div>

                {/* CTA Button */}
                <Link
                  href={{
                    pathname: `/worldheritagetrips/${expeditionData.id}/book`,
                    query: {
                      name: encodeURIComponent(expeditionData.name || ""),
                      image: encodeURIComponent(
                        expeditionData.feature_image || ""
                      ),
                      shipName: encodeURIComponent(
                        expeditionData.ship?.name || ""
                      ),
                      tripId: encodeURIComponent(
                        expeditionData.id?.toString() || ""
                      ),
                      shipId: encodeURIComponent(
                        expeditionData.ship?.id?.toString() || ""
                      ),
                      cabinId: encodeURIComponent(
                        expeditionData.cabins?.[0]?.id?.toString() || ""
                      ),
                      travelDate: encodeURIComponent(
                        expeditionData.departure_date || ""
                      ),
                    },
                  }}
                  rel="noopener noreferrer"
                  className="w-full mt-6 block text-center bg-gradient-to-b from-secondary via-[#EFB26A] to-[#EFB26A] hover:from-secondary/98 hover:to-secondary/60 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg text-sm"
                >
                  Book Now
                </Link>
              </div>

              <div className="max-h-[600px]">
                <TravelAdvisor advisor={null} />
              </div>

              {/* Help Section */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Need Help?
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Our expedition specialists are here to help you plan your
                  adventure.
                </p>
                <Link
                  href="/contact"
                  className="w-full block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-sm"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {isImageModalOpen &&
          expeditionData.photos &&
          expeditionData.photos.length > 0 && (
            <div
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setIsImageModalOpen(false)}
            >
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10 transition-all z-10"
              >
                <IoClose size={32} />
              </button>

              <div
                className="relative max-w-full max-h-full w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative aspect-video max-h-[80vh] w-full">
                  <Image
                    src={expeditionData.photos[selectedImageIndex]?.url}
                    alt="Expanded view"
                    fill
                    className="object-contain"
                    sizes="90vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/api/placeholder/800/600";
                    }}
                  />
                </div>

                {expeditionData.photos.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev > 0 ? prev - 1 : expeditionData.photos.length - 1
                        )
                      }
                      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70 transition-all"
                    >
                      <IoArrowBack size={20} />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev < expeditionData.photos.length - 1 ? prev + 1 : 0
                        )
                      }
                      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70 transition-all"
                    >
                      <IoArrowForward size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
      </div>
      {children}
    </>
  );
};

export default ExpeditionDetailsClient;
