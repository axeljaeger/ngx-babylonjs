import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BabylonConsumer } from '@ngx-babylonjs/ngx-babylonjs';
import { Scene } from '@babylonjs/core/scene';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import '@babylonjs/core/Materials/standardMaterial';
import '@babylonjs/core/Culling/ray'

@Component({
  selector: 'ngx-babylonjs-playground-example',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content/>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BabylonConsumer, useExisting: forwardRef(() => PlaygroundExampleComponent)}],
})
export class PlaygroundExampleComponent implements BabylonConsumer {
  async ngxSceneCreated(scene: Scene): Promise<void> {
    const sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape.
    const ground = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    // scene.render();
  }
}
