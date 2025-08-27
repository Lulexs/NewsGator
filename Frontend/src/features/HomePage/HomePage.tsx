import { useEffect, useState } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  Flex,
  Box,
  TextInput,
  MultiSelect,
  Button,
  Title,
  Loader,
  Group,
  Container,
  Progress,
  Text,
  Card,
  Stack,
  Badge,
} from "@mantine/core";
import Header from "../Header/Header";
import NewsCard from "./NewsCard";
import agent from "../../app/api/agent";
import { useStore } from "../../app/stores/store";
import { HomePagePoll } from "../../app/models/Poll";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";

export default observer(function HomePage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [coverages, setCoverages] = useState<string[]>([]);
  const [author, setAuthor] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const { userStore } = useStore();
  const [currentPoll, setCurrentPoll] = useState<HomePagePoll | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const navigate = useNavigate();

  const { data: mostPopularNews, isLoading: loadingPopularNews } = useQuery({
    queryKey: ["mostPopularNews"],
    queryFn: agent.HomePageNewsAgent.getMostPopular,
  });

  const {
    data: recentNewsData,
    fetchNextPage: fetchNextRecentPage,
    hasNextPage: hasNextRecentPage,
    isFetchingNextPage: isFetchingNextRecentPage,
    isLoading: loadingRecentNews,
  } = useInfiniteQuery({
    queryKey: ["mostRecentNews"],
    queryFn: agent.HomePageNewsAgent.getMostRecent,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !isFiltering,
  });

  const {
    data: filteredNewsData,
    fetchNextPage: fetchNextFilteredPage,
    hasNextPage: hasNextFilteredPage,
    isFetchingNextPage: isFetchingNextFilteredPage,
    isLoading: loadingFilteredNews,
    refetch: refetchFilteredNews,
  } = useInfiniteQuery({
    queryKey: [
      "filteredNews",
      { title, location, categories, tags, coverages, author },
    ],
    queryFn: ({ pageParam = 0 }) =>
      agent.HomePageNewsAgent.getFiltered({
        pageParam,
        filterData: {
          title,
          location,
          categories,
          tags,
          coverages,
          author,
        },
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: isFiltering,
  });

const { 
  data: filterOptions
} = useQuery({
  queryKey: ["filterOptions"],
  queryFn: () => agent.HomePageNewsAgent.getFilterOptions(),
});

  const handleFilterSubmit = () => {
    setIsFiltering(true);
    refetchFilteredNews();
  };

  const handleClearFilters = () => {
    setTitle("");
    setLocation("");
    setCategories([]);
    setTags([]);
    setCoverages([]);
    setAuthor("");
    setIsFiltering(false);
  };

  const { data: pollData, refetch: refetchPollData } = useQuery({
    queryKey: ["homePoll"],
    queryFn: () => agent.PollsAgent.getPollForHome(userStore.user!.id),
    enabled: !!userStore.user,
  });

  useEffect(() => {
    if (pollData) {
      setCurrentPoll(pollData);
      setHasVoted(!!pollData.userVote);
    }
  }, [pollData]);

  const handleVote = async (option: string) => {
    if (hasVoted) return;

    try {
      await agent.PollsAgent.vote(currentPoll!.id, userStore.user!.id, option);

      await refetchPollData();
    } catch (error) {
      console.error("Vote failed", error);
    }
  };

  const {
    data: timelinesData,
    fetchNextPage: fetchNextTimelinesPage,
    hasNextPage: hasNextTimelinesPage,
    isFetchingNextPage: isFetchingNextTimelinesPage,
    isLoading: loadingTimelines,
  } = useInfiniteQuery({
    queryKey: ["homepageTimelines"],
    queryFn: ({ pageParam = 0 }) =>
      agent.TimelinesAgent.getTimelines({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return (
    <Flex direction="column" mih="100vh">
      <Header />

      <Container size="xl" mt="md">
        <Flex>
          <Box flex={1} mr="md">
            <Box mb="xl">
              <Title order={3} mb="md">
                Filter News
              </Title>
              <Group align="flex-end" grow>
                <TextInput
                  label="Title"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextInput
                  label="Location"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <MultiSelect
                  label="Categories"
                  placeholder="Select categories"
                  data={filterOptions?.categories || []}
                  value={categories}
                  onChange={setCategories}
                />
              </Group>
              <Group align="flex-end" grow mt="md">
                <MultiSelect
                  label="Tags"
                  placeholder="Select tags"
                  data={filterOptions?.tags || []}
                  value={tags}
                  onChange={setTags}
                />
                <MultiSelect
                  label="Coverages"
                  placeholder="Select coverages"
                  data={filterOptions?.newspapers || []}
                  value={coverages}
                  onChange={setCoverages}
                />
                <TextInput
                  label="Author"
                  placeholder="Enter author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </Group>
              <Group justify="flex-end" mt="md">
                <Button
                  variant="subtle"
                  onClick={handleClearFilters}
                  disabled={!isFiltering}
                >
                  Clear Filters
                </Button>
                <Button
                  c="white"
                  bg="black"
                  variant="filled"
                  onClick={handleFilterSubmit}
                >
                  Apply Filters
                </Button>
              </Group>
            </Box>

            {!isFiltering && (
              <>
                <Box mb="xl">
                  <Title order={3} mb="md">
                    Most Popular News
                  </Title>
                  {loadingPopularNews ? (
                    <Group justify="center" p="xl">
                      <Loader size="lg" />
                    </Group>
                  ) : (
                    <Group gap="lg">
                      {mostPopularNews?.map((news) => (
                        <NewsCard key={news.id} news={news} />
                      ))}
                    </Group>
                  )}
                </Box>

                <Box mb="xl">
                  <Title order={3} mb="md">
                    Most Recent News
                  </Title>
                  {loadingRecentNews ? (
                    <Group justify="center" p="xl">
                      <Loader size="lg" />
                    </Group>
                  ) : (
                    <>
                      <Group gap="lg" align="stretch">
                        {recentNewsData?.pages.map((page) =>
                          page.data.map((news) => (
                            <NewsCard key={news.id} news={news} />
                          ))
                        )}
                      </Group>
                      {hasNextRecentPage && (
                        <Group justify="center" mt="xl">
                          <Button
                            variant="outline"
                            onClick={() => fetchNextRecentPage()}
                            loading={isFetchingNextRecentPage}
                          >
                            Load More
                          </Button>
                        </Group>
                      )}
                    </>
                  )}
                </Box>
              </>
            )}

            {isFiltering && (
              <Box mb="xl">
                <Title order={3} mb="md">
                  Filtered Results
                </Title>
                {loadingFilteredNews ? (
                  <Group justify="center" p="xl">
                    <Loader size="lg" />
                  </Group>
                ) : (
                  <>
                    <Group gap="lg" align="stretch">
                      {filteredNewsData?.pages.map((page) =>
                        page.data.map((news) => (
                          <NewsCard key={news.id} news={news} />
                        ))
                      )}
                    </Group>
                    {hasNextFilteredPage && (
                      <Group justify="center" mt="xl">
                        <Button
                          variant="outline"
                          onClick={() => fetchNextFilteredPage()}
                          loading={isFetchingNextFilteredPage}
                        >
                          Load More
                        </Button>
                      </Group>
                    )}
                  </>
                )}
              </Box>
            )}
          </Box>
          {currentPoll && (
            <Box w={300}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">
                  Quick Poll
                </Title>
                <Text fw={500} mb="md">
                  {currentPoll.question}
                </Text>

                <Stack gap="xs">
                  {currentPoll.options.map((option) => {
                    const percentage =
                      currentPoll.options.reduce(
                        (sum, opt) => sum + opt.votes,
                        0
                      ) > 0
                        ? Number.parseFloat(
                            (
                              (option.votes /
                                currentPoll.options.reduce(
                                  (sum, opt) => sum + opt.votes,
                                  0
                                )) *
                              100
                            ).toFixed(1)
                          )
                        : 0;

                    const isUserVote = option.option === currentPoll.userVote;

                    return (
                      <Button
                        key={option.option}
                        bg={
                          hasVoted
                            ? isUserVote
                              ? "green"
                              : "grey"
                            : "rgba(210, 210, 210, 80)"
                        }
                        c="black"
                        onClick={() => handleVote(option.option)}
                        disabled={hasVoted}
                        fullWidth
                        p="xs"
                        h="fit-content"
                      >
                        <Flex direction="column" w="100%">
                          <Flex justify="space-between" mb={5}>
                            <Text>{option.option}</Text>
                            <Text>{percentage.toFixed(1)}%</Text>
                          </Flex>
                          <Progress
                            value={percentage}
                            size="sm"
                            color={hasVoted ? "gray" : "blue"}
                          />
                        </Flex>
                      </Button>
                    );
                  })}
                </Stack>

                <Text mt="md" size="xs" c="dimmed" ta="center">
                  Total Votes:{" "}
                  {currentPoll.options.reduce((sum, opt) => sum + opt.votes, 0)}
                </Text>
              </Card>

              {loadingTimelines ? (
                <Group justify="center">
                  <Loader size="sm" />
                </Group>
              ) : (
                <Stack
                  gap="xs"
                  mt="lg"
                  styles={{
                    root: {
                      border: "1px solid rgba(220, 220, 220, 50)",
                      borderRadius: "10px",
                    },
                  }}
                >
                  {timelinesData?.pages.map((page) =>
                    page.data.map((timeline) => (
                      <Button
                        key={timeline.id}
                        variant="light"
                        color="gray"
                        fullWidth
                        justify="space-between"
                        onClick={() => navigate(`/timeline/${timeline.id}`)}
                      >
                        <Flex
                          direction="column"
                          w="100%"
                          align="flex-start"
                          gap="xs"
                        >
                          <Flex w="100%" justify="space-between" align="center">
                            <Text fw={500}>{timeline.name}</Text>
                            <Badge color="gray" variant="light" size="sm">
                              {timeline.news?.length || 0} news
                            </Badge>
                          </Flex>
                        </Flex>
                      </Button>
                    ))
                  )}
                  {hasNextTimelinesPage && (
                    <Group justify="center" mt="xs">
                      <Button
                        variant="outline"
                        onClick={() => fetchNextTimelinesPage()}
                        loading={isFetchingNextTimelinesPage}
                      >
                        Load More
                      </Button>
                    </Group>
                  )}
                </Stack>
              )}
            </Box>
          )}
        </Flex>
      </Container>
    </Flex>
  );
});
