import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagensProdutosComponent } from './imagens-produtos.component';

describe('ImagensProdutosComponent', () => {
  let component: ImagensProdutosComponent;
  let fixture: ComponentFixture<ImagensProdutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImagensProdutosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagensProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
