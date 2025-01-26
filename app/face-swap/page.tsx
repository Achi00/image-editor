import FaceSwapForm from "@/components/face-swap/FaceSwapForm";
import SelectImage from "@/components/face-swap/SelectImage";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Face swap
      </h1>
      <p>how it works</p>
      <FaceSwapForm />
    </div>
  );
};

export default page;
