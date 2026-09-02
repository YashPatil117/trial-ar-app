import {
  createSystem,
  eq,
  PanelUI,
  PanelDocument,
  RayInteractable,
  World,
  ScreenSpace,
} from "@iwsdk/core";

import { Ma5Component } from "./Ma5c";

export function createCustomPanelEntity(world: World) {
  const panelEntity = world.createTransformEntity(undefined, {
    parent: world.sceneEntity,
  });

  panelEntity.object3D?.position.set(0, 0, -1);
  panelEntity.object3D?.scale.setScalar(0.5);

  panelEntity
    .addComponent(PanelUI, {
      config: ".ui/animationbutton.json",
    })
    .addComponent(ScreenSpace, {
      width: "500px",
      height: "500px",
      right: "40%",
      left: "40%",
    });

  panelEntity.addComponent(RayInteractable);

  return panelEntity;
}

export class CustomUiPanel extends createSystem({
  animationPanel: {
    required: [PanelUI, ScreenSpace, RayInteractable],
    where: [eq(PanelUI, "config", ".ui/animationbutton.json")],
  },
  ma5c: { required: [Ma5Component] },
}) {
  init() {
    this.queries.animationPanel.subscribe("qualify", (entity) => {
      const document = PanelDocument.data.document[entity.index] as Document;
      console.log("Panel document loaded:", document);
    });
  }
}