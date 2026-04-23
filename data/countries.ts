interface CountryTour {
  id: string;
  name: string;
  image: string;
  tours: number;
}

export const countries: CountryTour[] = [
  {
    id: "kenya",
    name: "Kenya",
    image: "/images/kenya.jpg",
    tours: 68,
  },
  {
    id: "uganda",
    name: "Uganda",
    image: "/images/uganda.jpg",
    tours: 34,
  },
  {
    id: "tanzania",
    name: "Tanzania",
    image: "/images/tanzania.jpg",
    tours: 52,
  },
];