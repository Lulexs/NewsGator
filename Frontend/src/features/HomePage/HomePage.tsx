import { useState } from "react";
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
} from "@mantine/core";
import Header from "../Header/Header";
import NewsCard from "./NewsCard";
import agent from "../../app/api/agent";

export default function HomePage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [coverages, setCoverages] = useState<string[]>([]);
  const [author, setAuthor] = useState("");

  const { data: mostPopularNews, isLoading: loadingPopularNews } = useQuery({
    queryKey: ["mostPopularNews"],
    queryFn: agent.HomePageNewsAgent.getMostPopular,
  });

  const {
    data: recentNewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: loadingRecentNews,
  } = useInfiniteQuery({
    queryKey: ["mostRecentNews"],
    queryFn: agent.HomePageNewsAgent.getMostRecent,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const handleFilterSubmit = () => {
    console.log({ title, location, categories, tags, coverages, author });
  };

  return (
    <Flex direction="column" mih="100vh">
      <Header />

      <Container size="xl" mt="md">
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
              data={["Category1", "Category2"]}
              value={categories}
              onChange={setCategories}
            />
          </Group>
          <Group align="flex-end" grow mt="md">
            <MultiSelect
              label="Tags"
              placeholder="Select tags"
              data={["tag1", "tag2"]}
              value={tags}
              onChange={setTags}
            />
            <MultiSelect
              label="Coverages"
              placeholder="Select coverages"
              data={["Politika", "Novosti"]}
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
              c="white"
              bg="black"
              variant="filled"
              onClick={handleFilterSubmit}
            >
              Apply Filters
            </Button>
          </Group>
        </Box>

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
              {hasNextPage && (
                <Group justify="center" mt="xl">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    loading={isFetchingNextPage}
                  >
                    Load More
                  </Button>
                </Group>
              )}
            </>
          )}
        </Box>
      </Container>
    </Flex>
  );
}
