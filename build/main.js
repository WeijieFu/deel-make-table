var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __knownSymbol = (name, symbol) => {
  if (symbol = Symbol[name])
    return symbol;
  throw Error("Symbol." + name + " is not defined");
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __forAwait = (obj, it, method) => (it = obj[__knownSymbol("asyncIterator")]) ? it.call(obj) : (obj = obj[__knownSymbol("iterator")](), it = {}, method = (key, fn) => (fn = obj[key]) && (it[key] = (arg) => new Promise((yes, no, done) => (arg = fn.call(obj, arg), done = arg.done, Promise.resolve(arg.value).then((value) => yes({ value, done }), no)))), method("next"), method("return"), it);

// node_modules/@create-figma-plugin/utilities/lib/events.js
function on(name, handler) {
  const id = `${currentId}`;
  currentId += 1;
  eventHandlers[id] = { handler, name };
  return function() {
    delete eventHandlers[id];
  };
}
function invokeEventHandler(name, args) {
  let invoked = false;
  for (const id in eventHandlers) {
    if (eventHandlers[id].name === name) {
      eventHandlers[id].handler.apply(null, args);
      invoked = true;
    }
  }
  if (invoked === false) {
    throw new Error(`No event handler with name \`${name}\``);
  }
}
var eventHandlers, currentId;
var init_events = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/events.js"() {
    eventHandlers = {};
    currentId = 0;
    if (typeof window === "undefined") {
      figma.ui.onmessage = function(args) {
        if (!Array.isArray(args)) {
          return;
        }
        const [name, ...rest] = args;
        if (typeof name !== "string") {
          return;
        }
        invokeEventHandler(name, rest);
      };
    } else {
      window.onmessage = function(event) {
        if (typeof event.data.pluginMessage === "undefined") {
          return;
        }
        const args = event.data.pluginMessage;
        if (!Array.isArray(args)) {
          return;
        }
        const [name, ...rest] = event.data.pluginMessage;
        if (typeof name !== "string") {
          return;
        }
        invokeEventHandler(name, rest);
      };
    }
  }
});

// node_modules/@create-figma-plugin/utilities/lib/ui.js
function showUI(options, data) {
  if (typeof __html__ === "undefined") {
    throw new Error("No UI defined");
  }
  const html = `<div id="create-figma-plugin"></div><script>document.body.classList.add('theme-${figma.editorType}');const __FIGMA_COMMAND__='${typeof figma.command === "undefined" ? "" : figma.command}';const __SHOW_UI_DATA__=${JSON.stringify(typeof data === "undefined" ? {} : data)};${__html__}</script>`;
  figma.showUI(html, __spreadProps(__spreadValues({}, options), {
    themeColors: typeof options.themeColors === "undefined" ? true : options.themeColors
  }));
}
var init_ui = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/ui.js"() {
  }
});

// node_modules/@create-figma-plugin/utilities/lib/index.js
var init_lib = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/index.js"() {
    init_events();
    init_ui();
  }
});

