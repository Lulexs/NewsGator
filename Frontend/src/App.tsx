import { Button, createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import { RouterProvider } from "react-router";
import { router } from "./app/routes/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications />
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
