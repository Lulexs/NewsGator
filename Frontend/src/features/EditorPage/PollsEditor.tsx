import {
  Button,
  Card,
  Grid,
  Group,
  Stack,
  Title,
  Text,
  Progress,
  CloseButton,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { Loader } from "lucide-react";
import agent from "../../app/api/agent";
import { Poll, PollOption } from "../../app/models/Poll";
import CreatePollDialog from "../Dialogs/CreatePollDialog";

const PollCard = ({
  poll,
  onDelete,
}: {
  poll: Poll;
  onDelete: (id: string) => void;
}) => {
  const totalVotes: number = poll.options.reduce(
    (sum: number, option: PollOption) => sum + option.votes,
    0
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <CloseButton
        onClick={() => onDelete(poll.id)}
        style={{ position: "absolute", right: 10, top: 10 }}
      />
      <Text fw={500} size="lg" mb="md">
        {poll.question}
      </Text>
      <Stack gap="xs">
        {poll.options.map((option: PollOption, idx: number) => {
          const percentage =
            totalVotes > 0
              ? Number.parseInt(((option.votes / totalVotes) * 100).toFixed(1))
              : 0;
          return (
            <div key={idx}>
              <Group justify="space-between" mb={5}>
                <Text size="sm">{option.option}</Text>
                <Text size="sm" c="dimmed">
                  {percentage}%
                </Text>
              </Group>
              <Progress value={percentage} size="lg" radius="xl" />
            </div>
          );
        })}
      </Stack>
      <Group mt="md" justify="space-between">
        <Text c="dimmed" size="sm">
          Total votes: {totalVotes}
        </Text>
        <Text c="dimmed" size="sm">
          Posted: {new Date(poll.datePosted).toLocaleDateString()}
        </Text>
      </Group>
    </Card>
  );
};

const PollsEditor = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const {
    data: polls,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["editorPolls"],
    queryFn: () => agent.PollsAgent.getPollsForEditor(),
  });

  const handleCreatePoll = async (pollData: Poll) => {
    try {
      await agent.PollsAgent.createPoll(pollData);
      refetch();
    } catch (error) {
      console.error("Failed to create poll:", error);
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    try {
      await agent.PollsAgent.deletePoll(pollId);
      refetch();
    } catch (error) {
      console.error("Failed to delete poll:", error);
    }
  };

  return (
    <Stack p="lg" w="100%">
      <Group justify="space-between">
        <Title>Polls Editor</Title>
        <Group>
          <Button bg="black" c="white" onClick={() => refetch()}>
            Refresh
          </Button>
          <Button bg="black" c="white" onClick={open}>
            New Poll
          </Button>
        </Group>
      </Group>

      {isLoading && <Loader />}
      {isError && <Text c="red">Error loading polls. Please try again.</Text>}

      <Grid>
        {polls?.map((poll, idx) => (
          <Grid.Col key={idx} span={{ base: 12, sm: 6, md: 4 }}>
            <PollCard poll={poll} onDelete={handleDeletePoll} />
          </Grid.Col>
        ))}
      </Grid>

      <CreatePollDialog
        opened={opened}
        onClose={close}
        onCreate={handleCreatePoll}
      />
    </Stack>
  );
};

export default PollsEditor;
