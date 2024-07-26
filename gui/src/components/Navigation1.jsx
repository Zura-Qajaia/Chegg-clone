import Button from "../ui/Button";
import { IoEarthOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import "../../public/css/Navigation.css"

export default function Navigation1() {
    return   <div className="flex justify-between items-center py-3 border-b border-solid border-slate-400 px-4">
    <h1 className="z">Chegg</h1>
    <div className="flex flex-row items-center space-x-4">
      <IoEarthOutline className="text-2xl" />
      <span><strong>Study</strong></span>
      <span><strong>Career</strong></span>
      <Link to="/signin"><strong>Sign in</strong></Link>
    </div>
  </div>;
}