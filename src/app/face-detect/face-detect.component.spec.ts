import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceDetectComponent } from './face-detect.component';

describe('FaceDetectComponent', () => {
  let component: FaceDetectComponent;
  let fixture: ComponentFixture<FaceDetectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceDetectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaceDetectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
