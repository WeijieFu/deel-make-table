import { once, on, showUI } from "@create-figma-plugin/utilities"
import { CELLS, EMPTY, HEADER, MISC, STYLE } from "./data"

const DEFAULTS = {
  tableWidth: 1312,
  characterWidth: 6.5,
  sortingButtonWidth: 16,
  optionsButtonWidth: 16,
  horizontalPadding: 16,
  gap: 4,
  singleLineHeaderHeight: 40,
  doubleLineHeaderHeight: 48,
  sectionOrigin: 32,
  sectionGap: 32,
  sectionHeight: 2200,
  rowNumber: 10,
  cornerRadius: 16,
  checkboxCellWidth: 56,
  actionCellWidth: 202,
}

const PROPERTY = {
  headerLabel: "Label#69072:33",
}

export default function () {
  on("GENERATE", drawTable)

  showUI({
    height: 600,
    width: 360,
  })
}

const drawTable = async (data) => {
  if (
    figma.currentPage.selection.length === 0 ||
    figma.currentPage.selection[0].type !== "SECTION"
  ) {
    figma.notify("Please select a Section first")
  } else {
    const sectionContainer = figma.currentPage.selection[0]
    const [columnWidths, totalWidth] = calculateColumnWidths(data)
    // console.log(`total width:  ${totalWidth}`)
    const isTitleFill = totalWidth < DEFAULTS.tableWidth
    const finalTableWidth = isTitleFill ? DEFAULTS.tableWidth : totalWidth
    const headerRow = await drawHeaderRow(
      data,
      columnWidths,
      isTitleFill,
      finalTableWidth
    )
    const tableRow = await drawTableRow(
      data,
      columnWidths,
      isTitleFill,
      finalTableWidth
    )
    const table = await drawTableTemplate(
      data,
      headerRow,
      tableRow,
      finalTableWidth
    )

    const noContent = await drawNoContentState(finalTableWidth)

    const noResult = await drawNoResultState(headerRow, finalTableWidth)

    formatSection(
      data,
      sectionContainer,
      headerRow,
      tableRow,
      table,
      noContent,
      noResult,
      finalTableWidth
    )
  }
}

const formatSection = async (
  data,
  sectionContainer,
  headerRow,
  tableRow,
  table,
  noContent,
  noResult,
  totalWidth
) => {
  const textVariable = await figma.variables.importVariableByKeyAsync(
    STYLE.TextTitle.key
  )
  const pageVariable = await figma.variables.importVariableByKeyAsync(
    STYLE.PageDefault.key
  )

  const sectionFill = [...sectionContainer.fills]
  sectionFill[0] = figma.variables.setBoundVariableForPaint(
    sectionFill[0],
    "color",
    pageVariable
  )

  const titleFill = [...sectionContainer.fills]
  titleFill[0] = figma.variables.setBoundVariableForPaint(
    titleFill[0],
    "color",
    textVariable
  )

  sectionContainer.name = `${data.tableName} Table Local Components`
  sectionContainer.appendChild(headerRow)
  sectionContainer.appendChild(tableRow)
  sectionContainer.appendChild(table)
  sectionContainer.appendChild(noContent)
  sectionContainer.appendChild(noResult)
  sectionContainer.fills = sectionFill

  sectionContainer.resizeWithoutConstraints(
    DEFAULTS.sectionOrigin * 2 + totalWidth + 48,
    DEFAULTS.sectionHeight
  )

  const line1 = figma.createText()
  await figma.loadFontAsync(line1.fontName)
  sectionContainer.appendChild(line1)

  line1.characters = "Edit master row here"
  line1.fontSize = 32
  line1.x = DEFAULTS.sectionOrigin
  line1.y = DEFAULTS.sectionOrigin
  line1.fills = titleFill

  const line2 = figma.createText()
  sectionContainer.appendChild(line2)

  line2.characters = "Reuse composed table component in your design"
  line2.fontSize = 32
  line2.x = DEFAULTS.sectionOrigin
  line2.y =
    DEFAULTS.sectionOrigin +
    DEFAULTS.doubleLineHeaderHeight * 2 +
    DEFAULTS.sectionGap * 6

  line2.fills = titleFill
  headerRow.x = DEFAULTS.sectionOrigin
  headerRow.y = DEFAULTS.sectionOrigin * 3

  tableRow.x = DEFAULTS.sectionOrigin
  tableRow.y =
    DEFAULTS.sectionOrigin * 3 +
    DEFAULTS.doubleLineHeaderHeight +
    DEFAULTS.sectionGap

  //Combines variants
  const tableSet = figma.combineAsVariants(
    [table, noContent, noResult],
    sectionContainer
  )
  tableSet.name = `${data.tableName} Table`
  tableSet.layoutMode = "VERTICAL"
  tableSet.itemSpacing = 24
  tableSet.layoutSizingHorizontal = "HUG"
  tableSet.layoutSizingVertical = "HUG"
  tableSet.verticalPadding = 24
  tableSet.horizontalPadding = 24

  tableSet.x = DEFAULTS.sectionOrigin
  tableSet.y =
    DEFAULTS.sectionOrigin +
    DEFAULTS.doubleLineHeaderHeight * 2 +
    DEFAULTS.sectionGap * 8
}

