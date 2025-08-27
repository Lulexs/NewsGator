import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Tabs,
  Group,
  Text,
  Box,
  Paper,
  Badge,
  Container,
  Title,
  Image,
  Flex,
  Avatar,
  Button,
  Rating,
  Stack,
  TextInput,
} from "@mantine/core";
import agent from "../../app/api/agent";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import Header from "../Header/Header";
import { useEffect, useState } from "react";
import { useStore } from "../../app/stores/store";

export default function NewsPage() {
  const { newsid } = useParams();
  const queryClient = useQueryClient();
  const { userStore } = useStore();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const [currentAction, setCurrentAction] = useState(0);

  useEffect(() => {
    if (userStore.user == null) {
      navigate("/");
    }
  }, []);

  const { data: news, isLoading } = useQuery({
    queryKey: ["singleNews", newsid],
    queryFn: () =>
      agent.HomePageNewsAgent.getSingleNews(userStore.user!.id, newsid!),
    enabled: !!newsid,
  });

  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ["comments", newsid],
    queryFn: () => agent.NewsPageAgent.getReviews(newsid!),
    enabled: !!newsid && showComments,
  });

  const reviewMutation = useMutation({
    mutationFn: (data: any) => agent.NewsPageAgent.leaveReview(data.newsid, {
      value: data.value,
      comment: data.comment,
      commenter: data.commenter,
      avatar: data.avatar,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", newsid] });
      setComment("");
      setRating(0);
    },
  });

  const handleSubmitReview = () => {
    reviewMutation.mutate({
      newsid,
      comment,
      value: rating,
      commenter: userStore.user!.username,
      avatar: userStore.user!.avatar,
    });
  };

  const handleVote = async (type: "upvote" | "downvote") => {
    const newAction = type === "upvote" ? 1 : -1;
    const isToggling = currentAction === newAction;
    const toggledAction = isToggling ? 0 : newAction;

    setCurrentAction(toggledAction);

    try {
      await agent.NewsPageAgent.upvoteDownvote(
        news!.id,
        userStore.user!.id,
        toggledAction
      );

      queryClient.invalidateQueries({ queryKey: ["singleNews", newsid] });
    } catch (error) {
      setCurrentAction(news!.communityNote?.action ?? 0);
    }
  };

  useEffect(() => {
    if (news?.communityNote?.action != null) {
      setCurrentAction(news.communityNote.action);
    }
  }, [news]);

  if (isLoading)
    return (
      <Container size="xl">
        <Text>Loading...</Text>
      </Container>
    );
  if (!news)
    return (
      <Container size="xl">
        <Text>News not found</Text>
      </Container>
    );

  return (
    <>
      <Header />
      <Container size="xl" mt="xl" mb="xl">
        <Flex gap="xl" direction="column">
          <Flex gap="xl">
            <Box style={{ flex: 1 }}>
              <Box mb="xl">
                <Title order={2}>{news.title}</Title>
                <Text c="dimmed" size="sm">
                  {new Date(news.createdAt).toLocaleDateString()}
                  {news.location && ` • ${news.location}`}
                </Text>
              </Box>

              {news.thumbnail && (
                <Image
                  src={news.thumbnail}
                  alt={news.title}
                  mb="xl"
                  fit="cover"
                />
              )}

              {news.newspaperNews && (
                <Tabs defaultValue={news.newspaperNews[0]?.newspaper}>
                  <Tabs.List>
                    {news.newspaperNews.map((paper) => (
                      <Tabs.Tab
                        key={paper.newspaper}
                        value={paper.newspaper}
                        leftSection={
                          <Image
                            src={`http://localhost:9898/${paper.newspaper.toLowerCase()}.png`}
                            h={30}
                            w={50}
                            alt={paper.newspaper}
                          />
                        }
                      ></Tabs.Tab>
                    ))}
                  </Tabs.List>

                  {news.newspaperNews.map((paper) => (
                    <Tabs.Panel
                      key={paper.newspaper}
                      value={paper.newspaper}
                      pt="xl"
                    >
                      <Box mb="md">
                        {paper.author && (
                          <Text fw={500}>By {paper.author}</Text>
                        )}
                        <Text c="dimmed" size="sm">
                          {new Date(
                            paper.date ?? Date.now()
                          ).toLocaleDateString()}
                        </Text>
                      </Box>
                      <Group gap="xs" mb="md">
                        {paper.tags.map((tag) => (
                          <Badge key={tag} variant="light">
                            {tag}
                          </Badge>
                        ))}
                      </Group>
                      <Image
                        src={`http://localhost:9898/${paper.content}.png`}
                        alt="Content is temporary unavailable"
                      />
                      <Text
                        component="a"
                        href={paper.url}
                        target="_blank"
                        c="blue"
                        mt="md"
                        display="block"
                      >
                        Read original article
                      </Text>
                    </Tabs.Panel>
                  ))}
                </Tabs>
              )}
            </Box>

            {news.communityNote && (
              <Box w={300}>
                <Paper
                  withBorder
                  p="md"
                  style={{ position: "sticky", top: 20 }}
                >
                  <Title order={4} mb="md">
                    Community Note
                  </Title>
                  <Text mb="md">{news.communityNote.text}</Text>
                  <Group>
                    <Group
                      gap="xs"
                      style={{
                        color: currentAction === 1 ? "green" : "inherit",
                        cursor: "pointer",
                      }}
                      onClick={() => handleVote("upvote")}
                    >
                      <ThumbsUp size={16} />
                      <Text size="sm">
                        {news.communityNote.upvotes}
                      </Text>
                    </Group>
                    <Group
                      gap="xs"
                      style={{
                        color: currentAction === -1 ? "red" : "inherit",
                        cursor: "pointer",
                      }}
                      onClick={() => handleVote("downvote")}
                    >
                      <ThumbsDown size={16} />
                      <Text size="sm">
                        {news.communityNote.downvotes}
                      </Text>
                    </Group>
                  </Group>
                </Paper>
              </Box>
            )}
          </Flex>

          <Box mt="xl">
            <Button
              onClick={() => setShowComments(true)}
              disabled={showComments}
              loading={loadingComments}
              bg="black"
              c="white"
            >
              Load Comments
            </Button>

            {showComments && (
              <Stack mt="md">
                <Paper withBorder p="md">
                  <Stack>
                    <TextInput
                      placeholder="Your comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Group>
                      <Text size="sm">Rating:</Text>
                      <Rating value={rating} onChange={setRating} count={10} />
                    </Group>
                    <Button
                      bg="black"
                      c="white"
                      onClick={handleSubmitReview}
                      loading={reviewMutation.isPending}
                      disabled={!comment || !rating}
                    >
                      Submit Review
                    </Button>
                  </Stack>
                </Paper>

                {comments?.map((comment, index) => (
                  <Paper withBorder p="md" key={index}>
                    <Group>
                      <Avatar src={comment.avatar} alt={comment.commenter} />
                      <Box>
                        <Text fw={500}>{comment.commenter}</Text>
                        <Rating value={comment.value} readOnly count={10} />
                      </Box>
                    </Group>
                    <Text mt="sm">{comment.comment}</Text>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        </Flex>
      </Container>
    </>
  );
}
