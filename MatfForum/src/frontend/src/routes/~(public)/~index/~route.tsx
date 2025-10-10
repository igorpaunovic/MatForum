import { createFileRoute } from '@tanstack/react-router'
import HeroSection from "@/components/sections/HeroSection";
import GuidelinesSection from "@/components/sections/GuidelinesSection";
import QuickStartSection from "@/components/sections/QuickStartSection";
import PopularTopicsSection from "@/components/sections/PopularTopicsSection";
import CTASection from "@/components/sections/CTASection";
import { SimpleUserMenu } from "@/components/simple-user-menu";

export const Route = createFileRoute('/(public)/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      {/* Simple user menu in top-right corner with dropdown container */}
      <div className="dropdown-container flex justify-end mb-4">
        <SimpleUserMenu />
      </div>
      
      <HeroSection />
      <GuidelinesSection />
      <QuickStartSection />
      <PopularTopicsSection />
      <CTASection />
    </>
  )
}