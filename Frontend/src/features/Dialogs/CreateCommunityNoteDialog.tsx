import { Modal, Stack, Textarea, Button, Group } from "@mantine/core";
import { useState } from "react";

interface CreateCommunityNoteDialogProps {
  opened: boolean;
  onClose: () => void;
  onAdd: (text: string) => void;
}

export default function CreateCommunityNoteDialog({
  opened,
  onClose,
  onAdd,
}: CreateCommunityNoteDialogProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd(text);
      setText("");
      onClose();
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add Community Note">
      <Stack>
        <Textarea
          label="Note Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          minRows={3}
          placeholder="Enter your community note..."
        />
        <Group>
          <Button c="white" bg="black" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            c="white"
            bg="black"
            onClick={handleSubmit}
            disabled={!text.trim()}
          >
            Add Note
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
