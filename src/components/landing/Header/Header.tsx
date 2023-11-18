import { memo } from "react";
import AuthShowcase from "./components/AuthShowcase";
import Image from "next/image";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="sticky top-3 flex items-center justify-center">
      <div className=" container m-6 mt-2 flex justify-between rounded-full bg-background/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link className="mr-4 flex" href="/">
          <Image
            className="w-[6.0625rem] flex-shrink-0 dark:hidden"
            src="/images/logo-light.svg"
            width={97}
            height={32}
            alt="ITVS"
          />
          <Image
            className="hidden w-[6.0625rem] flex-shrink-0 dark:block"
            src="/images/logo-dark.svg"
            width={97}
            height={32}
            alt="ITVS"
          />
        </Link>
        <AuthShowcase />
      </div>
    </header>
  );
};

export default memo(Header);
