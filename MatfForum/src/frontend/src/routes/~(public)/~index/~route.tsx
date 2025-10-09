import { createFileRoute } from '@tanstack/react-router'
import HeroSection from "@/components/sections/HeroSection";
import GuidelinesSection from "@/components/sections/GuidelinesSection";
import QuickStartSection from "@/components/sections/QuickStartSection";
import PopularTopicsSection from "@/components/sections/PopularTopicsSection";
import CTASection from "@/components/sections/CTASection";

export const Route = createFileRoute('/(public)/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <HeroSection />
      <GuidelinesSection />
      <QuickStartSection />
      <PopularTopicsSection />
      <CTASection />
    </>
  )
}