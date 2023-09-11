import {
  Button,
  Checkbox,
  Container,
  Muted,
  render,
  Text,
  Textbox,
  Stack,
  VerticalSpace,
  Inline,
} from "@create-figma-plugin/ui"
import { emit } from "@create-figma-plugin/utilities"
import { h } from "preact"
import { useCallback, useEffect, useState } from "preact/hooks"

import { _Column } from "./components/_Column"

function Plugin() {
  const [name, setName] = useState()
  const [hasBatchActions, setHasBatchActions] = useState(false)
  const [hasDoubleLineHeader, setHasDoubleLineHeader] = useState(false)

  const [columns, setColumns] = useState([{ name: "", type: "Title" }])

  const handleBatchActionCheck = () => {
    setHasBatchActions(!hasBatchActions)
  }
  const handleDoubleLineHeaderCheck = () => {
    setHasDoubleLineHeader(!hasDoubleLineHeader)
  }
  const handleNameInput = (e) => {
    setName(e.currentTarget.value)
  }

  const handleAddNewColumn = () => {
    setColumns([...columns, { name: "", type: "Text" }])
  }
  const handleGenerate = () => {
    if (columns.length > 0) {
      emit("GENERATE", {
        tableName: name,
        hasBatchActions: hasBatchActions,
        hasDoubleLineHeader: hasDoubleLineHeader,
        columns: columns,
      })
    }
  }
  // useEffect(() => {
  //   console.log(columns)
  // }, [columns])
  return (
    <Container space='medium'>
      <VerticalSpace space='medium' />
      <Stack space='medium'>
        <Textbox
          variant='border'
          placeholder='name of the table'
          onInput={handleNameInput}
        />
        <Inline space='large'>
          <Checkbox
            value={hasBatchActions}
            onChange={handleBatchActionCheck}
          >
            <Text>Has Batch Actions</Text>
          </Checkbox>
          <Checkbox
            value={hasDoubleLineHeader}
            onChange={handleDoubleLineHeaderCheck}
          >
            <Text>Double Line Header</Text>
          </Checkbox>
        </Inline>

        {columns.map((column, index) => {
          return (
            <_Column
              column={column}
              index={index}
              key={index}
              columns={columns}
              setColumns={setColumns}
            />
          )
        })}

        <Stack space='extraSmall'>
          <Button
            secondary
            fullWidth
            onClick={handleAddNewColumn}
          >
            Add New Column
          </Button>
          <Button
            fullWidth
            onClick={handleGenerate}
          >
            Make This Table
          </Button>
        </Stack>
      </Stack>
      <VerticalSpace space='medium' />
    </Container>
  )
}

export default render(Plugin)