// src/data.js
var CELLS, HEADER, MISC, STYLE;
var init_data = __esm({
  "src/data.js"() {
    CELLS = {
      Title: {
        name: "Title",
        alignment: "LeftAligned",
        key: "84708f9547e32d6ebdec52fa3fac327768531804",
        minWidth: 240,
        maxHeight: 64
      },
      Text: {
        name: "Text",
        alignment: "LeftAligned",
        key: "75b905ee5fd3795df37d38322b61023fd890df42",
        minWidth: 144,
        maxHeight: 48
      },
      Number: {
        name: "Number",
        alignment: "RightAligned",
        key: "f9785f59d7c6c763b5e265302255f14e4cfd8001",
        minWidth: 88,
        maxHeight: 48
      },
      Country: {
        name: "Country",
        alignment: "LeftAligned",
        key: "5bde9d2b4bd6c9b40d9741270b1e1538eb5ee898",
        minWidth: 160,
        maxHeight: 48
      },
      Chip: {
        name: "Chip",
        alignment: "LeftAligned",
        key: "38e9b51688e1523b6b148a5092645e4e39a61f22",
        minWidth: 120,
        maxHeight: 48
      },
      Date: {
        name: "Date",
        alignment: "LeftAligned",
        key: "bae134f6968b12c2471d1ad0f698ae449e27816c",
        minWidth: 144,
        maxHeight: 48
      },
      LongText: {
        name: "LongText",
        alignment: "LeftAligned",
        key: "d441a7f641c30346d00708e47f73994691b57d4e",
        minWidth: 320,
        maxHeight: 56
      },
      Link: {
        name: "Link",
        alignment: "LeftAligned",
        key: "fbcb28ce311d06624a56cbfc89b1bcf4c9174e28",
        minWidth: 120,
        maxHeight: 48
      },
      Currency: {
        name: "Currency",
        alignment: "RightAligned",
        key: "12f00ea7a3c13f94afc5ade5a8c455b485c7156d",
        minWidth: 120,
        maxHeight: 64
      },
      Boolean: {
        name: "Boolean",
        alignment: "LeftAligned",
        key: "9e501adb19aab3a38caeba717a303029da03721b",
        minWidth: 80,
        maxHeight: 48
      },
      Thumbnail: {
        name: "Thumbnail",
        alignment: "LeftAligned",
        key: "b176c3344db8aba08285d54f0fc5905ff09755ca",
        minWidth: 72,
        maxHeight: 64
      },
      File: {
        name: "File",
        alignment: "LeftAligned",
        key: "068671ee3f2a7a62a7a93645f01f2284ee1d0ffb",
        minWidth: 160,
        maxHeight: 48
      }
    };
    HEADER = {
      Checkbox: {
        key: "773de1b58d428668edbfe1a3ba2c764b814989ad"
      },
      LeftAligned: {
        key: "a5b5c16bc30918af3ac442f458c8791c97aee4b9"
      },
      RightAligned: {
        key: "747f1df1e8d5dff49ff750b3c5213d83b87a33d3"
      }
    };
    MISC = {
      Overhead: {
        key: "85ba98fb2d3ed8116c81e317ad781741c8eb76df"
      },
      Controls: {
        key: "271ed7d720b3eb732dda463279c250f33ff29732"
      },
      Checkbox: {
        key: "97e5426720e343647604e4109ec9b6c9335e368b"
      },
      ActionCell: {
        key: "0ff8dbf59661004a3eed290f18b0c8de4e4f9153"
      }
    };
    STYLE = {
      BoxBorder: {
        id: "S:d234d161392a67f5691e2e13defc3dade61047f9,1158:143",
        key: "d234d161392a67f5691e2e13defc3dade61047f9"
      },
      BoxFill: {
        id: "S:6ec799d67b0fbbc06ed0281f8d8a25d0cc35ff74,1158:144",
        key: "6ec799d67b0fbbc06ed0281f8d8a25d0cc35ff74"
      }
    };
  }
});

