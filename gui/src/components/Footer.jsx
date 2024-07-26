export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          {/* Column 1 */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul>
              <li className="mb-2"><a href="#" className="hover:underline">About Us</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">Careers</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">Blog</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">Press</a></li>
            </ul>
          </div>
          {/* Column 2 */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul>
              <li className="mb-2"><a href="#" className="hover:underline">Help Center</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">Contact Us</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">FAQs</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">Site Map</a></li>
            </ul>
          </div>
          {/* Column 3 */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Twitter</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">LinkedIn</a></li>
            </ul>
          </div>
          {/* Column 4 */}
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
        
          </div>
        </div>
        <div className="mt-10 text-center border-t border-gray-700 pt-5">
          <p className="text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
