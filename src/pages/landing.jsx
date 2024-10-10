import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-8 sm:gap-16 py-8 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <section className="text-center">
        <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-7xl tracking-tighter py-4">
          Find your next{' '}
          <span className="text-blue-500 block sm:inline">dream job</span>
        </h1>
        <p className="text-gray-500 mt-4 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
          Discover opportunities that match your skills and aspirations. Connect with innovative companies and take the next step in your career.
        </p>
      </section>

      {/* Button Links Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/jobs" className="w-full sm:w-auto">
          <Button variant="blue" size="lg" className="w-full sm:w-auto text-white rounded-xl">
            Find Jobs
          </Button>
        </Link>
        <Link to="/post-job" className="w-full sm:w-auto">
          <Button variant="destructive" size="lg" className="w-full sm:w-auto rounded-xl">
            Post a Job
          </Button>
        </Link>
      </div>

      {/* Company Logos Carousel */}
      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full py-8"
      >
        <CarouselContent className="flex gap-4 sm:gap-8 items-center">
          {companies.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/3 sm:basis-1/4 lg:basis-1/6">
              <img
                src={path}
                alt={name}
                className="h-8 sm:h-12 lg:h-16 object-contain mx-auto"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* User Type Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="font-bold text-lg sm:text-xl">For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent className="text-sm sm:text-base">
            Search and apply for jobs, track applications, and more.
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="font-bold text-lg sm:text-xl">For Employers</CardTitle>
          </CardHeader>
          <CardContent className="text-sm sm:text-base">
            Post jobs, manage applications, and find the best candidates.
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <Accordion type="multiple" className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger className="text-sm sm:text-base">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-sm sm:text-base">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};

export default LandingPage;