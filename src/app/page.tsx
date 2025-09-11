"use client";

import HeaderHome from "./_components/home/header-home";
import HeroSectionHome from "./_components/home/hero-section-home";
import ScoreSectionHome from "./_components/home/score-section-home";
import WhatsappSectionHome from "./_components/home/whatsapp-section-home";
import DashboardSectionHome from "./_components/home/dashboard-section-home";
import AboutAISectionHome from "./_components/home/about-ai-section-home";
import FeaturesSectionHome from "./_components/home/features-section-home";
import TestimonialsSectionHome from "./_components/home/testimonials-section-home";
import FaqSectionHome from "./_components/home/faq-section-home";
import FooterHome from "./_components/home/footer-home";
import CtaSectionHome from "./_components/home/cta-section-home";

export default function NutritionAIWebsite() {
  return (
    <div className="bg-background min-h-screen">
      <HeaderHome />

      <HeroSectionHome />

      <ScoreSectionHome />

      <WhatsappSectionHome />

      <DashboardSectionHome />

      <AboutAISectionHome />

      <FeaturesSectionHome />

      <TestimonialsSectionHome />

      <FaqSectionHome />

      <CtaSectionHome />

      <FooterHome />
    </div>
  );
}
