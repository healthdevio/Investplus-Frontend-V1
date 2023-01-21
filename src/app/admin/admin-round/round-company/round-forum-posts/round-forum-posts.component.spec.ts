import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoundForumPostsComponent } from './round-forum-posts.component';

describe('RoundForumPostsComponent', () => {
  let component: RoundForumPostsComponent;
  let fixture: ComponentFixture<RoundForumPostsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundForumPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundForumPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
