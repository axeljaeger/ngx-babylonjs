import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxBabylonjsComponent } from './ngx-babylonjs.component';

describe('NgxBabylonjsComponent', () => {
  let component: NgxBabylonjsComponent;
  let fixture: ComponentFixture<NgxBabylonjsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxBabylonjsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxBabylonjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
