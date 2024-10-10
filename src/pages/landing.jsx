import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json"; // Importing companies data
import faqs from "../data/faq.json"; // Importing FAQs data
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom"; // Importing Link for navigation

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      {/* Header Section */}
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center font-extrabold text-4xl sm:text-6xl lg:text-8xl tracking-tighter py-4">
          Find your next
          <span className="text-blue-500 flex items-center gap-2 sm:gap-6">
            dream job
          </span>
        </h1>
        <p className="text-gray-500 sm:mt-4 text-xs sm:text-xl">
          Discover opportunities that match your skills and aspirations. Connect with innovative companies and take the next step in your career.
        </p>
      </section>

      {/* Button Links Section */}
      <div className="flex gap-6 justify-center">
        <Link to={"/jobs"}>
          <Button variant="blue" size="xl" className="text-white rounded-xl">
            Find Jobs
          </Button>
        </Link>
        <Link to={"/post-job"}>
          <Button variant="destructive" size="xl" className="rounded-xl">
            Post a Job
          </Button>
        </Link>
      </div>

      {/* Company Logos Carousel */}
      <Carousel
        plugins={[Autoplay({ delay: 2000 })]} // Setting up autoplay for the carousel
        className="w-full py-10"
      >
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/3 lg:basis-1/6 ">
              <img
                src={path}
                alt={name}
                className="h-9 sm:h-14 object-contain" // Responsive logo size
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* User Type Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            Search and apply for jobs, track applications, and more.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            Post jobs, manage applications, and find the best candidates.
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <Accordion type="multiple" className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};

export default LandingPage;
