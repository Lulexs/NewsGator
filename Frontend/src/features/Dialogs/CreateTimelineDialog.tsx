import { Modal, Button, TextInput, Stack, Group } from "@mantine/core";
import { useState } from "react";

interface CreateTimelineDialogProps {
  opened: boolean;
  onClose: () => void;
  onCreate: (timelineName: string) => void;
}

export default function CreateTimelineDialog({
  opened,
  onClose,
  onCreate,
}: CreateTimelineDialogProps) {
  const [timelineName, setTimelineName] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!timelineName.trim()) {
      setError("timeline name cannot be empty");
      return;
    }
    onCreate(timelineName.trim());
    setTimelineName("");
    setError("");
    onClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimelineName(event.currentTarget.value);
    if (error) setError("");
  };

  const handleClose = () => {
    setTimelineName("");
    setError("");
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Create New timeline"
      size="sm"
    >
      <Stack gap="md">
        <TextInput
          label="Timeline Name"
          placeholder="Enter timeline name"
          value={timelineName}
          onChange={handleChange}
          error={error}
          data-autofocus
        />

        <Group mt="md">
          <Button onClick={handleCreate} disabled={!timelineName.trim()}>
            Create timeline
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
