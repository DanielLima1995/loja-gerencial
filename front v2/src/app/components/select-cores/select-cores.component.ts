
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Tag } from '../../app.interface';
import { globalModules } from '../../globalModules';

@Component({
  selector: 'app-select-cores',
  imports: [...globalModules,
    
    

  ],  templateUrl: './select-cores.component.html',
  styleUrl: './select-cores.component.scss'
})
export class SelectCoresComponent {
  @Input() tags: Tag[] | Record<string, Tag[]> = [];
  @Input() actualColor: number = 0;
  @Input() disabled: boolean = false;

  @Output() selectedColor: EventEmitter<number> = new EventEmitter<number>();
  selectedColorId: number | null = null;

  ngOnInit(): void {
    this.selectedColorId = this.actualColor || null;
  }

  get coresDisponiveis(): Tag[] {
    const tags = Array.isArray(this.tags) ? this.tags : this.tags?.['Cores'] ?? [];
    const ids = new Set<number>();

    return tags.filter((tag) => {
      if (ids.has(tag.id)) return false;
      ids.add(tag.id);
      return true;
    });
  }

  sendSelectedColor(colorId: number): void {
    this.selectedColorId = colorId;
    this.selectedColor.emit(colorId);
  }


}
