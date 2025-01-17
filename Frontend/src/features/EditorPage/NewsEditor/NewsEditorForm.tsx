import {
  Badge,
  Button,
  CloseButton,
  Group,
  Paper,
  Stack,
  Textarea,
  TextInput,
  Text,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { News, NewspaperNews } from "../../../app/models/News";
import CreateCommunityNoteDialog from "../../Dialogs/CreateCommunityNoteDialog";
import NewspaperNewsDialog from "../../Dialogs/NewspaperNewsDialog";

interface NewsEditorFormProps {
  news: News | null;
  onUpdate: (imageSrc: string) => void;
}
export function NewsEditorForm({ news, onUpdate }: NewsEditorFormProps) {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [communityNoteDialogOpened, setCommunityNoteDialogOpened] =
    useState(false);
  const [editedNews, setEditedNews] = useState<News | null>(news);

  useEffect(() => {
    setEditedNews(news);
  }, [news]);

  const handleNewspaperNewsAdd = (newspaperNews: NewspaperNews) => {
    if (editedNews) {
      const updatedNews = {
        ...editedNews,
        newspaperNews: [...(editedNews.newspaperNews || []), newspaperNews],
      };
      setEditedNews(updatedNews);
      onUpdate(newspaperNews.content);
    }
  };

  const handleAddCommunityNote = (text: string) => {
    if (editedNews) {
      const updatedNews = {
        ...editedNews,
        communityNotes: {
          text,
          upvotes: 0,
          downvotes: 0,
        },
      };
      setEditedNews(updatedNews);
    }
  };

  if (!editedNews) {
    return <Text>Select a news item to edit</Text>;
  }

  return (
    <Stack p="md" w="100%">
      <TextInput
        label="Title"
        value={editedNews.title}
        onChange={(e) =>
          setEditedNews((prev) =>
            prev ? { ...prev, title: e.target.value } : null
          )
        }
      />
      <TextInput
        label="Location"
        value={editedNews.location || ""}
        onChange={(e) =>
          setEditedNews((prev) =>
            prev ? { ...prev, location: e.target.value } : null
          )
        }
      />

      {editedNews.communityNotes ? (
        <Paper p="md" withBorder>
          <Group gap="apart" mb="sm">
            <Text fw={500}>Community Notes</Text>
            <CloseButton
              onClick={() =>
                setEditedNews((prev) =>
                  prev ? { ...prev, communityNotes: undefined } : null
                )
              }
            />
          </Group>
          <Textarea
            value={editedNews.communityNotes.text}
            onChange={(e) =>
              setEditedNews((prev) =>
                prev
                  ? {
                      ...prev,
                      communityNotes: {
                        ...prev.communityNotes!,
                        text: e.target.value,
                      },
                    }
                  : null
              )
            }
          />
          <Group mt="sm">
            <Text size="sm">Upvotes: {editedNews.communityNotes.upvotes}</Text>
            <Text size="sm">
              Downvotes: {editedNews.communityNotes.downvotes}
            </Text>
          </Group>
        </Paper>
      ) : (
        <Button
          variant="outline"
          onClick={() => setCommunityNoteDialogOpened(true)}
          leftSection={<IconPlus size={16} />}
        >
          Add Community Note
        </Button>
      )}

      <Stack>
        <Group>
          <Text fw={500}>Newspaper News</Text>
          <Button onClick={() => setDialogOpened(true)}>Add News Source</Button>
        </Group>
        <Stack gap="md">
          {editedNews.newspaperNews?.map((news, index) => (
            <Paper key={index} p="md" withBorder>
              <Group mb="xs">
                <Text fw={500}>{news.newspaper}</Text>
                <CloseButton
                  onClick={() =>
                    setEditedNews((prev) =>
                      prev
                        ? {
                            ...prev,
                            newspaperNews: prev.newspaperNews?.filter(
                              (_, i) => i !== index
                            ),
                          }
                        : null
                    )
                  }
                />
              </Group>
              <Text size="sm" c="dimmed" mb="xs">
                {news.author} • {news.category}
              </Text>
              <Text mb="sm">{news.content}</Text>
              <Group gap="xs">
                {news.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex}>{tag}</Badge>
                ))}
              </Group>
            </Paper>
          ))}
        </Stack>
      </Stack>
      <NewspaperNewsDialog
        opened={dialogOpened}
        onClose={() => setDialogOpened(false)}
        onAdd={handleNewspaperNewsAdd}
      />
      <CreateCommunityNoteDialog
        opened={communityNoteDialogOpened}
        onClose={() => setCommunityNoteDialogOpened(false)}
        onAdd={handleAddCommunityNote}
      />
    </Stack>
  );
}
