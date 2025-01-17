import { Flex, Stack, Button } from "@mantine/core";
import Header from "../Header/Header";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import styles from "./EditorPage.module.css";
import { useNavigate } from "react-router";
import PersonalPage from "./PersonalPage";
import { useStore } from "../../app/stores/store";
import NewsEditor from "./NewsEditor/NewsEditor";

enum State {
  Personal,
  News,
  Timelines,
  Polls,
}

export default observer(function EditorPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<State>(State.Personal);
  const { userStore } = useStore();

  useEffect(() => {
    if (userStore.user == null) {
      navigate("/");
    }
  }, []);

  if (userStore.user == null) {
    return null;
  }

  return (
    <Flex direction="column" h="100%">
      <Header />
      <Flex p="md" flex={1}>
        <Stack justify="center" gap="0" w="250px">
          <Button
            c="white"
            bg={mode == State.Personal ? "grey" : "black"}
            miw="130px"
            maw="130px"
            ta="right"
            m="0"
            radius="0"
            className={styles.stateButton}
            styles={{
              root: {
                clipPath: "polygon(0 0, 85% 0, 100% 100%, 0% 100%)",
              },
            }}
            onClick={() => {
              setMode(State.Personal);
            }}
          >
            Personal
          </Button>
          <Button
            c="white"
            bg={mode == State.Timelines ? "grey" : "black"}
            miw="151px"
            maw="151px"
            ta="right"
            radius="0"
            m="0"
            className={styles.stateButton}
            styles={{
              root: {
                clipPath: "polygon(0 0, 86% 0, 100% 100%, 0% 100%)",
              },
            }}
            onClick={() => {
              setMode(State.Timelines);
            }}
          >
            Timelines
          </Button>
          <Button
            miw="174px"
            maw="174px"
            ta="right"
            radius="0"
            m="0"
            className={styles.stateButton}
            styles={{
              root: {
                clipPath: "polygon(0 0, 87% 0, 87% 100%, 0% 100%)",
              },
            }}
            c="white"
            bg={mode == State.News ? "grey" : "black"}
            onClick={() => {
              setMode(State.News);
            }}
          >
            News
          </Button>
          <Button
            miw="151px"
            maw="151px"
            ta="right"
            radius="0"
            m="0"
            className={styles.stateButton}
            styles={{
              root: {
                clipPath: "polygon(0 0, 100% 0, 86% 100%, 0% 100%)",
              },
            }}
            c="white"
            bg={mode == State.Polls ? "grey" : "black"}
            onClick={() => {
              setMode(State.Polls);
            }}
          >
            Polls
          </Button>
          <Button
            c="white"
            bg="black"
            miw="130px"
            maw="130px"
            ta="right"
            m="0"
            radius="0"
            className={styles.stateButton}
            styles={{
              root: {
                clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
              },
            }}
            onClick={() => navigate("/")}
          >
            Home
          </Button>
        </Stack>
        {mode == State.Personal && <PersonalPage />}
        {mode == State.News && <NewsEditor />}
      </Flex>
    </Flex>
  );
});
