import React from 'react';
import {
  HiOutlineShoppingBag,
  HiOutlineFilm,
  HiOutlineTruck,
  HiOutlineAcademicCap,
  HiOutlineGlobeAlt,
  HiOutlineBriefcase,
  HiOutlineTag,
  HiOutlineBuildingOffice,
  HiOutlineCurrencyDollar,
  HiOutlineComputerDesktop,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineReceiptPercent,
} from 'react-icons/hi2';
import {
  MdOutlineFastfood,
  MdOutlineLocalHospital,
  MdOutlineDirectionsCar,
  MdOutlineReceiptLong,
} from 'react-icons/md';

export const CategoryIcon = ({ icon, className = 'w-5 h-5' }) => {
  const iconMap = {
    utensils: <MdOutlineFastfood className={className} />,
    food: <MdOutlineFastfood className={className} />,
    'shopping-bag': <HiOutlineShoppingBag className={className} />,
    shopping: <HiOutlineShoppingBag className={className} />,
    car: <MdOutlineDirectionsCar className={className} />,
    transportation: <MdOutlineDirectionsCar className={className} />,
    transport: <MdOutlineDirectionsCar className={className} />,
    'file-text': <MdOutlineReceiptLong className={className} />,
    bills: <MdOutlineReceiptLong className={className} />,
    film: <HiOutlineFilm className={className} />,
    entertainment: <HiOutlineFilm className={className} />,
    activity: <MdOutlineLocalHospital className={className} />,
    healthcare: <MdOutlineLocalHospital className={className} />,
    health: <MdOutlineLocalHospital className={className} />,
    'book-open': <HiOutlineAcademicCap className={className} />,
    education: <HiOutlineAcademicCap className={className} />,
    'map-pin': <HiOutlineGlobeAlt className={className} />,
    travel: <HiOutlineGlobeAlt className={className} />,
    briefcase: <HiOutlineBriefcase className={className} />,
    salary: <HiOutlineBriefcase className={className} />,
    laptop: <HiOutlineComputerDesktop className={className} />,
    freelance: <HiOutlineComputerDesktop className={className} />,
    'trending-up': <HiOutlineReceiptPercent className={className} />,
    business: <HiOutlineBuildingOffice className={className} />,
    'dollar-sign': <HiOutlineCurrencyDollar className={className} />,
    investment: <HiOutlineCurrencyDollar className={className} />,
    heart: <HiOutlineHeart className={className} />,
    home: <HiOutlineHome className={className} />,
    tag: <HiOutlineTag className={className} />,
  };

  const key = (icon || 'tag').toLowerCase().trim();
  return iconMap[key] || <HiOutlineTag className={className} />;
};

export default CategoryIcon;
