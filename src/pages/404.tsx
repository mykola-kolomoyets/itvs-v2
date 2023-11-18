import type { NextPage } from "next";
import Image from "next/image";

const NotFoundPage: NextPage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <h1 className="text-center text-5xl font-extrabold">404</h1>
        <Image
          className="m-4"
          src="/images/error.png"
          width={400}
          height={250}
          alt="Page not Found"
        />
        <h2 className="text-center text-xl">Упс</h2>
        <h2 className="text-center text-xl">
          Виникла помилка. Спробуйте ще раз пізніше
        </h2>
      </div>
    </div>
  );
};

export default NotFoundPage;
