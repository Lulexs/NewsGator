import { Button, Flex, Group, Stack, Title, Image, Text } from "@mantine/core";
import { AsyncAutocomplete } from "../../Util/AsyncAutocomplete";
import styles from "../EditorPage.module.css";
import { useDisclosure } from "@mantine/hooks";
import CreateNewsDialog from "../../Dialogs/NewNewsDialog";
import NewsEditorForm from "./NewsEditorForm";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useInfiniteQuery } from "@tanstack/react-query";
import agent from "../../../app/api/agent";
import { Loader } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { useMemo } from "react";

export default observer(function NewsEditor() {
  const [
    newNewsDialogOpened,
    { toggle: toggleNewNewsDialog, close: closeNewNewsDialog },
  ] = useDisclosure();
  const { newsEditorFormStateStore, userStore } = useStore();
  const selectedNews = newsEditorFormStateStore.editedNews;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["editornews"],
    queryFn: ({pageParam = 0}) => agent.NewsAgent.getEditorNews({userId: userStore.user!.id, pageParam}),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _) => lastPage.nextCursor,
  });

  const bookmarksIds = useMemo(
    () => data?.pages.flatMap((p) => p.bookmarks) || [],
    [data]
  );

  console.log(data);

  return (
    <>
      <Flex direction="column" align="center" p="lg" w="100%">
        <Title mb="xl">News editor</Title>
        <Flex flex={1} gap="100px" justify="left" w="100%">
          <Stack align="center" w="33%">
            <Group>
              <AsyncAutocomplete />
              <Stack>
                <label
                  style={{ fontWeight: "500", marginBottom: "7px" }}
                ></label>
                <Button
                  c="white"
                  bg="black"
                  onClick={() => {
                    toggleNewNewsDialog();
                  }}
                >
                  New news
                </Button>
              </Stack>
            </Group>
            <Stack
              w="100%"
              gap="0"
              style={{ overflowY: "scroll", maxHeight: "600px" }}
            >
              {status === "pending" && <Loader color="black" />}
              {status === "error" && <Loader color="black" />}
              {status === "success" &&
                data.pages.map((page, i) => (
                  <Fragment key={i}>
                    {page.data.map((news) => (
                      <Group
                        className={styles.singleNews}
                        key={news.id}
                        p="md"
                        gap="xs"
                        mb="0"
                        mt="0"
                        bg={
                          selectedNews?.id === news.id
                            ? "white"
                            : "rgba(210, 210, 210, 1)"
                        }
                        onClick={async () => {
                          var singleNew = await agent.NewsAgent.getSingleNews(
                            news.id
                          );
                          newsEditorFormStateStore.setNews(singleNew);
                        }}
                      >
                        <Image
                          src={news.thumbnail ?? "Image_unavailable.png"}
                          alt={news.title}
                          w={80}
                          h={60}
                        />
                        <Group flex={1}>
                          <Text lineClamp={1} size="md">
                            {news.title}
                          </Text>
                          <Button
                            c="white"
                            bg={bookmarksIds.includes(news.id) ? "gray" : "black"}
                            disabled={bookmarksIds.includes(news.id)}
                            onClick={async (e) => {
                              e.stopPropagation();
                              userStore.user!.bookmarks?.push(await agent.NewsAgent.bookmarkNews(userStore.user!.id, news.id));
                              await refetch();
                            }}
                          >
                            Bookmark
                          </Button>
                        </Group>
                      </Group>
                    ))}
                  </Fragment>
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
              Edit news
            </Title>
            <Flex w="100%" h="100%" bg="rgba(210, 210, 210, 1)">
              <NewsEditorForm />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <CreateNewsDialog
        opened={newNewsDialogOpened}
        onClose={closeNewNewsDialog}
        onCreate={(newName) =>
          newsEditorFormStateStore.setNews({
            id: "undefined",
            title: newName,
            thumbnail: "",
            createdAt: new Date(Date.now()),
          })
        }
      />
    </>
  );
});
