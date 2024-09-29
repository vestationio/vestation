import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CheckIcon,
  Container,
  Divider,
  Flex,
  Modal,
  Stack,
  Tabs,
  Text,
  Title,
  Input,
  Select,
  Switch,
  Tooltip
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Card from "~/components/Card";
import css from "./Delegate.module.scss";

import { IconAlertHexagon } from "@tabler/icons-react";

function InfoEntry() {
  return (
    <Flex gap="md" align="flex-start">
      <Flex style={{ border: "1px solid rgba(255, 255, 255, .25)", padding: 8, borderRadius: 6 }}>
        <CheckIcon size={16} />
      </Flex>
      <Box>
        <Title order={5} c="white">
          Heading
        </Title>
        <Text size="md" lh={1.3} mt="2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis amet rerum aperiam iure
          voluptatem odit cum fuga veniam dignissimos animi!
        </Text>
      </Box>
    </Flex>
  );
}

function BalanceEntry() {
  return (
    <Flex gap="sm" align="center">
      <Flex
        style={{ border: "1px solid rgba(255, 255, 255, .25)", padding: 8, borderRadius: "50%" }}
      >
        <CheckIcon size={16} />
      </Flex>
      <Box>
        <Title order={6} c="white">
          Delegate Votes Changed
        </Title>
        <Text size="sm" lh={1.3} mt="2">
          by 0x1234...abcd
        </Text>
      </Box>
      <Box ml="auto">
        <Title order={6} c="white">
          -1.00 VOT3
        </Title>
        <Text size="sm" lh={1.3} mt="2" ta="right">
          3 days ago
        </Text>
      </Box>
    </Flex>
  );
}

export default function Delegate() {
  const [opened, { open, close }] = useDisclosure(false);
  const [firstChecked, setFirstChecked] = useState(false);
  const [secondChecked, setSecondChecked] = useState(true);

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

          <Button fullWidth size="md" mt="md" mb="xs" radius="md" onClick={open}>
            Stake
          </Button>

          <Tooltip
            label="veDelegate covers all gas fees for the weekly automation. A minimum of 50.00 VOT3 ensures we can pay for gas from your rewards.
"
          >
            <Alert
              variant="light"
              color="red"
              icon={<IconAlertHexagon />}
              p="sm"
              mb="md"
              radius="md"
            >
              A minimum stake of 50.00 VOT3 is required.
            </Alert>
          </Tooltip>

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
                  <Switch
                    checked={firstChecked}
                    label="Auto-Deposit B3TR in the feature"
                    onChange={(e) => setFirstChecked(e.currentTarget.checked)}
                  />
                  <Switch
                    checked={secondChecked}
                    label="Proposal Delegation"
                    onChange={(e) => setSecondChecked(e.currentTarget.checked)}
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
                  <Switch
                    checked={firstChecked}
                    label="Auto-Deposit B3TR in the feature"
                    onChange={(e) => setFirstChecked(e.currentTarget.checked)}
                  />
                  <Switch
                    checked={secondChecked}
                    label="Proposal Delegation"
                    onChange={(e) => setSecondChecked(e.currentTarget.checked)}
                  />
                  <Button size="md" radius="md">
                    Withdraw
                  </Button>
                </Stack>
              </Tabs.Panel>
            </Tabs>
            <Tooltip
              label="veDelegate covers all gas fees for the weekly automation. A minimum of 50.00 VOT3 ensures we can pay for gas from your rewards.
"
            >
              <Alert
                variant="light"
                color="red"
                icon={<IconAlertHexagon />}
                p="sm"
                mb="md"
                radius="md"
              >
                A minimum stake of 50.00 VOT3 is required.
              </Alert>
            </Tooltip>

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
              <strong className={css.number}>12.42%</strong>
            </Card.Pane>
          </div>
        </Card>

        <Card>
          <BalanceEntry />
          <Divider my="sm" />
          <BalanceEntry />
          <Divider my="sm" />
          <BalanceEntry />
          <Divider mt="sm" mb="md" />
          <Flex justify="space-between">
            <Button size="xs" variant="outline" opacity={0.6}>
              Preview
            </Button>
            <Button size="xs" variant="outline" opacity={0.6}>
              Next
            </Button>
          </Flex>
        </Card>

        <Card>
          <Stack gap="lg">
            <InfoEntry />
            <InfoEntry />
            <InfoEntry />
            <InfoEntry />
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
