import Header from "@/components/Header";
import Footer from "@/components/Footer";
//import BackgroundElements from "@/components/BackgroundElements";
import PatientForm from "@/components/Form/PatientForm";

function App() {
  return (
    <div className="min-h-screen w-full bg-bg-mint relative overflow-x-hidden">
      {/* <BackgroundElements /> */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        <Header />
        <main className="mb-10">
          <div className="max-w-4xl mx-auto">
            <PatientForm />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
