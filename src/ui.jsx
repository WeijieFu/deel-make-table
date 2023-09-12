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
  Link,
  Modal,
} from "@create-figma-plugin/ui"
import { emit } from "@create-figma-plugin/utilities"
import { h } from "preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import styles from "./styles.css"
import { _Column } from "./components/_Column"

function Plugin() {
  const [name, setName] = useState()
  const [hasBatchActions, setHasBatchActions] = useState(false)
  const [hasRowActions, setHasRowActions] = useState(false)
  const [hasDoubleLineHeader, setHasDoubleLineHeader] = useState(false)

  const [columns, setColumns] = useState([{ name: "", type: "Title" }])

  const handleBatchActionCheck = () => {
    setHasBatchActions(!hasBatchActions)
  }

  const handleRowActionCheck = () => {
    setHasRowActions(!hasRowActions)
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
        hasRowActions: hasRowActions,
        hasDoubleLineHeader: hasDoubleLineHeader,
        columns: columns,
      })
    }
  }
  // useEffect(() => {
  //   console.log(columns)
  // }, [columns])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleModalOpenClick = () => {
    setIsModalOpen(true)
  }
  const handleModalClose = () => {
    setIsModalOpen(false)
  }
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
            value={hasRowActions}
            onChange={handleRowActionCheck}
          >
            <Text>Has Row Actions</Text>
          </Checkbox>
        </Inline>
        <Inline space='large'>
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
          <Link
            align='center'
            fullWidth
            onClick={handleModalOpenClick}
          >
            How to use this plugin?
          </Link>
        </Stack>
      </Stack>
      <VerticalSpace space='medium' />

      <Modal
        open={isModalOpen}
        onOverlayClick={handleModalClose}
        onEscapeKeyDown={handleModalClose}
      >
        <div class={styles.modal}>
          <div>
            This plugin helps designers to scaffold basic structure of reusable
            Data Grid.
          </div>

          <div>
            <div>
              <strong>How to use this plugin</strong>
            </div>
            <p>
              1. Create an empty <strong>Section</strong> in Figma where you
              want to put the components .
            </p>
            <p>2. Enter the name of the table, e.g. "People".</p>
            <p>
              3. Check if your table has Batch Actions, Row Actions or Double
              Line Header.
            </p>
            <p>
              4. Add the column names and types. You can Add New, Delete or Move
              Up/Down columns. <br />
              <br />
              Use "|" for line break in Double Line Header, e.g. "Contract|Start
              Date"
            </p>
            <p>5. Select the Section, and click "Make This Table" button.</p>
            <p>6. It can take a few seconds to import the components.</p>
          </div>

          <div>
            <strong>Contact</strong>
            <p>
              If you have any feedback or suggestions, please contact @Weijie Fu
              on Slack.
            </p>
          </div>
        </div>
      </Modal>
    </Container>
  )
}

export default render(Plugin)
