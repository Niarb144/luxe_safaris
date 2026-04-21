import { Hero } from "@/components/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans bg-white min-h-screen p-4">
      <Hero />
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
        Welcome to the Luxe Plains Africa Safaris
      </h1>
    </div>
  );
}