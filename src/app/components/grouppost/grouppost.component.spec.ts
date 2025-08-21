import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrouppostComponent } from './grouppost.component';

describe('GrouppostComponent', () => {
  let component: GrouppostComponent;
  let fixture: ComponentFixture<GrouppostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrouppostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrouppostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
