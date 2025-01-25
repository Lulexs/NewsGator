import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "../../app/stores/store";
import { useNavigate, useParams } from "react-router";
import agent from "../../app/api/agent";
import {
  Container,
  Title,
  Text,
  Box,
  Image,
  Flex,
  Paper,
  Loader,
  Group,
} from "@mantine/core";
import Header from "../Header/Header";
import { observer } from "mobx-react-lite";

export default observer(function TimelinePage() {
  const { timelineId } = useParams();
  const { userStore } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userStore.user == null) {
      navigate("/");
    }
  }, []);

  const { data: timeline, isLoading } = useQuery({
    queryKey: ["timeline", timelineId],
    queryFn: () => agent.TimelinesAgent.getTimeline(timelineId!),
    enabled: !!timelineId,
  });

  if (isLoading) {
    return (
      <Container size="xl">
        <Group justify="center" mt="xl">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  if (!timeline) {
    return (
      <Container size="xl">
        <Text>Timeline not found</Text>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container size="xl" mt="xl">
        <Title order={2} mb="xl">
          {timeline.name}
        </Title>

        <Box style={{ position: "relative" }} pl="xl">
          <Box
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              backgroundColor: "rgba(0,0,0,0.1)",
            }}
          />

          {timeline.news?.map((newsItem, index) => (
            <Flex
              key={newsItem.id}
              mb="xl"
              align="center"
              styles={{ root: { position: "relative" } }}
            >
              <Box
                style={{
                  position: "absolute",
                  left: "-25px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "black",
                }}
              />

              <Paper
                withBorder
                shadow="xs"
                p="md"
                style={{
                  width: "100%",
                  marginLeft: "20px",
                  transform:
                    index % 2 === 0 ? "translateX(0)" : "translateX(20px)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(210, 210, 210, 50)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
                onClick={() => navigate(`/news/${newsItem.id}`)}
              >
                {newsItem.thumbnail && (
                  <Flex mb="md" align="center" gap="md">
                    <Image
                      src={newsItem.thumbnail}
                      alt={newsItem.title}
                      height={80}
                      width={120}
                      fit="cover"
                      radius="sm"
                    />
                    <Title order={4}>{newsItem.title}</Title>
                  </Flex>
                )}
                {!newsItem.thumbnail && (
                  <Title order={4}>{newsItem.title}</Title>
                )}
              </Paper>
            </Flex>
          ))}
        </Box>
      </Container>
    </>
  );
});
