export interface NotifyList {
  InsertTime: number;
  CardboardId: number;
  CardboardSubject: string;
  CardboardFlowMessage: string;
  open: boolean;
}
export interface MenuList {
  MenuName: number;
  MenuIcon: number;
  MenuIconHover: string;
  SubMenu: SubMenu[];
}
export interface SubMenu {
  MenuLink: string;
  SubMenuName: string;
  WorkFlowIconName: string;
  WorkFlowFormName: string;
  WorkFlowTypeCommand: string;
  AccessLink: string;
  SearchApiKey: string;
  ApiKey: string;
}
