import { Modal, Button, TextInput, Stack, Group } from "@mantine/core";
import { useState } from "react";

interface CreateNewsDialogProps {
  opened: boolean;
  onClose: () => void;
  onCreate: (newsName: string) => void;
}

export default function CreateNewsDialog({
  opened,
  onClose,
  onCreate,
}: CreateNewsDialogProps) {
  const [newsName, setnewsName] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!newsName.trim()) {
      setError("News name cannot be empty");
      return;
    }
    onCreate(newsName.trim());
    setnewsName("");
    setError("");
    onClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setnewsName(event.currentTarget.value);
    if (error) setError("");
  };

  const handleClose = () => {
    setnewsName("");
    setError("");
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Create New News"
      size="sm"
    >
      <Stack gap="md">
        <TextInput
          label="News Name"
          placeholder="Enter news name"
          value={newsName}
          onChange={handleChange}
          error={error}
          data-autofocus
        />

        <Group mt="md">
          <Button onClick={handleCreate} disabled={!newsName.trim()}>
            Create news
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
