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
import { useState } from "react";
import CreateCommunityNoteDialog from "../../Dialogs/CreateCommunityNoteDialog";
import NewspaperNewsDialog from "../../Dialogs/NewspaperNewsDialog";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import agent from "../../../app/api/agent";
import { notifications } from "@mantine/notifications";

export default observer(function NewsEditorForm() {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [communityNoteDialogOpened, setCommunityNoteDialogOpened] =
    useState(false);

  const { newsEditorFormStateStore } = useStore();
  const editedNews = newsEditorFormStateStore.editedNews;

  if (!editedNews) {
    return <Text>Select a news item to edit</Text>;
  }

  return (
    <Stack p="md" w="100%">
      <TextInput
        label="Title"
        value={editedNews.title}
        onChange={(e) => newsEditorFormStateStore.changeTitle(e.target.value)}
      />
      <TextInput
        label="Location"
        value={editedNews.location || ""}
        onChange={(e) =>
          newsEditorFormStateStore.changeLocation(e.target.value)
        }
      />
      <TextInput
        label="Thumbnail"
        value={editedNews.thumbnail || ""}
        onChange={(e) =>
          newsEditorFormStateStore.changeThumbnail(e.target.value)
        }
      />

      {editedNews.communityNote ? (
        <Paper p="md" withBorder>
          <Group gap="apart" mb="sm">
            <Text fw={500}>Community Notes</Text>
            <CloseButton
              onClick={() => newsEditorFormStateStore.clearCommunityNote()}
            />
          </Group>
          <Textarea
            value={editedNews.communityNote.text}
            onChange={(e) =>
              newsEditorFormStateStore.changeCommunityNote(e.target.value)
            }
          />
          <Group mt="sm">
            <Text size="sm">Upvotes: {editedNews.communityNote.upvotes}</Text>
            <Text size="sm">
              Downvotes: {editedNews.communityNote.downvotes}
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
                    newsEditorFormStateStore.removeNewsSource(index)
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
        <Group style={{ alignSelf: "center", justifySelf: "flex-end" }}>
          <Button
            onClick={async () => {
              const { id, createdAt, ...news } = editedNews;
              console.log(id, news);
              try {
                if (id === "undefined") {
                  await agent.NewsAgent.newNews(news);
                  notifications.show({
                    title: "Success",
                    message: "News successfully saved",
                    color: "green",
                  });
                } else {
                  await agent.NewsAgent.updateNews(id, news);
                  notifications.show({
                    title: "Success",
                    message: "News successfully updated",
                    color: "green",
                  });
                }
              } catch (error) {
                console.error(error);
              }
            }}
          >
            Save news
          </Button>
        </Group>
      </Stack>
      <NewspaperNewsDialog
        opened={dialogOpened}
        onClose={() => setDialogOpened(false)}
        onAdd={newsEditorFormStateStore.handleNewspaperNewsAdd}
      />
      <CreateCommunityNoteDialog
        opened={communityNoteDialogOpened}
        onClose={() => setCommunityNoteDialogOpened(false)}
        onAdd={newsEditorFormStateStore.handleAddCommunityNote}
      />
    </Stack>
  );
});
