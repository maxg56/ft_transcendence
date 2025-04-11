import React from "react";
import { useTranslation } from "../context/TranslationContext";
import Header from "../components/HeaderComponent";
import { App } from "../animation/hub_animation";
import { CRTScreen } from '../components/CRTScreen.tsx';

// export default function HubCRT() {
//   return (
//     <div className="w-screen h-screen bg-black">
//       <CRTScreen>
//         {/* Place your 3D content here */}
//       </CRTScreen>
//     </div>
//   );
// }

const Hub: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className=" scale-95 ">
    <div>
     <div className="w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 flex flex-col ">
     <Header/>
     <div className= "flex justify-center items-center w-full h-[839px] overflow-hidden">
       <App />
     </div>
     </div>
     </div>
     </div>
  );
};

export default Hub; 
