import {
  Flex,
  Title,
  TextInput,
  Box,
  Chip,
  Text,
  Button,
  Group,
  Stack,
  Image,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { X } from "lucide-react";
import { useStore } from "../../app/stores/store";
import { UserSubscriptions } from "../../app/models/User";
import { useNavigate } from "react-router";

export default observer(function PersonalPage() {
  const { userStore } = useStore();
  const user = userStore.user!;

  const navigate = useNavigate();

  const [newCategory, setNewCategory] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newNews, setNewNews] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<number>(
    +user.avatar.charAt(81)
  );

  const handleInputChange = (field: keyof typeof user) => (event: any) => {
    userStore.updateUserField(field, event.target.value);
  };

  const addItem = (type: keyof UserSubscriptions, value: string) => {
    if (!value.trim()) return;
    userStore.addSubscription(type, value.trim());
  };

  const removeItem = (type: keyof UserSubscriptions, value: string) => {
    userStore.removeSubscription(type, value);
  };

  const handleSave = () => {
    userStore.saveUser();
  };

  return (
    <Flex direction="column" align="center" p="lg" w="100%">
      <Title mb="xl">Personal Information</Title>

      <Flex bg="white" p="xl" w="100%" maw={1200} gap="100px">
        <Flex direction="column" w="50%">
          <Stack gap="md">
            <TextInput
              label="Username"
              value={user.username}
              onChange={handleInputChange("username")}
            />
            <TextInput
              label="Email"
              type="email"
              value={user.email}
              onChange={handleInputChange("email")}
            />

            <Box>
              <Text size="sm" fw={500} mb="xs">
                Choose your avatar
              </Text>
              <Flex wrap="wrap" gap="xs">
                {[...Array(9)].map((_, index) => (
                  <Box
                    key={index + 1}
                    p="xs"
                    style={{
                      position: "relative",
                      cursor: "pointer",
                    }}
                  >
                    <Image
                      width={120}
                      height={120}
                      src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-${
                        index + 1
                      }.png`}
                      styles={(theme) => ({
                        root: {
                          cursor: "pointer",
                          transition: "transform 0.2s ease",
                          border:
                            selectedAvatar == index + 1
                              ? `3px solid ${theme.colors.blue[6]}`
                              : "3px solid transparent",
                          boxShadow:
                            selectedAvatar == index + 1
                              ? `0 0 10px ${theme.colors.blue[3]}`
                              : "none",
                        },
                      })}
                      onClick={() => {
                        setSelectedAvatar(index + 1);
                        userStore.updateUserField(
                          "avatar",
                          `https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-${
                            index + 1
                          }.png`
                        );
                      }}
                    />
                  </Box>
                ))}
              </Flex>
            </Box>
          </Stack>
        </Flex>

        <Flex direction="column" w="50%">
          <Stack gap="xl">
            <Box>
              <Title order={3} mb="md">
                Subscriptions
              </Title>

              <Text fw={500} mb="xs">
                Categories
              </Text>
              <Group mb="md">
                <TextInput
                  placeholder="Add category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addItem("categories", newCategory);
                      setNewCategory("");
                    }
                  }}
                />
                <Button
                  c="white"
                  bg="black"
                  onClick={() => {
                    addItem("categories", newCategory);
                    setNewCategory("");
                  }}
                >
                  Add
                </Button>
              </Group>
              <Group mb="lg">
                {user.subscriptions?.categories?.map((category) => (
                  <Chip
                    key={category}
                    checked={false}
                    onClick={() => removeItem("categories", category)}
                  >
                    {category} <X size={16} />
                  </Chip>
                ))}
              </Group>

              <Text fw={500} mb="xs">
                Authors
              </Text>
              <Group mb="md">
                <TextInput
                  placeholder="Add author"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addItem("authors", newAuthor);
                      setNewAuthor("");
                    }
                  }}
                />
                <Button
                  c="white"
                  bg="black"
                  onClick={() => {
                    addItem("authors", newAuthor);
                    setNewAuthor("");
                  }}
                >
                  Add
                </Button>
              </Group>
              <Group mb="lg">
                {user.subscriptions?.authors?.map((author) => (
                  <Chip
                    key={author}
                    checked={false}
                    onClick={() => removeItem("authors", author)}
                  >
                    {author} <X size={16} />
                  </Chip>
                ))}
              </Group>

              <Text fw={500} mb="xs">
                News
              </Text>
              <Group mb="md">
                <TextInput
                  placeholder="Add news subscription"
                  value={newNews}
                  onChange={(e) => setNewNews(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addItem("news", newNews);
                      setNewNews("");
                    }
                  }}
                />
                <Button
                  c="white"
                  bg="black"
                  onClick={() => {
                    addItem("news", newNews);
                    setNewNews("");
                  }}
                >
                  Add
                </Button>
              </Group>
              <Group mb="lg">
                {user.subscriptions?.news?.map((newsItem) => (
                  <Chip
                    key={newsItem}
                    checked={false}
                    onClick={() => removeItem("news", newsItem)}
                  >
                    {newsItem} <X size={16} />
                  </Chip>
                ))}
              </Group>
            </Box>

            <Box>
              <Title order={3} mb="md">
                Bookmarks
              </Title>
              <Stack>
                {user.bookmarks?.map((bookmark) => (
                  <Flex
                    key={bookmark.newsId}
                    align="center"
                    p="sm"
                    style={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                    onClick={() => navigate(`/news/${bookmark.newsId}`)}
                  >
                    {bookmark.thumbnail && (
                      <Image
                        src={`http://localhost:9898/${bookmark.thumbnail}`}
                        alt={bookmark.title}
                        w="50px"
                        h="50px"
                        style={{
                          marginRight: "16px",
                          borderRadius: "4px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <Flex
                      direction="column"
                      style={{ flex: 1, overflow: "hidden" }}
                    >
                      <Text
                        size="sm"
                        fw={500}
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {bookmark.title}
                      </Text>
                    </Flex>
                    <Button
                      size="xs"
                      variant="outline"
                      color="red"
                      onClick={() => userStore.removeBookmark(bookmark.newsId)}
                      style={{ marginLeft: "auto" }}
                    >
                      Remove
                    </Button>
                  </Flex>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </Flex>

      <Group mt="xl">
        <Button size="lg" onClick={handleSave} c="white" bg="black">
          Save Changes
        </Button>
      </Group>
    </Flex>
  );
});
