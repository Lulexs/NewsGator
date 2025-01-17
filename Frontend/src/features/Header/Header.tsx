import { Group, Avatar, Button, Flex } from "@mantine/core";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import { UserRole } from "../../app/models/User";

export default observer(function Header() {
  const { userStore } = useStore();
  const navigate = useNavigate();

  return (
    <Flex justify="flex-end" align="center" flex-y={1} p="md" bg="black">
      {userStore.user != null && (
        <Group>
          <Avatar
            src={userStore.user?.avatar}
            onClick={() => {
              if (userStore.user?.role == UserRole.Editor) {
                navigate("/editorpage");
              }
            }}
          />
          <Button
            onClick={() => {
              userStore.logout();
            }}
          >
            Log out
          </Button>
        </Group>
      )}

      {userStore.user == null && (
        <Group>
          <Button onClick={() => navigate("/login")}>Login</Button>
          <Button onClick={() => navigate("/register")}>Register</Button>
        </Group>
      )}
    </Flex>
  );
});
