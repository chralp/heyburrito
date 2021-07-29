import React from "react";
import {
  Avatar,
  Card,
  Flex,
  FlexItem,
  Skeleton,
  Text,
} from "@fluentui/react-northstar";
import { useGraph } from "./lib/useGraph";

export const ProfileCard = ({
  score,
  self,
  displayName,
}: {
  score?: number;
  self?: boolean;
  displayName?: string;
}) => {
  const { loading, data } = useGraph(
    async (graph) => {
      if (self) {
        const profile = await graph.api("/me").get();
        let photoUrl = "";
        try {
          const photo = await graph.api("/me/photo/$value").get();
          photoUrl = URL.createObjectURL(photo);
        } catch {
          // Could not fetch photo from user's profile, return empty string as placeholder.
        }
        return { profile, photoUrl };
      }
    },
    { scope: ["User.Read"] }
  );

  return (
    <Card
      aria-roledescription="card avatar"
      elevated
      inverted
      styles={{ height: "max-content", margin: "0.5em 0" }}
    >
      <Card.Header styles={{ "margin-bottom": "0" }}>
        {loading && (
          <Skeleton animation="wave">
            <Flex gap="gap.medium">
              <Skeleton.Avatar size="larger" />
              <div>
                <Skeleton.Line width="100px" />
                <Skeleton.Line width="150px" />
              </div>
            </Flex>
          </Skeleton>
        )}
        {!loading && (
          <Flex gap="gap.medium">
            {data?.photoUrl ? (
              <Avatar size="medium" image={data.photoUrl} name={displayName} />
            ) : (
              <Skeleton.Avatar size="medium" />
            )}{" "}
            <Text content={displayName} weight="bold" />
            <FlexItem push>
              <Text content={score} weight="bold" />
            </FlexItem>
          </Flex>
        )}
      </Card.Header>
    </Card>
  );
};
