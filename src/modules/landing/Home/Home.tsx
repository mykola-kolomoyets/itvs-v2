import LandingLayout from "@/components/layout/LandingLayout";
import { memo } from "react";

const HomeModule: React.FC = () => {
  return (
    <LandingLayout>
      <h1>Home</h1>
    </LandingLayout>
  );
};

export default memo(HomeModule);
