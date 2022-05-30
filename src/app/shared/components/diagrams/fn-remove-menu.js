// export default class CustomPaletteProvider {
//     constructor(palette) {
//       palette.registerProvider(this);
//     }
  
//     getPaletteEntries() {
//       return function (entries) {
//         delete entries["create.exclusive-gateway"];
//         delete entries["create.intermediate-event"];
//         delete entries["create.task"];
//         delete entries["create.data-store"];
//         delete entries["create.end-event"];
//         delete entries["create.group"];
//         delete entries["create.participant-expanded"];
//         delete entries["create.subprocess-expanded"];
//         delete entries["hand-tool"];
//         delete entries["global-connect-tool"];
//         delete entries["create.data-object"];
//         delete entries["create.start-event"];
//         delete entries["space-tool"];
//         delete entries["lasso-tool"];
//         delete entries["edit.bpmn-icon-screw-wrench"];
//         return entries;
//       };
//     }
//   }
  
//   CustomPaletteProvider.$inject = ["palette"];
  