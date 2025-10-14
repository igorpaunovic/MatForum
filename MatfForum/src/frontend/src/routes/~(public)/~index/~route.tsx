import { createFileRoute } from '@tanstack/react-router'
import HeroSection from "@/components/sections/HeroSection";
import GuidelinesSection from "@/components/sections/GuidelinesSection";
import QuickStartSection from "@/components/sections/QuickStartSection";
import PopularTopicsSection from "@/components/sections/PopularTopicsSection";
import CTASection from "@/components/sections/CTASection";
import Navbar from '@/components/layout/navbar';

export const Route = createFileRoute('/(public)/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4">
        <HeroSection />
        <GuidelinesSection />
        <QuickStartSection />
        <PopularTopicsSection />
        <CTASection />
      </div>
    </>
  )
}