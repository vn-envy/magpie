import { Composition } from "remotion";
import { Launch } from "./Launch";

export const RemotionRoot = () => (
  <Composition
    id="Launch"
    component={Launch}
    durationInFrames={1350}
    fps={30}
    width={1920}
    height={1080}
  />
);
