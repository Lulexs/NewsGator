import { Modal, Button, Stack, Group } from "@mantine/core";
import { useState } from "react";
import { TimelineNews } from "../../app/models/Timelines";
import agent from "../../app/api/agent";
import AsyncAutocomplete1 from "../Util/AsyncAutocomplete1";

interface AddNewsToTimelineDialogProps {
  opened: boolean;
  onClose: () => void;
  onAddNews: (news: TimelineNews) => void;
}

export default function AddNewsToTimelineDialog({
  opened,
  onClose,
  onAddNews,
}: AddNewsToTimelineDialogProps) {
  const [selectedNews, setSelectedNews] = useState<TimelineNews | null>(null);
  const [error, setError] = useState("");

  const handleAddNews = async () => {
    if (!selectedNews) {
      setError("Please select a news item");
      return;
    }
    try {
      const fullNewsDetails = await agent.NewsAgent.getSingleNews(
        selectedNews.id
      );
      onAddNews(fullNewsDetails);
      handleClose();
    } catch (err) {
      setError("Failed to fetch news details");
    }
  };

  const handleClose = () => {
    setSelectedNews(null);
    setError("");
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Add News to Timeline"
      size="lg"
    >
      <Stack gap="md">
        <AsyncAutocomplete1
          placeholder="Search and select news"
          onSelect={(selectedItem) => {
            setSelectedNews(selectedItem);
            if (error) setError("");
          }}
        />

        {error && <div style={{ color: "red" }}>{error}</div>}

        <Group mt="md" justify="flex-end">
          <Button onClick={handleAddNews} disabled={!selectedNews}>
            Add News
          </Button>
          <Button variant="subtle" onClick={handleClose}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
