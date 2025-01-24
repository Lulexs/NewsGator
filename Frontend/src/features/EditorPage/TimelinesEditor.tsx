import React, { useState } from "react";
import { Flex, Stack, Title, Button, Group, Text, Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader, Plus, Trash2 } from "lucide-react";
import { Timeline, TimelineNews } from "../../app/models/Timelines";
import agent from "../../app/api/agent";
import { notifications } from "@mantine/notifications";
import CreateTimelineDialog from "../Dialogs/CreateTimelineDialog";
import AddNewsToTimelineDialog from "../Dialogs/AddNewsToTimelineDialog";

const TimelineOrderVisualizer: React.FC<{
  newsItems: TimelineNews[];
  onRemove: (newsId: string) => void;
  onMove: (newsId: string, direction: "up" | "down") => void;
}> = ({ newsItems, onRemove, onMove }) => {
  return (
    <Flex direction="column" gap="sm" w="100%" mt="md">
      {newsItems.map((news, index) => (
        <Flex
          key={news.id}
          align="center"
          p="xs"
          bg="gray.1"
          style={{
            borderLeft: `4px solid ${
              index === 0
                ? "green"
                : index === newsItems.length - 1
                ? "red"
                : "blue"
            }`,
          }}
        >
          <Image
            src={news.thumbnail ?? "Image_unavailable.png"}
            alt={news.title}
            w={50}
            h={40}
            mr="md"
          />
          <Text flex={1}>{news.title}</Text>
          <Group>
            <Button
              variant="subtle"
              size="xs"
              disabled={index === 0}
              onClick={() => onMove(news.id, "up")}
            >
              Up
            </Button>

            <Button
              variant="subtle"
              size="xs"
              disabled={index === newsItems.length - 1}
              onClick={() => onMove(news.id, "down")}
            >
              Down
            </Button>

            <Button
              variant="subtle"
              color="red"
              size="xs"
              leftSection={<Trash2 size={16} />}
              onClick={() => onRemove(news.id)}
            >
              Remove
            </Button>
          </Group>
        </Flex>
      ))}
    </Flex>
  );
};

export default function TimelinesEditor() {
  const [
    createTimelineDialogOpened,
    { toggle: toggleCreateTimelineDialog, close: closeTimelineDialog },
  ] = useDisclosure(false);

  const [
    addNewsDialogOpened,
    { toggle: toggleAddNewsDialog, close: closeAddNewsDialog },
  ] = useDisclosure(false);

  const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(
    null
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["timelines"],
    queryFn: agent.TimelinesAgent.getTimelines,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _) => lastPage.nextCursor,
  });

  const handleMoveNews = (newsId: string, direction: "up" | "down") => {
    setSelectedTimeline((prev) => {
      if (!prev || !prev.news) return prev;

      const index = prev.news.findIndex((item) => item.id === newsId);
      if (index === -1) return prev;

      const newIndex = direction === "up" ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= prev.news.length) return prev;

      const updatedNews = [...prev.news];
      [updatedNews[index], updatedNews[newIndex]] = [
        updatedNews[newIndex],
        updatedNews[index],
      ];

      return {
        ...prev,
        news: updatedNews,
      };
    });
  };
  const handleAddNews = () => {
    toggleAddNewsDialog();
  };

  return (
    <Flex direction="column" align="center" p="lg" w="100%">
      <Title mb="xl">Timelines Editor</Title>

      <Flex flex={1} gap="100px" justify="left" w="100%">
        <Stack align="center" w="33%">
          <Button
            c="white"
            bg="black"
            leftSection={<Plus />}
            onClick={toggleCreateTimelineDialog}
          >
            New Timeline
          </Button>

          <Stack
            w="100%"
            gap="0"
            style={{ overflowY: "scroll", maxHeight: "600px" }}
          >
            {status === "pending" && <Loader color="black" />}
            {status === "error" && <Text c="red">Error loading timelines</Text>}
            {status === "success" &&
              data.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.data.map((timeline) => (
                    <Group
                      key={timeline.id}
                      p="md"
                      mb="xs"
                      bg={
                        selectedTimeline?.id === timeline.id
                          ? "white"
                          : "rgba(210, 210, 210, 1)"
                      }
                      onClick={() => setSelectedTimeline(timeline)}
                    >
                      <Text>{timeline.name}</Text>
                    </Group>
                  ))}
                </React.Fragment>
              ))}
          </Stack>

          <Group>
            <Button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              c="white"
              bg="black"
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load More"
                : "Nothing more to load"}
            </Button>
            <Button c="white" bg="black" onClick={() => refetch()}>
              Refresh
            </Button>
          </Group>
        </Stack>

        <Flex flex={1} align="center" direction="column">
          <Title mb="xl" ta="center">
            Edit Timeline
          </Title>

          <Flex
            w="100%"
            h="100%"
            bg="rgba(210, 210, 210, 1)"
            direction="column"
            p="md"
          >
            {selectedTimeline ? (
              <>
                <Text size="lg" fw={500} mb="md">
                  {selectedTimeline.name}
                </Text>

                <Button onClick={handleAddNews} leftSection={<Plus />} mb="md">
                  Add News to Timeline
                </Button>

                <TimelineOrderVisualizer
                  newsItems={selectedTimeline.news || []}
                  onRemove={(newsId: string) =>
                    setSelectedTimeline((prev) =>
                      prev
                        ? {
                            ...prev,
                            news:
                              prev.news?.filter((item) => item.id !== newsId) ||
                              [],
                          }
                        : null
                    )
                  }
                  onMove={handleMoveNews}
                />
              </>
            ) : (
              <Text ta="center" c="dimmed">
                Select a timeline to edit
              </Text>
            )}
            <Button
              mt="lg"
              onClick={async () => {
                if (selectedTimeline && selectedTimeline.id != "undefined") {
                  await agent.TimelinesAgent.updateTimeline({
                    id: selectedTimeline.id,
                    name: selectedTimeline.name,
                    newsIds: selectedTimeline.news?.map((x) => x.id) ?? [],
                  });
                  notifications.show({
                    title: "Success",
                    message: "Successfully updated timeline",
                    color: "green",
                  });
                } else if (selectedTimeline) {
                  await agent.TimelinesAgent.createTimeline({
                    name: selectedTimeline.name,
                    newsIds: selectedTimeline.news?.map((x) => x.id) ?? [],
                  });
                  notifications.show({
                    title: "Success",
                    message: "Successfully created timeline",
                    color: "green",
                  });
                }
              }}
            >
              Save changes
            </Button>
          </Flex>
        </Flex>
      </Flex>

      {createTimelineDialogOpened && (
        <CreateTimelineDialog
          opened={createTimelineDialogOpened}
          onClose={closeTimelineDialog}
          onCreate={(timelineName) => {
            setSelectedTimeline({
              id: "undefined",
              name: timelineName,
              news: [],
            });
          }}
        />
      )}
      {addNewsDialogOpened && (
        <AddNewsToTimelineDialog
          opened={addNewsDialogOpened}
          onClose={closeAddNewsDialog}
          onAddNews={(news) => {
            setSelectedTimeline((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                news: [...(prev.news || []), news],
              };
            });
            closeAddNewsDialog();
          }}
        />
      )}
    </Flex>
  );
}
