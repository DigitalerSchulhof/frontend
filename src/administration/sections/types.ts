import { StaticImageData } from 'next/image';

export type AdministrationSection = {
  id: string;
  slices: AdministrationSectionSlice[];
};

export type AdministrationSectionSlice = {
  id: string;
  card: AdministrationSectionSliceCard;
};

export type AdministrationSectionSliceCard = {
  icon: StaticImageData;
};
