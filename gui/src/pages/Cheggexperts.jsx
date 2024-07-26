import React from 'react';
import ExpertsNavigation from '../components/ExpertsNavigation';
import image from '../../public/images/7.png';
import { Link } from 'react-router-dom';
import image1 from "../../public/images/Hassle.png";
import image2 from "../../public/images/knowledge.png";
import image3 from "../../public/images/payout.png";
import image4 from "../../public/images/comm.png";
import { useMutation } from '@tanstack/react-query';

function Cheggexperts() {

  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return axios.post('/todos', newTodo)
    },
  });  

  function handleClick() {

  }

  return (
    <div className="">
      <ExpertsNavigation />

      <div className="flex flex-col md:mt-24 md:flex-row justify-center items-center mt-4">
        <img src={image} alt="Laptop with Chegg website" className="md:mr-10 md:w-1/2 h-auto" />
        <div className="flex flex-col items-center md:w-1/2">
          <h2 className="font-bold text-4xl">Become an Expert</h2>
          <label className="md:mr-96 mt-4">Email*</label>
          <input className="border border-gray-300 md:mr-8 p-2 rounded-md w-full md:w-3/4" />
          <div className="flex flex-col md:mr-12 md:flex-row items-center md:mt-4">
  <input
    type="checkbox"
    id="scales"
    name="scales"
    className="md:mr-4 font-bold"
  />
  <label
    htmlFor="scales"
    className="md:mb-0 md:mt-0 font-bold"
  >
    I accept receiving email communications. *
  </label>
</div>
          <button onClick={handleClick} className="bg-orange-500 rounded-full text-white p-2 mt-4">Start Sign Up</button>
          <Link className='text-gray-400 underline md:mt-8 md:mr-8'>Already registered user? Sign In</Link>
          <span>For hiring related queries, kindly write to</span>
         <span>experthiring@chegg.com</span>
        </div>
      </div>
    
      <div className="grid grid-cols-2 bg-red-200 md:grid-cols-4 gap-4 mt-64">
        <div className="flex md:h-80  md:mt-4 flex-col items-center">
          <div className='md:w-36 md:h-72 bg-white border-2 rounded-md border-black'>
          <img src={image1} alt="Hassle-Free" className="w-20 h-20 md:ml-8" />
          <h3 className="md:ml-4 text-xl font-medium mt-2">Hassle-Free</h3>
          <p className="text-center text-gray-500">Flexible work</p>
          <p className="text-center text-gray-500">schedule allowing</p>
          <p className="text-center text-gray-500">you to work as</p>
          <p className="text-center text-gray-500">per your own</p>
          <p className="text-center text-gray-500">convenience.</p>
          </div>
        </div>
        <div className="flex md:h-80  md:mt-4 flex-col items-center">
          <div className='md:w-36 md:h-72 bg-white border-2 rounded-md border-black'>
          <img src={image2} alt="Hassle-Free" className="w-20 h-20 md:ml-8" />
          <h3 className="md:ml-4 text-xl font-medium mt-2">Knowledge</h3>
          <p className="text-center text-gray-500">Enhance your</p>
          <p className="text-center text-gray-500">subject</p>
          <p className="text-center text-gray-500">knowledge with</p>
          <p className="text-center text-gray-500">international</p>
          <p className="text-center text-gray-500">academic</p>
          <p className="text-center text-gray-500">exposure.</p>
          </div>
        </div>
        <div className="flex md:h-80  md:mt-4 flex-col items-center">
          <div className='md:w-36 md:h-72 bg-white border-2 rounded-md border-black'>
          <img src={image3} alt="Hassle-Free" className="w-20 h-20 md:ml-8" />
          <h3 className="md:ml-4 text-xl font-medium mt-2">Payouts</h3>
          <p className="text-center text-gray-500">Payment for every</p>
          <p className="text-center text-gray-500">question solved.</p>
          <p className="text-center text-gray-500">Top experts earn</p>
          <p className="text-center text-gray-500">up to ₹1 Lac a</p>
          <p className="text-center text-gray-500">month.</p>
          </div>
        </div>

        <div className="flex md:h-80  md:mt-4 flex-col items-center">
          <div className='md:w-36 md:h-72 bg-white border-2 rounded-md border-black'>
          <img src={image4} alt="Hassle-Free" className="w-20 h-20 md:ml-8" />
          <h3 className="md:ml-4 text-xl font-medium mt-2">Meet-Ups</h3>
          <p className="text-center text-gray-500">Attend expert</p>
          <p className="text-center text-gray-500">meet-ups and</p>
          <p className="text-center text-gray-500">network with your</p>
          <p className="text-center text-gray-500">peers to excel in</p>
          <p className="text-center text-gray-500">your career.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cheggexperts;
