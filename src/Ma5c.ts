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
  Entity,
  Interactable,
  OneHandGrabbable,
  DistanceGrabbable,
  TwoHandsGrabbable
} from "@iwsdk/core";

export const Ma5Component = createComponent("ma5c", {
  requestAnimationIndex: { type: Types.Int32, default: -1 },
  animationRequestId: { type: Types.Int32, default: -1 },
  animationClips: { type: Types.Object, default: [] },
});

export function CreateAR(world: World): Entity {
  const gltf = AssetManager.getGLTF("Ma5c");
  if (!gltf) {
    throw new Error("Ma5c Assault rifle GLTF asset not found");
  }

  const mesh = gltf.scene;
  mesh.position.set(0, 1, -2);
  mesh.scale.setScalar(0.4);
  mesh.rotation.set(0, 90, -80);
  mesh.visible = true;

  const entity = world.createTransformEntity(mesh);

  entity.addComponent(Interactable);
  entity.addComponent(TwoHandsGrabbable, {
    rotate: true,
  });
  entity.addComponent(Ma5Component, {
    animationClips: gltf.animations,
  });

  return entity;
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