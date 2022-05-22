
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { SignalrService } from './signalr.service';
import { AuthService } from '@core/auth/auth.service';



@Injectable()
export class MenuService {
  private contract = {
    ...this.signalr.baseContract,
    ApiKey: 'UserMenu',
    ActionType: 'LoadN',
    Data: [{ Model: 'UserMenu', Criteria: null }],
    FormTag: 'UserMenu',
  };

  constructor(public signalr: SignalrService, private auth: AuthService) {}

  getmenu() {
    const localMenu = localStorage.getItem('hermes_menu');

    if (localMenu) {
      const menu = JSON.parse(localMenu);
      const reducedMenu = this.reduceMenu(menu);
      return of(reducedMenu);
    } else {
      const contract = { ...this.contract, UserId: this.signalr.token };
      if (!this.signalr.signalrConnected) {
        return this.signalr.startValueChanged$.pipe(
          switchMap((_) => {
            //if(data) {
            return this.getMenuHttp(contract) || of(null);
            //  }
          })
        );
      }

      return this.getMenuHttp(contract);
    }
  }

  getMenuHttp(contract: any) {
    return this.signalr.postGetData(contract)?.pipe(
      map((data) => {
        console.log(data);
        
        const menuList = this.makeMenu(data);
        const sortedMenu = this.sortMenu(menuList);
        localStorage.setItem('hermes_menu', JSON.stringify(sortedMenu));
        const reducedMenu = this.reduceMenu(sortedMenu);
        this.auth.initPermissions();
        this.auth.initAccessLinks();

        return reducedMenu;
      })
    );
  }

  makeMenu(data: any) {
    const result: any = [];
    let hasMenu;
    let indx = 0;
    data.map((item: any, index: number) => {
      hasMenu = result.findIndex((el: any) => el.MenuName === item.MenuName);

      const subMenu = {
        SubMenuName: item.SubMenuName,
        MenuLink: item.MenuLink,
        SubMenuCode: item.SubMenuCode,
        AccessLink: JSON.parse(item.AccessLink),
        WorkFlowIconName: item.WorkFlowIconName,
        WorkFlowFormName: item.WorkFlowFormName,
        WorkFlowTypeCommand: item.WorkFlowTypeCommand,
        ApiKey: item.ApiKey,
        SearchApiKey: item.SearchApiKey,
      };

      if (hasMenu > -1) {
        result[hasMenu]['SubMenu'].push(subMenu);
      } else {
        result[indx] = {
          MenuName: item.MenuName,
          MenuIcon: `/assets/images/${item.MenuIcon}.png`,
          MenuIconHover: `/assets/images/${item.MenuIcon}-hover.png`,
          MenuCode: item.MenuCode,
          SubMenu: [subMenu],
        };
        indx++;
      }
    });

    return result;
  }

  sortMenu(result: any) {
    let sorted = result.sort((a: any, b: any) => {
      return a.MenuCode - b.MenuCode;
    });
    sorted = sorted.map((el:any) => {
      return {
        ...el,
        ...el.SubMenu.sort((c: any, d: any) => {
          return c.SubMenuCode - d.SubMenuCode;
        }),
      };
    });

    return sorted;
  }

  reduceMenu(data: any) {
    const reduced = data.map((el: any) => {
      el.SubMenu = el.SubMenu.reduce((acc: any, current: any) => {
        const x = acc.find(
          (item: any) => item.SubMenuCode === current.SubMenuCode
        );
        if (!x) {
          return acc.concat(current);
        } else {
          return acc;
        }
      }, []);

      return el;
    });

    return reduced;
  }
}
