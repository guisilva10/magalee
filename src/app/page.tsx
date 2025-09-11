"use client";

import HeaderHome from "./_components/home/header-home";
import HeroSectionHome from "./_components/home/hero-section-home";
import ScoreSectionHome from "./_components/home/score-section-home";
import WhatsappSectionHome from "./_components/home/whatsapp-section-home";
import DashboardSectionHome from "./_components/home/dashboard-section-home";
import AboutAISectionHome from "./_components/home/about-ai-section-home";
import FeaturesSectionHome from "./_components/home/features-section-home";
import FaqSectionHome from "./_components/home/faq-section-home";
import FooterHome from "./_components/home/footer-home";
import CtaSectionHome from "./_components/home/cta-section-home";
import { TestimonialsMarqueeSectionHome } from "./_components/home/testimonials-marquee-section-home";
import ArcTimelineSectionHome from "./_components/home/arc-timeline-section-home";

export default function NutritionAIWebsite() {
  return (
    <div className="min-h-screen">
      <HeaderHome />

      <HeroSectionHome />

      <ScoreSectionHome />

      <WhatsappSectionHome />

      <DashboardSectionHome />

      <AboutAISectionHome />

      <ArcTimelineSectionHome />

      <FeaturesSectionHome />

      <TestimonialsMarqueeSectionHome />

      <FaqSectionHome />

      <CtaSectionHome />

      <FooterHome />
    </div>
  );
}