const calculateColumnWidths = (data) => {
  let sum = 0
  const calculateTitleWidth = (column) => {
    if (column.name.includes("|")) {
      const words = column.name.split("|")
      let maxWidth = 0
      for (const word of words) {
        if (word.length > maxWidth) {
          maxWidth = word.length
        }
      }
      return maxWidth * DEFAULTS.characterWidth
    } else {
      return column.name.length * DEFAULTS.characterWidth
    }
  }

  const arr = data.columns.map((column, index) => {
    const titleWidth = calculateTitleWidth(column)
    const columnWidth =
      DEFAULTS.horizontalPadding +
      titleWidth +
      DEFAULTS.gap +
      DEFAULTS.sortingButtonWidth +
      DEFAULTS.gap +
      DEFAULTS.optionsButtonWidth +
      DEFAULTS.horizontalPadding

    if (columnWidth > CELLS[column.type].minWidth) {
      sum = sum + Math.ceil(columnWidth / 8) * 8
      return Math.ceil(columnWidth / 8) * 8
    } else {
      sum = sum + CELLS[column.type].minWidth
      return CELLS[column.type].minWidth
    }
  })

  if (data.hasBatchActions) {
    sum = sum + DEFAULTS.checkboxCellWidth
  }

  if (data.hasRowActions) {
    sum = sum + DEFAULTS.actionCellWidth
  }

  return [arr, sum]
}

const drawHeaderRow = async (data, columnWidths, isFill, totalWidth) => {
  const headerRow = figma.createComponent()
  _initRow(headerRow, data, "Header Row")

  if (data.hasBatchActions) {
    const comp = await figma.importComponentByKeyAsync(HEADER["Checkbox"].key)
    const header = comp.createInstance()

    header.resize(
      header.width,
      data.hasDoubleLineHeader
        ? DEFAULTS.doubleLineHeaderHeight
        : DEFAULTS.singleLineHeaderHeight
    )

    headerRow.appendChild(header)
  }

  let index = 0
  for await (const column of data.columns) {
    const comp = await figma.importComponentByKeyAsync(
      HEADER[CELLS[column["type"]].alignment].key
    )
    const header = comp.createInstance()
    header.setProperties({
      "Label#69072:33": column.name.replaceAll("|", "\n"),
    })

    header.resize(
      columnWidths[index],
      data.hasDoubleLineHeader
        ? DEFAULTS.doubleLineHeaderHeight
        : DEFAULTS.singleLineHeaderHeight
    )

    headerRow.appendChild(header)
    index++
  }

  headerRow.resize(
    totalWidth,
    data.hasDoubleLineHeader
      ? DEFAULTS.doubleLineHeaderHeight
      : DEFAULTS.singleLineHeaderHeight
  )

  if (isFill) {
    headerRow.children[data.hasBatchActions ? 1 : 0].layoutSizingHorizontal =
      "FILL"
  }

  if (data.hasRowActions) {
    const comp = await figma.importComponentByKeyAsync(
      HEADER["RightAligned"].key
    )
    const header = comp.createInstance()

    header.resize(
      DEFAULTS.actionCellWidth,
      data.hasDoubleLineHeader
        ? DEFAULTS.doubleLineHeaderHeight
        : DEFAULTS.singleLineHeaderHeight
    )
    header.setProperties({
      "Label#69072:33": "",
    })

    headerRow.appendChild(header)
  }

  return headerRow
}

