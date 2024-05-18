import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState();
  const showToast = useShowToast();

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgUrl(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      showToast("Invalid file!", "Please select an image", "error");
      setImgUrl(null);
    }
  };

  return { imgUrl, handleImgChange };
};

export default usePreviewImg;
