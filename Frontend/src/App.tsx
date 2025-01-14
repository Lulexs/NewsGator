import { MantineProvider } from "@mantine/core";
import ImageEditor from "./ImageEditor/ImageEditor";
import "@mantine/core/styles.css";

function App() {
  return (
    <MantineProvider>
      <ImageEditor />
    </MantineProvider>
  );
}

export default App;