const drawTableRow = async (data, columnWidths, isFill, totalWidth) => {
  const tableRow = figma.createComponent()
  _initRow(tableRow, data, "Table Row")

  const calculateMaxHeight = (data) => {
    let maxHeight = 0
    for (const column of data.columns) {
      if (CELLS[column["type"]].maxHeight > maxHeight) {
        maxHeight = CELLS[column["type"]].maxHeight
      }
    }

    return maxHeight
  }

  const rowHeight = calculateMaxHeight(data)

  if (data.hasBatchActions) {
    const comp = await figma.importComponentByKeyAsync(MISC.Checkbox.key)
    const cell = comp.createInstance()

    cell.resize(cell.width, rowHeight)

    tableRow.appendChild(cell)
  }

  let index = 0
  for await (const column of data.columns) {
    const comp = await figma.importComponentByKeyAsync(
      CELLS[column["type"]].key
    )
    const cell = comp.createInstance()

    cell.resize(columnWidths[index], rowHeight)

    tableRow.appendChild(cell)
    index++
  }

  tableRow.resize(totalWidth, rowHeight)

  if (isFill) {
    tableRow.children[data.hasBatchActions ? 1 : 0].layoutSizingHorizontal =
      "FILL"
  }

  if (data.hasRowActions) {
    const comp = await figma.importComponentByKeyAsync(MISC.ActionCell.key)
    const cell = comp.createInstance()

    cell.resize(cell.width, rowHeight)

    tableRow.appendChild(cell)
  }

  return tableRow
}

