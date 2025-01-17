import { Button, createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import { RouterProvider } from "react-router";
import { router } from "./app/routes/routes";

const theme = createTheme({
  components: {
    Button: Button.extend({
      vars: () => {
        return {
          root: {
            "--button-color": "black",
            "--button-bg": "white",
            "--button-hover": "rgba(180, 180, 180, 1)",
          },
        };
      },
    }),
  },
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
