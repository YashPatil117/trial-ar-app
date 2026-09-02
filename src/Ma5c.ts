import {
  AnimationClip,
  AnimationMixer,
  AnimationAction,
  AssetManager,
  LoopOnce,
  World,
  createComponent,
  Types,
  createSystem,
  RayInteractable,
  DistanceGrabbable,
  OneHandGrabbable,
  TwoHandsGrabbable,
} from "@iwsdk/core";

export const Ma5Component = createComponent("ma5c", {
  requestAnimationIndex: { type: Types.Int32, default: -1 },
  animationRequestId: { type: Types.Int32, default: -1 },
  animationClips: { type: Types.Object, default: [] },
});

export function CreateAR(world: World) {
  const gltf = AssetManager.getGLTF("Ma5c");
  if (!gltf) {
    throw new Error("Ma5c Assault rifle GLTF asset not found");
  }
  console.log("Loaded GLTF scene:", gltf.scene);


  //before
//   const ma5centity = world.createTransformEntity(gltf.scene, {
//     parent: world.sceneEntity,
//   });

const ma5centity = gltf.scene;

  ma5centity.position.set(0, 1, -2);
  ma5centity.scale.setScalar(0.4);
  ma5centity.rotation.set(0, 90, -80);
  ma5centity.visible = true;


  const ma5entity1 = world.createTransformEntity(ma5centity);

  ma5entity1.addComponent(RayInteractable);
//   ma5entity1.addComponent(OneHandGrabbable);
  ma5entity1.addComponent(TwoHandsGrabbable,{
    rotate:true,
  })
  //before
//   ma5centity.addComponent(Ma5Component, {
//     animationClips: gltf.animations,
//   });

  return ma5centity;
}

export class Ma5cAnimationSystem extends createSystem({
  ma5c: { required: [Ma5Component] },
}) {
  private mixer!: AnimationMixer;
  private actions: AnimationAction[] = [];
  private lastRequestId = -1;
  private activeAction?: AnimationAction;

  init(): void {
    console.log("Ma5cAnimationSystem initialized");

    this.queries.ma5c.subscribe("qualify", (entity) => {
      if (!entity.object3D) {
        console.warn("No object3D found for entity");
        return;
      }
      this.mixer = new AnimationMixer(entity.object3D);

      const clips = entity.getValue(Ma5Component, "animationClips") as AnimationClip[];
      this.actions = clips.map((clip) => {
        const action = this.mixer.clipAction(clip);
        action.loop = LoopOnce;
        action.clampWhenFinished = true;
        return action;
      });

      this.actions.forEach((action) => {
        console.log(`Action for clip ${action.getClip().name} created`);
      });
    });
  }

  update(delta: number): void {
    if (!this.mixer) return;

    const ma5c = this.queries.ma5c.entities.values().next().value;
    if (!ma5c) return;

    const currentreqid = ma5c.getValue(Ma5Component, "requestAnimationIndex") ?? -1;

    if (currentreqid !== this.lastRequestId) {
      this.lastRequestId = currentreqid;

      const action = this.actions[currentreqid];
      if (!action) {
        console.warn(`No action found for animation index ${currentreqid}`);
        return;
      }

      action.reset();
      action.play();
      this.activeAction = action;
    }
    this.mixer.update(delta);
  }
}