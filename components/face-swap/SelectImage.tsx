import { FaceSwapImageSelect } from "@/types";
import { Check } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

interface SelectImageProps {
  images: FaceSwapImageSelect[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

interface ImgItemProps {
  img: { id: number; imgUrl: string };
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const SelectImage = ({ images, selectedId, onSelect }: SelectImageProps) => {
  return (
    <div className="w-full flex items-center justify-center flex-wrap gap-3">
      {images.map((img) => (
        <MemoizedImageItem
          key={img.id}
          img={img}
          isSelected={selectedId === img.id}
          onSelect={() => onSelect(img.id)}
        />
      ))}
    </div>
  );
};

const ImageItem = ({ img, isSelected, onSelect }: ImgItemProps) => {
  return (
    <div
      onClick={() => onSelect(img.id)}
      className={`cursor-pointer border-4 transition-all duration-300 ${
        isSelected
          ? "border-blue-500 rounded-xl scale-95"
          : "border-transparent rounded-xl hover:border-gray-200"
      }`}
    >
      <Image
        quality={70}
        width={300}
        height={300}
        src={img.imgUrl}
        alt="Selectable image"
        className="rounded-lg"
      />
      {isSelected && (
        <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-1">
          <Check className="text-white w-4 h-4" />
        </div>
      )}
    </div>
  );
};

const MemoizedImageItem = memo(ImageItem);

export default memo(SelectImage);
