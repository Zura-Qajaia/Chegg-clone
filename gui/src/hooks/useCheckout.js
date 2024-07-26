import { useEffect, useState } from "react";
import usesignedin from "./usesignedin";
import { createCheckoutSession } from "./api";

const useCheckout = () => {
  const { userInfo, loading: userLoading, error: userError } = usesignedin();
  const [checkoutResponse, setCheckoutResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initiateCheckout = async () => {
      if (userInfo && userInfo.user && userInfo.user.email && userInfo.user.firstName) {
        try {
          setLoading(true);
          const response = await createCheckoutSession("1234", userInfo.user.email, userInfo.user.firstName);
          console.log(response);
          setCheckoutResponse(response);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    initiateCheckout();
  }, [userInfo]);

  return { checkoutResponse, loading, error: error || userError };
};

export default useCheckout;
