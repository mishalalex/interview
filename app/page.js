import { Button } from "@/components/ui/button";
import Image from "next/image";
import Provider from "./provider";

export default function Home() {
  return (
    <div>
      <h2>Hi from AI Mishal!</h2>
      <Button>Yes!</Button>
      <Provider/>
    </div>
  );
}
