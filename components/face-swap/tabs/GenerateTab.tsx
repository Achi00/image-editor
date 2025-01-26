import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GenerateTab() {
  return (
    <div className="space-y-6 p-6 w-full bg-white rounded-lg shadow">
      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt</Label>
        <Input
          id="prompt"
          placeholder="Describe the image you want to generate..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="negative-prompt">Negative Prompt (Optional)</Label>
        <Input
          id="negative-prompt"
          placeholder="Describe what you don't want in the image..."
        />
      </div>
      <div className="flex justify-between items-center">
        <Button>Generate Image</Button>
        <div className="text-sm text-gray-500">
          Image will appear here after generation
        </div>
      </div>
      <div className="mt-4 aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Generated image will appear here</span>
      </div>
    </div>
  );
}
