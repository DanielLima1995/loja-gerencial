
import { Component } from '@angular/core';

import { globalModules } from '../../globalModules';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],  // Certifique-se de usar styleUrls (plural)
  imports:[
    ...globalModules
    
  ]
})
export class FooterComponent {
  menu: Array<any> = [];

  ngOnInit(){
    while(this.menu.length < 3){
      let subItem = [];
      while(subItem.length < 7){
        subItem.push({
          titulo: ('SubMenu ' + subItem.length),
          link: 'okok'
        });
      }

      this.menu.push({
        titulo: 'Menu ' + this.menu.length,
        subItem: subItem
      });
      
    }
  }
}
