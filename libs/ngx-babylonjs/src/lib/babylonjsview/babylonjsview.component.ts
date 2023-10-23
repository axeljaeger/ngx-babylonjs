import {
    AfterContentChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    ElementRef,
    HostListener,
    NgZone,
    QueryList,
    ViewChild,
  } from '@angular/core';
  
  import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
  import { Engine } from '@babylonjs/core/Engines/engine';
  import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
  import { Vector3 } from '@babylonjs/core/Maths/math.vector';
  import { Scene } from '@babylonjs/core/scene';
  
  import { NullEngine } from '@babylonjs/core/Engines/nullEngine';
import { BabylonConsumer, implementsOnSceneCreated } from '../lifecycle';
  
  @Component({
    selector: 'ngx-babylonjs-view',
    template: '<canvas #view3dcanvas><ng-content/></canvas>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
  })
  export class BabylonJSViewComponent
    implements AfterViewInit, AfterContentChecked
  {
    @ViewChild('view3dcanvas', { static: false })
    canvasRef: ElementRef<HTMLCanvasElement>;
  
    @ContentChildren(BabylonConsumer)
    renderers: QueryList<BabylonConsumer>;
  
    engine: Engine;
    scene: Scene;

    camera: ArcRotateCamera;
  
    constructor(
      private ngZone: NgZone,
      private elRef: ElementRef,
    ) {
    }


    ngAfterContentChecked(): void {
      this.ngZone.runOutsideAngular(() => {
        if (this.scene) {
          this.scene.render();
        }
      });
    }
  
    @HostListener('window:resize')
    resize(): void {
      console.log("Resize", this.elRef.nativeElement.getBoundingClientRect());
      const rect = this.elRef.nativeElement.getBoundingClientRect();
      this.canvasRef.nativeElement.width = rect.width;
      this.canvasRef.nativeElement.height = rect.height;
      this.engine.resize();
    }
  
    async ngAfterViewInit(): Promise<void> {
      this.initEngine(this.canvasRef);
      await Promise.all(
        this.renderers.map((renderer) =>
          implementsOnSceneCreated(renderer)
            ? renderer.ngxSceneCreated(this.scene)
            : Promise.resolve()
        )
      );
      this.scene.render();
    }
  
    initEngine(canvas: ElementRef<HTMLCanvasElement>) {
      this.ngZone.runOutsideAngular(() => {
        if (window.WebGLRenderingContext) {
          this.engine = new Engine(canvas.nativeElement, true);
          //this.engine.setStencilBuffer(true);
          //this.engine.setStencilMask(0xff);
        } else {
          this.engine = new NullEngine();
        }
  
        // Uniform buffers are disabled per default in Chrome on MacOS
        // Re-enable this.
        this.engine.disableUniformBuffers = false;
  
        this.scene = this.createScene(canvas);
        // this.scene.useRightHandedSystem = true;
      });
      this.resize();
      this.engine.runRenderLoop(() => {
        console.log("rendering");
        this.scene.render();
      });
    }
  
    createScene(canvas: ElementRef<HTMLCanvasElement>) {
      const scene = new Scene(this.engine);
      this.camera = new ArcRotateCamera(
        'Camera',
        (3 * Math.PI) / 4,
        Math.PI / 4,
        5.0,
        Vector3.Zero(),
        scene
      );
      this.camera.lowerRadiusLimit = 0.01;
      this.camera.attachControl(canvas, true);
      this.camera.minZ = 0.001;
      this.camera.inertia = 0;
      this.camera.wheelDeltaPercentage = 0.1;
      this.camera.zoomToMouseLocation = true;
  
      this.camera.onViewMatrixChangedObservable.add(() => scene.render());
  
      const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
      return scene;
    }
  }
  