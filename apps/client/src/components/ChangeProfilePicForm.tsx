import { FileIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function ChangeProfilePicForm() {
  return (
    <form className="space-y-6 w-full md:w-[50%]">
      {/* Username */}
      <div className="md:flex-col md:items-start">
        <div className="md:w-full">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Profile Picture
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload your desired profile picture.
          </p>
        </div>
        <div className="mt-2 md:my-3 md:w-full">
          <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
            <FileIcon className="w-12 h-12" />
            <span className="text-sm font-medium text-gray-500">
              Drag and drop a file or click to browse
            </span>
            <span className="text-xs text-gray-500">Images only</span>
          </div>
          <div className="space-y-2 text-sm my-4">
            <Label htmlFor="file" className="text-sm font-medium">
              File
            </Label>
            <Input
              id="file"
              type="file"
              placeholder="File"
              accept="image/*"
              className="dark:bg-slate-700"
            />
          </div>
          {/* Save button */}
          <Button type="submit" size="lg">
            Upload
          </Button>
        </div>
      </div>
    </form>
  );
}
