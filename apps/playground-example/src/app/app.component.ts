import { Component } from '@angular/core';

import { BabylonJSViewComponent } from '@ngx-babylonjs/ngx-babylonjs';
import { PlaygroundExampleComponent } from './PlaygroundExample/playground-example.component';

@Component({
  standalone: true,
  imports: [ BabylonJSViewComponent, PlaygroundExampleComponent ],
  selector: 'ngx-babylonjs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent  {
  
}
