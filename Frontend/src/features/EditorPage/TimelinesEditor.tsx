import React, { useState } from "react";
import { Flex, Stack, Title, Button, Group, Text, Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader, Plus, Trash2, Edit } from "lucide-react";
import { ThumbnailedNews } from "../../app/models/News";
import {
  CreateTimelineValues,
  UpdateTimelineValues,
  Timeline,
} from "../../app/models/Timelines";

// Mocked TimelinesAgent (replace with actual implementation)
const TimelinesAgent = {
  createTimeline: (timeline: CreateTimelineValues) =>
    Promise.resolve({ id: "new-id", ...timeline }),
  deleteTimeline: (timelineId: string) => Promise.resolve(true),
  getTimeline: (timelineId: string) =>
    Promise.resolve({
      id: timelineId,
      name: "Sample Timeline",
      News: [],
    }),
  getTimelines: () =>
    Promise.resolve({
      data: [
        { id: "1", name: "Timeline 1", News: [] },
        { id: "2", name: "Timeline 2", News: [] },
      ],
      nextCursor: null,
    }),
  updateTimeline: (timeline: UpdateTimelineValues) => Promise.resolve(timeline),
};

const TimelineOrderVisualizer: React.FC<{ newsItems: ThumbnailedNews[] }> = ({
  newsItems,
}) => {
  return (
    <Flex direction="column" gap="sm" w="100%" mt="md">
      {newsItems.map((news, index) => (
        <Flex
          key={news.newsId}
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
              color="gray"
              size="xs"
              leftSection={<Edit size={16} />}
            >
              Edit
            </Button>
            <Button
              variant="subtle"
              color="red"
              size="xs"
              leftSection={<Trash2 size={16} />}
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
  const [createTimelineDialogOpened, { toggle: toggleCreateTimelineDialog }] =
    useDisclosure(false);

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
    queryFn: TimelinesAgent.getTimelines,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const handleAddNews = () => {
    // Placeholder for adding news to timeline
  };

  return (
    <Flex direction="column" align="center" p="lg" w="100%">
      <Title mb="xl">Timelines Editor</Title>

      <Flex flex={1} gap="100px" justify="left" w="100%">
        {/* Timelines List */}
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

        {/* Timeline Editor */}
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
                  newsItems={selectedTimeline.News || []}
                />
              </>
            ) : (
              <Text ta="center" c="dimmed">
                Select a timeline to edit
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>

      {/* Create Timeline Dialog (placeholder) */}
      {createTimelineDialogOpened && (
        <div>{/* Implement create timeline dialog */}</div>
      )}
    </Flex>
  );
}