// src/main.jsx
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
function main_default() {
  on("GENERATE", drawTable);
  showUI({
    height: 600,
    width: 360
  });
}
var DEFAULTS, drawTable, formatSection, calculateColumnWidths, drawHeaderRow, drawTableRow, drawTableTemplate, _initRow;
var init_main = __esm({
  "src/main.jsx"() {
    init_lib();
    init_data();
    DEFAULTS = {
      tableWidth: 1200,
      characterWidth: 6.5,
      sortingButtonWidth: 16,
      optionsButtonWidth: 16,
      horizontalPadding: 16,
      gap: 4,
      singleLineHeaderHeight: 40,
      doubleLineHeaderHeight: 48,
      sectionOrigin: 32,
      sectionGap: 32,
      sectionHeight: 1280,
      rowNumber: 10,
      cornerRadius: 8,
      checkboxCellWidth: 56,
      actionCellWidth: 202
    };
    drawTable = async (data) => {
      if (figma.currentPage.selection.length === 0 || figma.currentPage.selection[0].type !== "SECTION") {
        figma.notify("Please select a Section first");
      } else {
        const sectionContainer = figma.currentPage.selection[0];
        const [columnWidths, totalWidth] = calculateColumnWidths(data);
        console.log(`total width:  ${totalWidth}`);
        const isTitleFill = totalWidth < DEFAULTS.tableWidth;
        const finalTableWidth = isTitleFill ? DEFAULTS.tableWidth : totalWidth;
        const headerRow = await drawHeaderRow(
          data,
          columnWidths,
          isTitleFill,
          finalTableWidth
        );
        const tableRow = await drawTableRow(
          data,
          columnWidths,
          isTitleFill,
          finalTableWidth
        );
        const table = await drawTableTemplate(
          data,
          headerRow,
          tableRow,
          finalTableWidth
        );
        formatSection(
          data,
          sectionContainer,
          headerRow,
          tableRow,
          table,
          finalTableWidth
        );
      }
    };
    formatSection = async (data, sectionContainer, headerRow, tableRow, table, totalWidth) => {
      sectionContainer.name = `${data.tableName} Table Local Components`;
      sectionContainer.appendChild(headerRow);
      sectionContainer.appendChild(tableRow);
      sectionContainer.appendChild(table);
      sectionContainer.resizeWithoutConstraints(
        DEFAULTS.sectionOrigin * 2 + totalWidth,
        DEFAULTS.sectionHeight
      );
      const line1 = figma.createText();
      await figma.loadFontAsync(line1.fontName);
      sectionContainer.appendChild(line1);
      line1.characters = "Edit master row here";
      line1.fontSize = 32;
      line1.x = DEFAULTS.sectionOrigin;
      line1.y = DEFAULTS.sectionOrigin;
      const line2 = figma.createText();
      sectionContainer.appendChild(line2);
      line2.characters = "Reuse composed table component in your design";
      line2.fontSize = 32;
      line2.x = DEFAULTS.sectionOrigin;
      line2.y = DEFAULTS.sectionOrigin + DEFAULTS.doubleLineHeaderHeight * 2 + DEFAULTS.sectionGap * 6;
      headerRow.x = DEFAULTS.sectionOrigin;
      headerRow.y = DEFAULTS.sectionOrigin * 3;
      tableRow.x = DEFAULTS.sectionOrigin;
      tableRow.y = DEFAULTS.sectionOrigin * 3 + DEFAULTS.doubleLineHeaderHeight + DEFAULTS.sectionGap;
      table.x = DEFAULTS.sectionOrigin;
      table.y = DEFAULTS.sectionOrigin + DEFAULTS.doubleLineHeaderHeight * 2 + DEFAULTS.sectionGap * 8;
    };
    calculateColumnWidths = (data) => {
      let sum = 0;
      const calculateTitleWidth = (column) => {
        if (column.name.includes("|")) {
          const words = column.name.split("|");
          let maxWidth = 0;
          for (const word of words) {
            if (word.length > maxWidth) {
              maxWidth = word.length;
            }
          }
          return maxWidth * DEFAULTS.characterWidth;
        } else {
          return column.name.length * DEFAULTS.characterWidth;
        }
      };
      const arr = data.columns.map((column, index) => {
        const titleWidth = calculateTitleWidth(column);
        const columnWidth = DEFAULTS.horizontalPadding + titleWidth + DEFAULTS.gap + DEFAULTS.sortingButtonWidth + DEFAULTS.gap + DEFAULTS.optionsButtonWidth + DEFAULTS.horizontalPadding;
        if (columnWidth > CELLS[column.type].minWidth) {
          sum = sum + Math.ceil(columnWidth / 8) * 8;
          return Math.ceil(columnWidth / 8) * 8;
        } else {
          sum = sum + CELLS[column.type].minWidth;
          return CELLS[column.type].minWidth;
        }
      });
      if (data.hasBatchActions) {
        sum = sum + DEFAULTS.checkboxCellWidth;
      }
      if (data.hasRowActions) {
        sum = sum + DEFAULTS.actionCellWidth;
      }
      return [arr, sum];
    };
    drawHeaderRow = async (data, columnWidths, isFill, totalWidth) => {
      const headerRow = figma.createComponent();
      _initRow(headerRow, data, "Header Row");
      if (data.hasBatchActions) {
        const comp = await figma.importComponentByKeyAsync(HEADER["Checkbox"].key);
        const header = comp.createInstance();
        header.resize(
          header.width,
          data.hasDoubleLineHeader ? DEFAULTS.doubleLineHeaderHeight : DEFAULTS.singleLineHeaderHeight
        );
        headerRow.appendChild(header);
      }
      let index = 0;
      try {
        for (var iter = __forAwait(data.columns), more, temp, error; more = !(temp = await iter.next()).done; more = false) {
          const column = temp.value;
          const comp = await figma.importComponentByKeyAsync(
            HEADER[CELLS[column["type"]].alignment].key
          );
          const header = comp.createInstance();
          header.setProperties({
            "Label#69072:33": column.name.replaceAll("|", "\n")
          });
          header.resize(
            columnWidths[index],
            data.hasDoubleLineHeader ? DEFAULTS.doubleLineHeaderHeight : DEFAULTS.singleLineHeaderHeight
          );
          headerRow.appendChild(header);
          index++;
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && await temp.call(iter);
        } finally {
          if (error)
            throw error[0];
        }
      }
      headerRow.resize(
        totalWidth,
        data.hasDoubleLineHeader ? DEFAULTS.doubleLineHeaderHeight : DEFAULTS.singleLineHeaderHeight
      );
      if (isFill) {
        headerRow.children[data.hasBatchActions ? 1 : 0].layoutSizingHorizontal = "FILL";
      }
      if (data.hasRowActions) {
        const comp = await figma.importComponentByKeyAsync(
          HEADER["RightAligned"].key
        );
        const header = comp.createInstance();
        header.resize(
          DEFAULTS.actionCellWidth,
          data.hasDoubleLineHeader ? DEFAULTS.doubleLineHeaderHeight : DEFAULTS.singleLineHeaderHeight
        );
        header.setProperties({
          "Label#69072:33": ""
        });
        headerRow.appendChild(header);
      }
      return headerRow;
    };
    drawTableRow = async (data, columnWidths, isFill, totalWidth) => {
      const tableRow = figma.createComponent();
      _initRow(tableRow, data, "Table Row");
      const calculateMaxHeight = (data2) => {
        let maxHeight = 0;
        for (const column of data2.columns) {
          if (CELLS[column["type"]].maxHeight > maxHeight) {
            maxHeight = CELLS[column["type"]].maxHeight;
          }
        }
        return maxHeight;
      };
      const rowHeight = calculateMaxHeight(data);
      if (data.hasBatchActions) {
        const comp = await figma.importComponentByKeyAsync(MISC.Checkbox.key);
        const cell = comp.createInstance();
        cell.resize(cell.width, rowHeight);
        tableRow.appendChild(cell);
      }
      let index = 0;
      try {
        for (var iter = __forAwait(data.columns), more, temp, error; more = !(temp = await iter.next()).done; more = false) {
          const column = temp.value;
          const comp = await figma.importComponentByKeyAsync(
            CELLS[column["type"]].key
          );
          const cell = comp.createInstance();
          cell.resize(columnWidths[index], rowHeight);
          tableRow.appendChild(cell);
          index++;
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && await temp.call(iter);
        } finally {
          if (error)
            throw error[0];
        }
      }
      tableRow.resize(totalWidth, rowHeight);
      if (isFill) {
        tableRow.children[data.hasBatchActions ? 1 : 0].layoutSizingHorizontal = "FILL";
      }
      if (data.hasRowActions) {
        const comp = await figma.importComponentByKeyAsync(MISC.ActionCell.key);
        const cell = comp.createInstance();
        cell.resize(cell.width, rowHeight);
        tableRow.appendChild(cell);
      }
      return tableRow;
    };
    drawTableTemplate = async (data, headerRow, tableRow, totalWidth) => {
      const table = figma.createFrame();
      table.layoutMode = "VERTICAL";
      table.layoutSizingHorizontal = "HUG";
      table.layoutSizingVertical = "HUG";
      table.name = `Table`;
      const strokeStyle = await figma.importStyleByKeyAsync(STYLE.BoxBorder.key);
      const fillStyle = await figma.importStyleByKeyAsync(STYLE.BoxFill.key);
      table.strokeStyleId = strokeStyle.id;
      table.fillStyleId = fillStyle.id;
      table.cornerRadius = DEFAULTS.cornerRadius;
      const overhead = await figma.importComponentByKeyAsync(MISC.Overhead.key);
      const overheadInstance = overhead.createInstance();
      table.appendChild(overheadInstance);
      overheadInstance.layoutSizingHorizontal = "FILL";
      const headerRowInstance = headerRow.createInstance();
      table.appendChild(headerRowInstance);
      headerRowInstance.layoutSizingHorizontal = "FILL";
      const tableBody = figma.createFrame();
      tableBody.layoutMode = "VERTICAL";
      tableBody.layoutSizingHorizontal = "HUG";
      tableBody.layoutSizingVertical = "HUG";
      tableBody.name = "Body";
      for (let i = 0; i < DEFAULTS.rowNumber; i++) {
        const tableRowInstance = tableRow.createInstance();
        tableBody.appendChild(tableRowInstance);
        tableRowInstance.layoutSizingHorizontal = "FILL";
      }
      table.appendChild(tableBody);
      tableBody.layoutSizingHorizontal = "FILL";
      const tableTemplate = figma.createComponent();
      tableTemplate.layoutMode = "VERTICAL";
      tableTemplate.layoutSizingHorizontal = "FIXED";
      tableTemplate.resize(totalWidth, 100);
      tableTemplate.layoutSizingVertical = "HUG";
      tableTemplate.name = `${data.tableName} Table`;
      tableTemplate.itemSpacing = 8;
      const controls = await figma.importComponentByKeyAsync(MISC.Controls.key);
      const controlsInstance = controls.createInstance();
      tableTemplate.appendChild(controlsInstance);
      controlsInstance.layoutSizingHorizontal = "FILL";
      tableTemplate.appendChild(table);
      table.layoutSizingHorizontal = "FILL";
      return tableTemplate;
    };
    _initRow = (row, data, type) => {
      row.layoutMode = "HORIZONTAL";
      row.layoutSizingHorizontal = "FIXED";
      row.layoutSizingVertical = "HUG";
      row.name = `${data.tableName} ${type}`;
    };
  }
});

// <stdin>
var modules = { "src/main.jsx--default": (init_main(), __toCommonJS(main_exports))["default"] };
var commandId = true ? "src/main.jsx--default" : figma.command;
modules[commandId]();
