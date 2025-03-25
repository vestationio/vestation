import { useMemo } from "react";
import { useWallet } from "@vechain/dapp-kit-react";
import { Tabs, Table, Container, Text } from "@mantine/core";
import { totalPoints, weeklyPoints, pointsLog } from "./points";

export default function Leaderboard() {
  const { account } = useWallet();

  const lastWeekDates = useMemo(() => {
    const today = new Date();
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - today.getDay() - 6);

    const lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    };

    return {
      start: formatDate(lastMonday),
      end: formatDate(lastSunday)
    };
  }, []);

  const myPoints = useMemo(() => {
    if (!account) return [];
    return pointsLog[account?.toLowerCase()] || [];
  }, [account]);

  return (
    <Container size="36rem" pb="5rem">
      <Tabs defaultValue="total">
        <Tabs.List mb="lg">
          <Tabs.Tab value="total" fw="600">
            Total Points
          </Tabs.Tab>
          <Tabs.Tab value="weekly" fw="600">
            Weekly Points
          </Tabs.Tab>
          <Tabs.Tab value="mine" fw="600">
            My Points
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="total">
          <Table ff="monospace">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Rank</Table.Th>
                <Table.Th>Address</Table.Th>
                <Table.Th ta="right">Points</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {totalPoints.map((i, idx) => (
                <Table.Tr key={`total-${idx}`}>
                  <Table.Td>{idx + 1}</Table.Td>
                  <Table.Td>{i.account}</Table.Td>
                  <Table.Td ta="right">{i.points}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>
        <Tabs.Panel value="weekly">
          <Table ff="monospace">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Rank</Table.Th>
                <Table.Th>Address</Table.Th>
                <Table.Th ta="right">Points</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {weeklyPoints.map((i, idx) => (
                <Table.Tr key={`weekly-${idx}`}>
                  <Table.Td>{idx + 1}</Table.Td>
                  <Table.Td>{i.account}</Table.Td>
                  <Table.Td ta="right">{i.points}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>
        <Tabs.Panel value="mine">
          {!!myPoints.length ? (
            <Table ff="monospace">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Round</Table.Th>
                  <Table.Th>Week Points</Table.Th>
                  <Table.Th ta="right">Total Points</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {myPoints.map((i: any, idx: number) => (
                  <Table.Tr key={`mine-${idx}`}>
                    <Table.Td>Round {36 + i.weekIndex}</Table.Td>
                    <Table.Td>{i.weekPoints}</Table.Td>
                    <Table.Td ta="right">{i.totalPoints}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Text>No point records for this account.</Text>
          )}
        </Tabs.Panel>
      </Tabs>

      <Text mt="lg" fs="italic">
        * Last updated on {lastWeekDates.end}
      </Text>
    </Container>
  );
}
