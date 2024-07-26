import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import SideNavigation from "../components/SideNavigation";
import image1 from "./../../public/images/about-1.png";
import image2 from "./../../public/images/about-2.png";
import image3 from "./../../public/images/about-3.png";
import TextArea from "../components/TextArea";

export default function Home() {
  const [text, setText] = useState(" ");
  const [showKeyboard, setShowKeyboard] = useState(false);

  useEffect(() => {
    document.title = "Home";
  }, []);

  return (
    <div className="flex flex-col bg-gray-100">
      <Navigation />
      <div className="flex flex-row flex-grow">
        <div className="hidden md:flex flex-col w-1/4 border-r-2 border-gray-200">
          <SideNavigation />
        </div>
        <div className="flex-grow">
          <main className="ml-4 mt-4 bg-white p-6 rounded-lg shadow-md">
            <h1 className="mb-4 text-3xl font-bold text-orange-600 text-center">
              Welcome to Chegg, Zura!
            </h1>
            <h3 className="p-2 text-lg text-center text-gray-700">
              Expert help combined with AI, available 24/7.
            </h3>
            <TextArea
              text={text}
              showKeyboard={showKeyboard}
              setText={setText}
              setShowKeyboard={setShowKeyboard}
            />
            <div className="flex flex-col md:flex-row mt-6 space-y-4 md:space-y-0 md:space-x-8">
              <div className="md:w-1/2">
                <h1 className="text-2xl font-bold text-orange-600 mb-4">
                  Study smarter with Chegg.
                </h1>
                <p className="text-gray-700">
                  91% of Chegg customers say they get better grades when they
                  use Chegg to understand their coursework.
                </p>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row bg-white rounded-lg shadow-md p-4 items-center">
                  <img src={image1} alt="100 million+ expert solutions" className="w-12 h-12" />
                  <span className="ml-4 text-gray-700">100 million+ expert solutions</span>
                </div>
                <div className="flex flex-row bg-white rounded-lg shadow-md p-4 items-center">
                  <img src={image2} alt="Save solutions for study time" className="w-12 h-12" />
                  <span className="ml-4 text-gray-700">Save solutions for study time</span>
                </div>
                <div className="flex flex-row bg-white rounded-lg shadow-md p-4 items-center">
                  <img src={image3} alt="Math help and grammar checks" className="w-12 h-12" />
                  <span className="ml-4 text-gray-700">Math help and grammar checks</span>
                </div>
              </div>
            </div>
          </main>
          <footer className="mt-6 text-xs text-center text-gray-500 p-4">
            'Chegg survey fielded between Sept. 24 – Oct. 12, 2023 among U.S.
            customers who used Chegg Study or Chegg Study Pack in Q2 2023 and Q3
            2023. Respondent base (n=611) among approximately 837,000 invites.
            Individual results may vary. Survey respondents were entered into a
            drawing to win 1 of 10 $300 e-gift cards.'
          </footer>
        </div>
      </div>
    </div>
  );
}
