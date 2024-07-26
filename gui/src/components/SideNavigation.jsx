import { useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { FaHome, FaRegClock } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function SideNavigation() {
const [which, setWhich] = useState("home");
const t = "border-l-4 border-h-1 border-orange-500 ";

  return (
    <div className="flex flex-col border-l-2 border-solid border-slate-400 p-4">
      <div className="flex flex-col items-start">
        <Link to="/" onClick={() => setWhich("home")} className={which === "home" ? `py-2 flex space-x-2 ${t}` : "py-2 flex space-x-2"}>
          <FaHome />
          <span> Home </span>
        </Link>
        <Link to="/recent" onClick={() => setWhich("recent")} className={which === "recent" ? `py-2 flex space-x-2 ${t}` : "py-2 flex space-x-2"} >
          <FaRegClock />
          <span> Recent </span>
        </Link>
        <Link to="/mystuff" className="py-2 flex space-x-2">
          <CiBookmark />
          <span> My stuff </span>
        </Link>
      </div>
    </div>
  );
}
