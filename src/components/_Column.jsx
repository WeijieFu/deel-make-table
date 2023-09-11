import {
  Button,
  Checkbox,
  Columns,
  Container,
  Dropdown,
  Muted,
  render,
  Text,
  Textbox,
  VerticalSpace,
  IconButton,
  IconTrash32,
  IconChevronUp16,
  IconChevronDown16,
} from "@create-figma-plugin/ui"
import { h } from "preact"
import { useCallback, useState } from "preact/hooks"

import styles from "../styles.css"

import { CELLS } from "../data"

export const _Column = ({ column, index, columns, setColumns }) => {
  const cellTypeOptions = []

  for (const key in CELLS) {
    cellTypeOptions.push({ value: CELLS[key].name })
  }

  const handleColumnTypeSelect = (e) => {
    const arr = columns.map((c, i) => {
      if (i === index) {
        return { name: c.name, type: e.currentTarget.value }
      } else {
        return c
      }
    })
    setColumns(arr)
  }
  const handleTextInput = (e) => {
    const arr = columns.map((c, i) => {
      if (i === index) {
        return { name: e.currentTarget.value, type: c.type }
      } else {
        return c
      }
    })
    setColumns(arr)
  }
  const handleDelete = () => {
    setColumns(
      columns.filter((c, i) => {
        return i !== index
      })
    )
  }
  const handleMoveUp = () => {
    if (index > 0) {
      const arr = columns.map((c, i) => {
        if (i === index - 1) {
          return columns[index]
        } else if (i === index) {
          return columns[index - 1]
        } else {
          return c
        }
      })
      setColumns(arr)
    }
  }
  const handleMoveDown = () => {
    if (index < columns.length - 1) {
      const arr = columns.map((c, i) => {
        if (i === index + 1) {
          return columns[index]
        } else if (i === index) {
          return columns[index + 1]
        } else {
          return c
        }
      })
      setColumns(arr)
    }
  }

  return (
    <div class={styles.columnWrapper}>
      <div class={styles.columnName}>
        <Textbox
          variant='border'
          placeholder="Col name, use '|' for line break"
          value={column.name}
          onInput={handleTextInput}
        />
      </div>
      <div className={styles.columnType}>
        <Dropdown
          options={cellTypeOptions}
          value={column.type}
          variant='border'
          onChange={handleColumnTypeSelect}
        />
      </div>

      <IconButton onClick={handleDelete}>
        <IconTrash32 />
      </IconButton>

      <div class={styles["arrowsWrapper"]}>
        <div
          class={styles["arrow"]}
          onClick={handleMoveUp}
        >
          <IconChevronUp16 />
        </div>
        <div
          class={styles["arrow"]}
          onClick={handleMoveDown}
        >
          <IconChevronDown16 />
        </div>
      </div>
    </div>
  )
}
