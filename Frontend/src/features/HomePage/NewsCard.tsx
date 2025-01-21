import { Card, Image, Text, Tooltip } from "@mantine/core";
import { useState } from "react";

const NewsCard = ({ news }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      shadow={isHovered ? "lg" : "sm"}
      padding="md"
      radius="md"
      withBorder
      style={{
        width: 300,
        height: 320,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transform: isHovered ? "translateY(-4px) scale(1.02)" : "none",
        transition: "all 200ms ease",
        backgroundColor: isHovered ? "var(--mantine-color-gray-0)" : "white",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card.Section>
        <Image
          src={news.thumbnail ?? "Image_unavailable.png"}
          height={200}
          fit="cover"
          alt={news.title}
        />
      </Card.Section>

      <Tooltip label={news.title} multiline w={300} position="bottom" withArrow>
        <Text fw={500} size="lg" mt="md" lineClamp={2} style={{ flexGrow: 1 }}>
          {news.title}
        </Text>
      </Tooltip>

      <Text c="dimmed" size="sm" mt="sm">
        {new Date(news.createdAt).toLocaleDateString()}
      </Text>
    </Card>
  );
};

export default NewsCard;
