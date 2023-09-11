import { CELLS, HEADER } from "./data"
import { _initHeaderRow, PROPERTY, DEFAULTS } from "./main"

export const drawHeaderRow = (data, columnWidths) => {
  const headerRow = figma.createComponent()
  _initHeaderRow(headerRow, data)

  data.columns.map((column, index) => {
    figma
      .importComponentByKeyAsync(HEADER[CELLS[column["type"]].alignment].key)
      .then((comp) => {
        const header = comp.createInstance()

        header.setProperties(
          {}`${PROPERTY.headerLabel}`,
          column.name.replaceAll("|", "\n")
        )
      })
    header.resize(
      columnWidths[index],
      data.hasDoubleLineHeader
        ? DEFAULTS.doubleLineHeaderHeight
        : DEFAULTS.singleLineHeaderHeight
    )
    headerRow.appendChild(header)
  })
}
