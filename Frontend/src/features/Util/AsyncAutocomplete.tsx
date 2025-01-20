import { useRef, useState } from "react";
import {
  Combobox,
  Loader,
  TextInput,
  useCombobox,
  Box,
  Group,
  Text,
} from "@mantine/core";
import agent from "../../app/api/agent";
import { useStore } from "../../app/stores/store";

interface EditorPageSimplifiedNews {
  id: string;
  title: string;
  createdAt: Date;
  thumbnail?: string;
}

export function AsyncAutocomplete() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const { newsEditorFormStateStore } = useStore();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EditorPageSimplifiedNews[] | null>(null);
  const [value, setValue] = useState("");
  const [empty, setEmpty] = useState(false);
  const abortController = useRef<AbortController>();

  const fetchOptions = (query: string) => {
    if (!query.trim()) {
      setData([]);
      setEmpty(true);
      setLoading(false);
      return;
    }

    abortController.current?.abort();
    abortController.current = new AbortController();
    setLoading(true);

    agent.NewsAgent.getFilteredDataForEditor(query)
      .then((result) => {
        setData(result);
        setLoading(false);
        setEmpty(result.length === 0);
        abortController.current = undefined;
      })
      .catch(() => {
        setLoading(false);
        setEmpty(true);
        setData([]);
      });
  };

  const options = (data || []).map((item) => (
    <Combobox.Option
      value={item.title}
      key={item.id}
      onClick={async () => {
        const res = await agent.NewsAgent.getSingleNews(item.id);
        newsEditorFormStateStore.setNews(res);
      }}
    >
      <Group gap="sm">
        <Box>
          <img
            src={item.thumbnail ?? "Image_unavailable.png"}
            alt={item.title}
            style={{
              width: "48px",
              height: "48px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        </Box>

        <Box>
          <Text fw={500}>{item.title}</Text>
          <Text size="sm" c="dimmed">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </Box>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setValue(optionValue);
        combobox.closeDropdown();
      }}
      withinPortal={false}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          label="Query news"
          placeholder="Search for news titles"
          value={value}
          onChange={(event) => {
            const newValue = event.currentTarget.value;
            setValue(newValue);
            fetchOptions(newValue);
            combobox.resetSelectedOption();
            if (newValue.trim()) {
              combobox.openDropdown();
            } else {
              combobox.closeDropdown();
            }
          }}
          onClick={() => value.trim() && combobox.openDropdown()}
          onFocus={() => {
            if (value.trim()) {
              combobox.openDropdown();
              if (data === null) {
                fetchOptions(value);
              }
            }
          }}
          onBlur={() => combobox.closeDropdown()}
          rightSection={loading && <Loader size={18} />}
        />
      </Combobox.Target>
      <Combobox.Dropdown hidden={data === null}>
        <Combobox.Options>
          {options}
          {empty && <Combobox.Empty>No results found</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default AsyncAutocomplete;
