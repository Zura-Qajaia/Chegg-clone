import { CiCreditCard1 } from "react-icons/ci";
import { MdOutlineSecurity } from "react-icons/md";
import { FaRegComments } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { RiBillLine } from "react-icons/ri";
import { MdApps } from "react-icons/md";
import { Link } from "react-router-dom";
import '../../public/css/AccountNavigation.css'
import { useUser } from "../contexts/UserContext";

export default function AccountNavigation() {
  const {router, setRouter} = useUser();
  const t = "text-orange-500";

    return ( <div className="za">
    <Link to="/" className="title">Chegg</Link>
    <div className="nav">
    <div className="z flex flex-row items-center gap-12 md:ml-96 md:mt-4">
      <Link to="/my/account" onClick={() => setRouter("overview")} className={router ==="overview" ? `flex flex-col items-center  hover:text-orange-500 ${t}` : "flex flex-col items-center  hover:text-orange-500"}>
        <MdApps size={24} className="mr-2" />
        Overview
      </Link>

      <Link to="/my/orders" onClick={() => setRouter("orders")} className={router ==="orders" ? `flex flex-col items-center  hover:text-orange-500 ${t}` : "flex flex-col items-center  hover:text-orange-500"}>
        <RiBillLine size={24} className="mr-2" />
        Orders
      </Link>

      <Link  to="/my/profile" onClick={() => setRouter("profileinfo")} className={router ==="profileinfo" ? `flex flex-col items-center  hover:text-orange-500 ${t}` : "flex flex-col items-center  hover:text-orange-500"}>
        <CgProfile size={24} className="mr-2" />
        Profile Info
      </Link>

      <Link to="/my/security" onClick={() => setRouter("security")} className={router ==="security" ? `flex flex-col items-center  hover:text-orange-500 ${t}` : "flex flex-col items-center  hover:text-orange-500"}>
        <MdOutlineSecurity size={24} className="mr-2" />
        Security
      </Link>

      <Link to="/my/payments" onClick={() => setRouter("paymentmethods")} className={router ==="paymentmethods" ? `flex flex-col items-center  hover:text-orange-500 ${t}` : "flex flex-col items-center  hover:text-orange-500"}>
        <CiCreditCard1 size={24} className="mr-2" />
        Payment Methods
      </Link>

      <button className="flex flex-col items-center  hover:text-orange-500">
        <FaRegComments size={24} className="mr-2" />
        Communications
      </button>
      </div>
    </div>
  </div>);
}