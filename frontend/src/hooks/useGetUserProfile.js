import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);

        const data = await res.json();

        if (data.error && data.error.length < 500) {
          return showToast("Error!", data.error, "error");
        }

        setUser(data);
      } catch (error) {
        return showToast("Error!", error, "error");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

  return { loading, user };
};

export default useGetUserProfile;
