import {
  Box,
  Button,
  CheckIcon,
  Container,
  Flex,
  Modal,
  Stack,
  Tabs,
  Text,
  Title,
  Input,
  Select
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Card from "~/components/Card";
import css from "./Delegate.module.scss";

function InfoEntry({ heading, content }: { heading: string; content: string }) {
  return (
    <Flex gap="md" align="flex-start">
      <Flex style={{ border: "1px solid rgba(255, 255, 255, .25)", padding: 8, borderRadius: 6 }}>
        <CheckIcon size={16} />
      </Flex>
      <Box>
        <Title order={5} c="white">
          {heading}
        </Title>
        <Text size="md" lh={1.3} mt="2">
          {content}
        </Text>
      </Box>
    </Flex>
  );
}

export default function Delegate() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Container size="30rem" pb="5rem">
      <Stack gap="lg">
        <Title order={2} fw="bold" c="white">
          Stake for Sustainability
        </Title>

        <Card>
          <Title order={5} mb="sm" c="white">
            Your total deposited voting allocation
          </Title>

          <Flex>
            <Title mr="auto" order={6}>
              Your B3TR
            </Title>
            <Text size="sm">1</Text>
          </Flex>
          <Flex justify="space-between" mt="4">
            <Title order={6}>Your VOT3</Title>
            <Text size="sm">3</Text>
          </Flex>
          <Flex>
            <Title mr="auto" order={6}>
              Your Delegated VOT3
            </Title>
            <Text size="sm">1</Text>
          </Flex>

          <Button fullWidth size="md" my="md" radius="md" onClick={open}>
            Deposit
          </Button>

          <Modal
            opened={opened}
            onClose={close}
            centered
            closeOnEscape={false}
            closeOnClickOutside={false}
            radius="md"
            size="sm"
            styles={{
              header: { paddingTop: 0, paddingBottom: 0, minHeight: "3rem" }
            }}
          >
            <Tabs defaultValue="deposit">
              <Tabs.List justify="center" grow>
                <Tabs.Tab value="deposit" fw="600">
                  Deposit
                </Tabs.Tab>
                <Tabs.Tab value="withdraw" fw="600">
                  Withdraw
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="deposit">
                <Stack pt="sm" pb="xs">
                  <Input.Wrapper label="Amount">
                    <Input placeholder="0" radius="lg" />
                  </Input.Wrapper>
                  <Select
                    label="Token"
                    data={["B3TR", "VOT3", "B3TR + VOT3"]}
                    defaultValue="B3TR"
                    description="You have 1.00 B3TR + VOT3"
                    radius="lg"
                  />
                  <Button size="md" radius="md">
                    Deposit
                  </Button>
                </Stack>
              </Tabs.Panel>
              <Tabs.Panel value="withdraw">
                <Stack pt="sm" pb="xs">
                  <Input.Wrapper label="Amount">
                    <Input placeholder="0" radius="lg" />
                  </Input.Wrapper>
                  <Select
                    label="Token"
                    data={["B3TR", "VOT3", "B3TR + VOT3"]}
                    defaultValue="B3TR"
                    description="You have 1.00 B3TR + VOT3"
                    radius="lg"
                  />
                  <Button size="md" radius="md">
                    Withdraw
                  </Button>
                </Stack>
              </Tabs.Panel>
            </Tabs>

            <Text size="xs">
              Your new deposit will earn rewards in the next voting round, starting on 2024-09-30.
              Rewards are claimable when the next voting round ends on 2024-10-07.
            </Text>
          </Modal>

          <div className={css.twoColumnGrid}>
            <Card.Pane>
              <Title order={6} mb="xs">
                Total Earned (B3TR)
              </Title>
              <strong className={css.number}>100.00</strong>
            </Card.Pane>
            <Card.Pane>
              <Title order={6} mb="xs">
                Current Annual Yield
              </Title>
              <strong className={css.number}>
                12.42 <i>%</i>
              </strong>
            </Card.Pane>
          </div>
        </Card>

        <Card>
          <Stack gap="sm">
            <Flex align="center" justify="space-between">
              <Title order={6} c="white">
                Assets under Management
              </Title>
              <Text size="sm">1,000,000 VOT3</Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Title order={6} c="white">
                Accounts under Management
              </Title>
              <Text size="sm">3,757</Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Title order={6} c="white">
                Platform Fees
              </Title>
              <Text size="sm">10% of Rewards</Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Title order={6} c="white">
                Last Updated
              </Title>
              <Text size="sm">less than a minute ago</Text>
            </Flex>
          </Stack>
        </Card>

        <Card>
          <Stack gap="lg">
            <InfoEntry
              heading="Effortless Voting Rewards:"
              content="Maximize voting rewards through strategic, preference-based voting and pooled staking."
            />
            <InfoEntry
              heading="Enhanced Rewards with NFTs:"
              content="Access higher reward rates with exclusive NFT boosts like the GM NFT."
            />
            <InfoEntry
              heading="Hands-Free Experience:"
              content="Set preferences once and let VeStation Delegate handle the weekly voting and reward management for you."
            />
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
