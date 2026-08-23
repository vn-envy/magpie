import { Composition } from "remotion";
import { Launch } from "./Launch";
import { Demo, DEMO_DURATION } from "./Demo";

export const RemotionRoot = () => (
  <>
    <Composition
      id="Demo"
      component={Demo}
      durationInFrames={DEMO_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Launch"
      component={Launch}
      durationInFrames={1500}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
