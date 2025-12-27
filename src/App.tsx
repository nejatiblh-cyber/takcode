import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Projects from './components/Projects';
import PriceCalculator from './components/PriceCalculator';
import Careers from './components/Careers';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen" dir="rtl">
      <Navbar />
      <Hero />
      <Services />
      <Projects />
      <PriceCalculator />
      <Careers />
      <Footer />
    </div>
  );
}

export default App;
