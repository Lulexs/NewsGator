import { observer } from "mobx-react-lite";
import Header from "../Header/Header";
import { Flex } from "@mantine/core";

export default observer(function HomePage() {
  return (
    <Flex>
      <Header />
    </Flex>
  );
});
