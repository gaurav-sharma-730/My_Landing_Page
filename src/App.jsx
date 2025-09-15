import MyLinks from './MyLinks'
// reverted: using static animated background
import { useEffect, useRef } from "react";

 function App() {
  const blob1 = useRef(null);
  const blob2 = useRef(null);

  useEffect(() => {
    const moveBlobs = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;

      if (blob1.current) {
        blob1.current.style.transform = `translate(${x / 2}%, ${y / 2}%)`;
      }
      if (blob2.current) {
        blob2.current.style.transform = `translate(${x / 3}%, ${y / 3}%)`;
      }
    };

    window.addEventListener("mousemove", moveBlobs);
    return () => window.removeEventListener("mousemove", moveBlobs);
  }, []);
  
  return (
    <div className="relative min-h-screen flex justify-center overflow-hidden box">
    {/* animated background layer */}
    <div className="absolute inset-0 -z-10 animated-bg" />
      {/* blurred color blobs that follow the cursor (CSS + useEffect above) */}
      <div
        ref={blob1}
        className="blob pointer-events-none bg-gradient-to-r from-pink-500 to-purple-600"
        style={{ top: '0%', left: '1%' }}
      />
      <div
        ref={blob2}
        className="blob pointer-events-none bg-gradient-to-r from-blue-500 to-yellow-400"
        style={{ top: '30%', left: '50%' }}
      />

      {/* centered, mobile-width content */}
      <div className="w-full max-w-md sm:max-w-lg px-4 py-8 text-white box">
        <MyLinks />
      </div>
    </div>
  )
}

export default App
