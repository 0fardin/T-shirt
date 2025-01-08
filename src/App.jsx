import React, { useState, useRef } from "react";
import Draggable from "react-draggable";

const TShirtDesigner = () => {
  let [logo, setLogo] = useState(null);
  let [logoSize, setLogoSize] = useState({ width: 100, height: 100 });
  let tShirtRef = useRef(null);
  let [finalImage, setFinalImage] = useState(null);

  let handleLogoUpload = (e) => {
    let file = e.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = (e) => setLogo(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  let handleResize = (e) => {
    let newSize = parseInt(e.target.value, 10);
    setLogoSize({ width: newSize, height: newSize });
  };

  let handleSaveImage = () => {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let tShirt = tShirtRef.current;

    let tShirtRect = tShirt.getBoundingClientRect();
    canvas.width = tShirtRect.width;
    canvas.height = tShirtRect.height;

    let tShirtImage = new Image();
    tShirtImage.src = "/tshirt.png";
    tShirtImage.onload = () => {
      ctx.drawImage(tShirtImage, 0, 0, canvas.width, canvas.height);

      let logoImage = new Image();
      logoImage.src = logo;
      logoImage.onload = () => {
        let logoElement = document.getElementById("logo");
        let logoRect = logoElement.getBoundingClientRect();

        let x = logoRect.left - tShirtRect.left;
        let y = logoRect.top - tShirtRect.top;

        ctx.drawImage(logoImage, x, y, logoSize.width, logoSize.height);

        let finalImg = canvas.toDataURL("image/png");
        setFinalImage(finalImg);
        console.log(finalImg);
      };
    };
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-5 text-gray-800">
        T-Shirt Designer
      </h1>

      <div className="mb-5">
        <label className="block mb-2 font-medium text-gray-700">
          Upload Your Logo:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="block w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {logo && (
        <div className="mb-5">
          <label className="block mb-2 font-medium text-gray-700">
            Resize Logo (Width/Height):
          </label>
          <input
            type="range"
            min="50"
            max="300"
            value={logoSize.width}
            onChange={handleResize}
            className="w-80"
          />
        </div>
      )}

      <div
        ref={tShirtRef}
        className="relative w-80 h-96 mx-auto border bg-white shadow-lg"
        style={{
          backgroundImage: "url('/tshirt.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {logo && (
          <Draggable>
            <div
              id="logo"
              style={{
                position: "absolute",
                width: `${logoSize.width}px`,
                height: `${logoSize.height}px`,
                backgroundImage: `url(${logo})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                cursor: "move",
              }}
            ></div>
          </Draggable>
        )}
      </div>

      {logo && (
        <div className="mt-5 text-center">
          <button
            onClick={handleSaveImage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
          >
            Save Final Image
          </button>
        </div>
      )}

      {finalImage && (
        <div className="mt-10 text-center">
          <h2 className="text-xl font-bold mb-5 text-gray-800">
            Final T-Shirt Image
          </h2>
          <img
            src={finalImage}
            alt="Final T-Shirt Design"
            className="mx-auto border shadow-md object-cover"
          />
          <a
            href={finalImage}
            download="tshirt_design.png"
            className="block mt-3 text-blue-500 underline"
          >
            Download Final Image
          </a>
        </div>
      )}
    </div>
  );
};

export default TShirtDesigner;
