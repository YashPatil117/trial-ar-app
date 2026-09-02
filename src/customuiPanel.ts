// import {
//   AssetManifest,
//   AssetType,
//   SessionMode,
//   World,
// } from "@iwsdk/core";

// import { CreateAR, Ma5cAnimationSystem } from "./Ma5c";
// import { createCustomPanelEntity, CustomUiPanel } from "./panel";

// const assets: AssetManifest = {
//   chimeSound: {
//     url: "/audio/chime.mp3",
//     type: AssetType.Audio,
//     priority: "background",
//   },
//   webxr: {
//     url: "/textures/webxr.png",
//     type: AssetType.Texture,
//     priority: "critical",
//   },
//   plantSansevieria: {
//     url: "./gltf/plantSansevieria/plantSansevieria.gltf",
//     type: AssetType.GLTF,
//     priority: "critical",
//   },
//   robot: {
//     url: "./gltf/robot/robot.gltf",
//     type: AssetType.GLTF,
//     priority: "critical",
//   },
//   Ma5c: {
//     url: "./gltf/Ma5c/ma5c_ar.gltf",
//     type: AssetType.GLTF,
//     priority: "critical",
//   },
// };

// World.create(document.getElementById("scene-container") as HTMLDivElement, {
//   assets,
//   xr: {
//     sessionMode: SessionMode.ImmersiveAR,
//     offer: "always",
//     features: {
//       handTracking: true,
//       anchors: true,
//       hitTest: true,
//       planeDetection: true,
//       meshDetection: true,
//       layers: true,
//     },
//   },
//   features: {
//     locomotion: false,
//     grabbing: true,
//     physics: true,
//     sceneUnderstanding: true,
//     environmentRaycast: true,
//   },
  

// }).then((world) => {
//   const { camera } = world;
//   camera.position.set(0, 1, 0.5);

//   // 👇 THIS is what actually spawns your gltf model — you were missing this call
//   CreateAR(world);

//   // 👇 spawns your UI panel too
//   createCustomPanelEntity(world);
// });