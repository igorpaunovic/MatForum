import { createFileRoute } from '@tanstack/react-router'
import HeroSection from "@/components/sections/HeroSection";
import GuidelinesSection from "@/components/sections/GuidelinesSection";
import QuickStartSection from "@/components/sections/QuickStartSection";
import PopularTopicsSection from "@/components/sections/PopularTopicsSection";
import CTASection from "@/components/sections/CTASection";

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <GuidelinesSection />
      <QuickStartSection />
      <PopularTopicsSection />
      <CTASection />
    </div>
  )
}