const drawTableTemplate = async (data, headerRow, tableRow, totalWidth) => {
  const table = figma.createFrame()
  table.layoutMode = "VERTICAL"
  table.layoutSizingHorizontal = "HUG"
  table.layoutSizingVertical = "HUG"
  table.name = `Table`

  // const strokeStyle = await figma.importStyleByKeyAsync(STYLE.BoxBorder.key)
  // const fillStyle = await figma.importStyleByKeyAsync(STYLE.BoxFill.key)

  // table.strokeStyleId = strokeStyle.id
  // table.fillStyleId = fillStyle.id

  const strokeVariable = await figma.variables.importVariableByKeyAsync(
    STYLE.BoxBorder.key
  )
  const fillVariable = await figma.variables.importVariableByKeyAsync(
    STYLE.BoxFill.key
  )

  const strokesArr = [...table.fills]
  const fillsArr = [...table.fills]

  strokesArr[0] = figma.variables.setBoundVariableForPaint(
    strokesArr[0],
    "color",
    strokeVariable
  )

  fillsArr[0] = figma.variables.setBoundVariableForPaint(
    fillsArr[0],
    "color",
    fillVariable
  )

  table.strokes = strokesArr
  table.fills = fillsArr

  table.cornerRadius = DEFAULTS.cornerRadius

  const overhead = await figma.importComponentByKeyAsync(MISC.Overhead.key)
  const overheadInstance = overhead.createInstance()

  table.appendChild(overheadInstance)
  overheadInstance.layoutSizingHorizontal = "FILL"

  const headerRowInstance = headerRow.createInstance()
  table.appendChild(headerRowInstance)
  headerRowInstance.layoutSizingHorizontal = "FILL"

  const tableBody = figma.createFrame()

  tableBody.layoutMode = "VERTICAL"
  tableBody.layoutSizingHorizontal = "HUG"
  tableBody.layoutSizingVertical = "HUG"
  tableBody.name = "Body"

  tableBody.fills = fillsArr

  for (let i = 0; i < DEFAULTS.rowNumber; i++) {
    const tableRowInstance = tableRow.createInstance()
    tableBody.appendChild(tableRowInstance)
    tableRowInstance.layoutSizingHorizontal = "FILL"
  }

  table.appendChild(tableBody)
  tableBody.layoutSizingHorizontal = "FILL"

  //add controls

  const tableTemplate = figma.createComponent()
  tableTemplate.layoutMode = "VERTICAL"
  tableTemplate.layoutSizingHorizontal = "FIXED"
  tableTemplate.resize(totalWidth, 100)
  tableTemplate.layoutSizingVertical = "HUG"
  // tableTemplate.name = `${data.tableName} Table`
  tableTemplate.name = "State = Initial"
  tableTemplate.itemSpacing = 8

  const controls = await figma.importComponentByKeyAsync(MISC.Controls.key)
  const controlsInstance = controls.createInstance()

  tableTemplate.appendChild(controlsInstance)
  controlsInstance.layoutSizingHorizontal = "FILL"

  tableTemplate.appendChild(table)
  table.layoutSizingHorizontal = "FILL"

  return tableTemplate
}

const drawNoContentState = async (totalWidth) => {
  const noContentState = figma.createComponent()
  noContentState.layoutMode = "VERTICAL"
  noContentState.layoutSizingHorizontal = "FIXED"
  noContentState.resize(totalWidth, 100)
  noContentState.layoutSizingVertical = "HUG"
  noContentState.name = "State = No Content"
  noContentState.itemSpacing = 0

  const noContentComponent = await figma.importComponentByKeyAsync(
    EMPTY.NoContent.key
  )
  const noContentInstance = noContentComponent.createInstance()

  noContentState.appendChild(noContentInstance)
  noContentInstance.layoutSizingHorizontal = "FILL"

  return noContentState
}

const drawNoResultState = async (headerRow, totalWidth) => {
  const noResultState = figma.createComponent()
  noResultState.layoutMode = "VERTICAL"
  noResultState.layoutSizingHorizontal = "FIXED"
  noResultState.resize(totalWidth, 100)
  noResultState.layoutSizingVertical = "HUG"
  noResultState.name = "State = No Result"
  noResultState.itemSpacing = 8

  const controls = await figma.importComponentByKeyAsync(MISC.Controls.key)
  const controlsInstance = controls.createInstance()

  const searchField = controlsInstance.findOne((node) => {
    return node.name == "_Search Field / Round"
  })

  searchField.setProperties({ Filled: "True" })

  noResultState.appendChild(controlsInstance)
  controlsInstance.layoutSizingHorizontal = "FILL"

  const noResultComponent = await figma.importComponentByKeyAsync(
    EMPTY.NoResult.key
  )
  const noResultInstance = noResultComponent.createInstance()

  const oldHeaderRow = noResultInstance.findOne((node) => {
    return node.name == "Data Grid Header Row [Template] / Desktop"
  })
  oldHeaderRow.layoutSizingHorizontal = "FILL"
  oldHeaderRow.swapComponent(headerRow)

  noResultState.appendChild(noResultInstance)
  noResultInstance.layoutSizingHorizontal = "FILL"

  return noResultState
}

//UTILS
const _initRow = (row, data, type) => {
  row.layoutMode = "HORIZONTAL"
  row.layoutSizingHorizontal = "FIXED"
  row.layoutSizingVertical = "HUG"
  row.name = `${data.tableName} ${type}`
}
