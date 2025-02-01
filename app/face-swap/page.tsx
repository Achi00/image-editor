import FaceSwapForm from "@/components/face-swap/FaceSwapForm";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-3 md:px-0 py-5">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Face swap
      </h1>
      <FaceSwapForm />
    </div>
  );
};

export default page;
