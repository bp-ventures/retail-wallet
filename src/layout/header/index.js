import dynamic from "next/dynamic";
const BootStrapNavBar = dynamic(() => import("../navbar"), {
  ssr: false,
});

export default BootStrapNavBar;
