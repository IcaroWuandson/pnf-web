import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 w-full justify-center">
      <Image src="/assets/Logo.png" alt=" Logo" width="200" height="50" />
    </div>
  );
};

export default Logo;
