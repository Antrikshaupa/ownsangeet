import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState } from "react";
import Spline from "@splinetool/react-spline";
import { ContactForm } from "../ContactForm";
import { PhotoAudio } from "../PhotoAudio";
import { generateSEOMeta } from "../components/SEOMeta";
import SplashCursor from "../SplashCursor";
import SpotlightCard from "../SpotlightCard";
import type { Route } from "./+types/_index";
import { usePageContent, useMusicTracks } from "../hooks/useContent";

// Export the meta function for SEO
export const meta = generateSEOMeta;

// FAQ Accordion Item Component
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setIsOpen(!isOpen)}
      className="border-b border-gray-300 py-4 cursor-pointer"
      initial={{ borderRadius: 10 }}
    >
      <motion.div layout className="flex justify-between items-center">
        <h4 className="font-semibold text-lg text-gray-800">{question}</h4>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </motion.div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-4 text-gray-600"
        >
          {answer}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function LandingPage() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // <SplashCursor />

  const fadeInVariant = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7 },
    },
  };

  const { data: pageData, loading: pageLoading } = usePageContent('home');
  const { tracks, loading: tracksLoading } = useMusicTracks();

  // Fallback content or loading state
  if (pageLoading || tracksLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const content = pageData?.content || {};
  const blocks = content.blocks || [];

  const heroBlock = blocks.find((b: any) => b.type === 'hero')?.data || {};
  const servicesBlock = blocks.find((b: any) => b.type === 'services')?.data || {};
  const testimonialsBlock = blocks.find((b: any) => b.type === 'testimonials')?.data || {};
  const faqBlock = blocks.find((b: any) => b.type === 'faq')?.data || {};
  const aboutBlock = blocks.find((b: any) => b.type === 'about')?.data || {};
  const contactBlock = blocks.find((b: any) => b.type === 'contact')?.data || {};

  const eventTypes = servicesBlock.items || [];
  const testimonials = testimonialsBlock.items || [];
  const faqs = faqBlock.categories || [];


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center text-2xl font-bold text-gray-800">
              <img
                src="/favicon.ico"
                alt="Own Sangeet Custom Music Studio logo"
                className="h-8 w-8 mr-2"
              />
              Own Sangeet
            </h1>
            <nav className="hidden md:flex space-x-8">
              {[
                { name: "Home", href: "#home" },
                { name: "Services", href: "#services" },
                { name: "About", href: "#about" },
                { name: "Gallery", href: "#gallery" },
                { name: "Testimonials", href: "#testimonials" },
                { name: "FAQ", href: "#faq" },
                { name: "Blog", href: "/blog" },
                { name: "Contact", href: "#contact" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center text-center pt-24 pb-12 px-6"
      >
        <div className="relative z-20">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            {heroBlock.heading}
          </motion.h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-2xl mx-auto">
            {heroBlock.subheading}
          </p>

          <button
            className="button type1"
            data-base="Get Started"
            data-hover="Let's Go!"
            onClick={() => setIsContactFormOpen(true)}
          ></button>
        </div>

        {/* Spline Element */}
        <div className="relative z-10 w-full h-[500px] md:h-[600px] lg:h-[700px] mt-12 pointer-events-none">
          <Spline
            scene="https://prod.spline.design/P4AURWuUXAVq9IvP/scene.splinecode"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </section>

      {/* Background Animation Section */}
      <section className="relative h-96 -mt-48 pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          <div className="crazy-element" />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              variants={fadeInVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.7 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            >
              Custom Songs for Every Occasion
            </motion.h2>
            <motion.p
              variants={fadeInVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.7 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              From intimate gatherings to grand celebrations, we provide a truly
              personal soundtrack for your most important events.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventTypes.map((event: any, index: number) => (
              <SpotlightCard
                key={event.title || index}
                className="group relative"
                spotlightColor="rgba(147, 51, 234, 0.15)"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${event.gradient} rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity`}
                />
                <div className="relative p-8">
                  <div className="text-4xl mb-4">{event.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                  <button className="mt-6 bg-purple-100 hover:bg-purple-200 text-purple-700 px-6 py-2 rounded-full transition-all">
                    Learn More
                  </button>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-white">
        <div className="container mx-auto text-center">
          <motion.h2
            variants={fadeInVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.7 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
          >
            {aboutBlock.heading || "Your Personal Songwriting Studio"}
          </motion.h2>
          <motion.p
            variants={fadeInVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.7 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {aboutBlock.content || "Music Studio was founded on a simple idea: every story deserves its own song. We are a collective of passionate songwriters, composers, and producers dedicated to transforming your memories, feelings, and ideas into one-of-a-kind musical pieces."}
          </motion.p>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              variants={fadeInVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.7 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            >
              Event Gallery
            </motion.h2>
            <motion.p
              variants={fadeInVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.7 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              A glimpse into the unforgettable moments we've helped create.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tracks.map((track: any, index: number) => (
              <div
                key={track.id || index}
                className="group relative aspect-square overflow-hidden rounded-lg"
              >
                <PhotoAudio
                  imageSrc={track.coverImageUrl}
                  alt={track.title}
                  audioSrc={track.audioUrl}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              variants={fadeInVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.7 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            >
              What Our Clients Say
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial: any, index: number) => (
              <SpotlightCard
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-purple-200/50 hover:border-purple-300 transition-all group"
                spotlightColor="rgba(236, 72, 153, 0.12)"
              >
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="font-bold text-gray-800 mt-6">
                  - {testimonial.name}
                </div>
                <div className="text-sm text-purple-600 font-medium">
                  {testimonial.event}
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              variants={fadeInVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.7 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              variants={fadeInVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.7 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Have questions? We've got answers. Here are the details about our
              custom song creation process.
            </motion.p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((category: any, catIndex: number) => (
              <div key={catIndex} className="mb-6">
                <h3 className="text-3xl font-bold text-gray-800 mt-8 mb-4 border-b-2 border-purple-200 pb-2">
                  {category.categoryTitle}
                </h3>
                {category.items.map((faq: any, index: number) => (
                  <FaqItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.h2
            variants={fadeInVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.7 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
          >
            {contactBlock.heading}
          </motion.h2>
          <motion.p
            variants={fadeInVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.7 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            {contactBlock.subheading}
          </motion.p>
          <button
            className="button type1 mt-4"
            data-base="Contact Us Today"
            data-hover="Let's Talk!"
            onClick={() => setIsContactFormOpen(true)}
          ></button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
          <p className="mb-6">
            Have questions? We're here to help. Contact us directly or follow us
            on social media.
          </p>

          <div className="flex justify-center items-center space-x-6 text-lg mb-8">
            <a
              href="tel:+919098019901"
              className="hover:text-purple-400 transition-colors"
            >
              <i className="fas fa-phone mr-2"></i>+91 9098019901
            </a>
            <a
              href="https://wa.me/919098019901"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i>WhatsApp
            </a>
            <a
              href="http://OwnSangeet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              <i className="fas fa-globe mr-2"></i>Own Sangeet.com
            </a>
          </div>

          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Own Sangeet. All Rights
            Reserved.
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {isContactFormOpen && (
          <ContactForm onClose={() => setIsContactFormOpen(false)} />
        )}
      </AnimatePresence>

      {/* Fluid Cursor Animation */}
      <SplashCursor
        SPLAT_RADIUS={0.25}
        SPLAT_FORCE={3500}
        DENSITY_DISSIPATION={4.0}
        VELOCITY_DISSIPATION={2.2}
        COLOR_UPDATE_SPEED={5}
      />
    </div>
  );
}
