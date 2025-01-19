import { Button, Flex, Group, Stack, Title, Image, Text } from "@mantine/core";
import { AsyncAutocomplete } from "../../Util/AsyncAutocomplete";
import styles from "../EditorPage.module.css";
import { useDisclosure } from "@mantine/hooks";
import CreateNewsDialog from "../../Dialogs/NewNewsDialog";
import { useState } from "react";
import NewsEditorForm from "./NewsEditorForm";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

const fakemData = [
  {
    newsId: "news1",
    title: "Breaking News: Tech Innovation Shocks the Industry",
    thumbnail: "http://localhost:9898/0b5faac0_5b53_41c2_9c05_57a41e3dcd46.png",
  },
  {
    newsId: "news2",
    title: "Sports Update: Local Team Wins Championship",
    thumbnail: "http://localhost:9898/0b5faac0_5b53_41c2_9c05_57a41e3dcd46.png",
  },
  {
    newsId: "news3",
    title: "Weather Alert: Heavy Rain Expected Tomorrow",
    thumbnail: "http://localhost:9898/0b5faac0_5b53_41c2_9c05_57a41e3dcd46.png",
  },
  {
    newsId: "news4",
    title: "Health Tips: 10 Ways to Stay Fit This Winter",
    thumbnail: "http://localhost:9898/0b5faac0_5b53_41c2_9c05_57a41e3dcd46.png",
  },
  {
    newsId: "news5",
    title: "Entertainment: Upcoming Movie Releases to Watch",
    thumbnail: "http://localhost:9898/0b5faac0_5b53_41c2_9c05_57a41e3dcd46.png",
  },
  {
    newsId: "news6",
    title: "Economy: Stock Markets Surge After Positive Data",
    thumbnail: "http://localhost:9898/0b5faac0_5b53_41c2_9c05_57a41e3dcd46.png",
  },
  {
    newsId: "news7",
    title: "Travel Guide: Top Destinations for 2025",
    thumbnail: "http://localhost:9898/0b5faac0_5b53_41c2_9c05_57a41e3dcd46.png",
  },
  {
    newsId: "news8",
    title: "Science Breakthrough: New Discovery in Space Exploration",
    thumbnail: "http://localhost:9898/0b5faac0_5b53_41c2_9c05_57a41e3dcd46.png",
  },
  {
    newsId: "news9",
    title: "Education: Innovative Teaching Methods on the Rise",
    thumbnail: "http://localhost:9898/0b5faac0_5b53_41c2_9c05_57a41e3dcd46.png",
  },
  {
    newsId: "news10",
    title: "Tech Spotlight: Top Gadgets of the Year",
    thumbnail: "http://localhost:9898/0b5faac0_5b53_41c2_9c05_57a41e3dcd46.png",
  },
];

export default observer(function NewsEditor() {
  const [
    newNewsDialogOpened,
    { toggle: toggleNewNewsDialog, close: closeNewNewsDialog },
  ] = useDisclosure();
  const [fakeData, setFakeData] = useState(fakemData);
  const { newsEditorFormStateStore } = useStore();
  const selectedNews = newsEditorFormStateStore.editedNews;

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
              {fakeData.map((data) => {
                return (
                  <Group
                    className={styles.singleNews}
                    key={data.newsId}
                    p="md"
                    gap="xs"
                    mb="0"
                    mt="0"
                    bg={
                      selectedNews?.id == data.newsId
                        ? "white"
                        : "rgba(210, 210, 210, 1)"
                    }
                    onClick={() => {
                      if (data.newsId == "undefined") {
                        console.log("Here");
                        newsEditorFormStateStore.setNews({
                          title: data.title,
                          id: data.newsId,
                          createdAt: new Date(Date.now()),
                        });
                      } else {
                        // to be implemented acquire news from backend
                      }
                    }}
                  >
                    <Image
                      src={data.thumbnail}
                      alt={data.title}
                      w={80}
                      h={60}
                    />
                    <Group flex={1}>
                      <Text lineClamp={1} size="md">
                        {data.title}
                      </Text>
                    </Group>
                  </Group>
                );
              })}
            </Stack>
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
          setFakeData((p) => [
            ...p,
            {
              newsId: "undefined",
              title: newName,
              thumbnail: "",
            },
          ])
        }
      />
    </>
  );
});
