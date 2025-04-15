
import React from "react";
import { Loader2 } from "lucide-react";

const ComponentLoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <span className="ml-2 text-muted-foreground">Loading components...</span>
    </div>
  );
};

export default ComponentLoadingState;
