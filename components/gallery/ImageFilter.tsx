import { useRouter } from "next/navigation";

export const ImageFilter = ({ activeFilter }: { activeFilter?: string }) => {
  const router = useRouter();

  const filters = [
    { value: "all", label: "All" },
    { value: "face-swap", label: "Face Swap" },
    { value: "remove-bg", label: "Background Removal" },
    { value: "enhance", label: "Enhanced" },
  ];

  return (
    <div className="flex gap-4 p-4">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => {
            const params = new URLSearchParams();
            if (filter.value !== "all") params.set("filter", filter.value);
            router.push(`/gallery?${params.toString()}`);
          }}
          className={`px-4 py-2 rounded ${
            activeFilter === filter.value ||
            (!activeFilter && filter.value === "all")
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
