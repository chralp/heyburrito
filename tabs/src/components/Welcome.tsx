import { Flex, Header } from "@fluentui/react-northstar";
import "./Welcome.css";

import { useGraph } from "./lib/useGraph";
import { ProfileCard } from "./ProfileCard";

const fakeData = [
  {
    displayName: "Anish Chandwani",
    score: 5,
    self: true,
  },
  {
    displayName: "Test user 1",
    score: 1,
  },
  {
    displayName: "Awesome user 1",
    score: 51,
  },
];

export function Welcome(props: { environment?: string }) {
  const { data } = useGraph(
    async (graph) => {
      // const data = await new Promise((resolve) => {
      //   microsoftTeams.initialize();
      //   microsoftTeams.getContext(async (context) => {
      //     resolve({ foo: "foobar" });
      //     const members = await graph
      //       .api(`/groups/${context.groupId}/members`)
      //       .get();

      //     let scope: ScoreBoardRequestScope | undefined;
      //     let id: string | undefined;
      //     if (context.teamId) {
      //       scope = "team";
      //       id = context.teamId;
      //     } else if (context.channelId) {
      //       scope = "channel";
      //       id = context.channelId;
      //     } else if (context.chatId) {
      //       scope = "chat";
      //       id = context.chatId;
      //     } else {
      //       scope = "global";
      //       id = "";
      //     }

      //     const data = await getScoreboard({ context: { scope, id } });

      //     resolve(data);
      //   });
      // });

      // return data;
      return fakeData;
    },
    { scope: ["User.Read"] }
  );

  return (
    <div className="welcome page">
      <div className="narrow page-padding">
        <Flex column hAlign={"center"}>
          <Header>🍩 HeyDonut! Leaderboard 🍩</Header>
          <Flex column>
            {data?.map(({ displayName, self, score }) => (
              <ProfileCard
                displayName={displayName}
                self={self}
                score={score}
              />
            ))}
          </Flex>
        </Flex>
      </div>
    </div>
  );
}
