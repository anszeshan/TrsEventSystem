// // src/pages/LandingPage.jsx
// import React from 'react';
// import HeroSection from '../components/Landing/HeroSection/HeroSection';
// import Statistics from '../components/Landing/Statistics/Statistics';
// import FeaturedEvents from '../components/Landing/FeaturedEvents/FeaturedEvents';
// import CallToAction from '../components/Landing/CallToAction/CallToAction';
// import About from '../components/Landing/About/About';
// import Footer from '../components/Landing/Footer/Footer';
// import Navbar from '../components/Shared/Navbar/Navbar';
// import Story from '../components/Landing/Story/Story';
// import Testimonials from '../components/Landing/Testimonials/Testimonials';
// import './LandingPage.css';

// const LandingPage = () => {
//   return (
//     <div className="landing-page">
//       <Navbar />
//       <main>
//         <HeroSection />
//         <Statistics />
//         <FeaturedEvents />
//         <Story />
//         <Testimonials />
//         <CallToAction />
//         <About />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default LandingPage;



// src/pages/LandingPage.jsx
import React from 'react';
import Navbar from '../components/Shared/Navbar/Navbar';
import HeroSection from '../components/Landing/HeroSection/HeroSection';
import Statistics from '../components/Landing/Statistics/Statistics';
import FeaturedEvents from '../components/Landing/FeaturedEvents/FeaturedEvents';
import Story from '../components/Landing/Story/Story';
import Testimonials from '../components/Landing/Testimonials/Testimonials';
import CallToAction from '../components/Landing/CallToAction/CallToAction';
import Footer from '../components/Landing/Footer/Footer';
import About from '../components/Landing/About/About';

import './LandingPage.css';

const LandingPage = () => {
  // Intersection Observer for section animations
  React.useEffect(() => {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));

    return () => sections.forEach(section => observer.unobserve(section));
  }, []);

  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <HeroSection />
        <Statistics />
        <FeaturedEvents />
        <Story />
        
        <CallToAction />
         <About />
         <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;