import { useState } from "react";
import {
  TextInput,
  Stack,
  Group,
  Button,
  Badge,
  Textarea,
  Modal,
  Box,
  LoadingOverlay,
} from "@mantine/core";
import { NewspaperNews } from "../../app/models/News";
import agent from "../../app/api/agent";

interface NewspaperNewsDialogProps {
  opened: boolean;
  onClose: () => void;
  onAdd: (news: NewspaperNews) => void;
}

export default function NewspaperNewsDialog({
  opened,
  onClose,
  onAdd,
}: NewspaperNewsDialogProps) {
  const [formData, setFormData] = useState<NewspaperNews>({
    newspaper: "",
    content: "",
    tags: [],
    category: "",
    url: "",
    author: "",
    date: new Date(),
  });
  const [currentTag, setCurrentTag] = useState("");
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);

  const handleSubmit = async () => {
    setOverlayVisible(true);
    formData.content = await agent.NewsAgent.getNewsFromUrl(formData.url);
    setOverlayVisible(false);

    onAdd(formData);
    setFormData({
      newspaper: "",
      content: "",
      tags: [],
      url: "",
      category: "",
      author: "",
      date: new Date(),
    });
    onClose();
  };

  const addTag = () => {
    if (currentTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add Newspaper News"
      size="lg"
    >
      <Box pos="relative">
        <LoadingOverlay
          visible={overlayVisible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Stack gap="md">
          <TextInput
            label="Newspaper"
            value={formData.newspaper}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, newspaper: e.target.value }))
            }
          />
          <TextInput
            label="Author"
            value={formData.author || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, author: e.target.value }))
            }
          />
          <TextInput
            label="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
          />
          <Textarea
            label="Url"
            value={formData.url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, url: e.target.value }))
            }
            minRows={3}
          />
          <div>
            <Group mb="sm">
              <TextInput
                placeholder="Add tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button c="white" bg="black" onClick={addTag}>
                Add Tag
              </Button>
            </Group>
            <Group gap="xs">
              {formData.tags.map((tag, index) => (
                <Badge
                  key={index}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      tags: prev.tags.filter((_, i) => i !== index),
                    }))
                  }
                  style={{ cursor: "pointer" }}
                >
                  {tag}
                </Badge>
              ))}
            </Group>
          </div>
          <Group mt="md">
            <Button c="white" bg="black" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button c="white" bg="black" onClick={handleSubmit}>
              Add News
            </Button>
          </Group>
        </Stack>
      </Box>
    </Modal>
  );
}
