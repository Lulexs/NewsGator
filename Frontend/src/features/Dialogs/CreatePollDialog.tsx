import { Group, Modal, Stack, TextInput, Button } from "@mantine/core";
import React from "react";

const CreatePollDialog = ({ opened, onClose, onCreate }: any) => {
  const [title, setTitle] = React.useState("");
  const [options, setOptions] = React.useState(["", ""]);

  const handleSubmit = () => {
    const newPoll = {
      question: title,
      options: options,
    };
    onCreate(newPoll);
    setTitle("");
    setOptions(["", ""]);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Create New Poll">
      <Stack>
        <TextInput
          label="Poll Question"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your question"
          required
        />

        {options.map((option, index) => (
          <TextInput
            key={index}
            label={`Option ${index + 1}`}
            value={option}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
            placeholder="Enter option text"
            required
          />
        ))}

        <Button
          bg="black"
          c="white"
          onClick={() => setOptions([...options, ""])}
          variant="outline"
        >
          Add Option
        </Button>

        <Group justify="flex-end">
          <Button bg="black" c="white" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button bg="black" c="white" onClick={handleSubmit}>
            Create Poll
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default CreatePollDialog;
