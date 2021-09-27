import * as React from 'react';

import {Button} from '@chakra-ui/button';
import {Checkbox} from '@chakra-ui/checkbox';
import {Divider, Flex, Stack, VStack} from '@chakra-ui/layout';
import {
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from '@chakra-ui/number-input';
import {Radio, RadioGroup} from '@chakra-ui/radio';
import {Select} from '@chakra-ui/select';
import {FormControl, FormLabel} from '@chakra-ui/form-control';

const App = ({}) => {
    const [msgType, setMsgType] = React.useState('messages');
    const [theme, setTheme] = React.useState('dark');
    const [count, setCount] = React.useState(3);
    const [showEmbed, setShowEmbed] = React.useState(false);

    const onCreate = () => {
        switch (msgType) {
            case 'messages':
                parent.postMessage({pluginMessage: {type: 'create-messages', count, theme, showEmbed}}, '*');
                break;
            case 'server-list':
                parent.postMessage({pluginMessage: {type: 'create-server-list', count, theme}}, '*');
                break;
            case 'member-list':
                parent.postMessage({pluginMessage: {type: 'create-member-list', count, theme}}, '*');
                break;
        }
    };

    return (
        <Flex w="100%" h="100%" p={4}>
            <VStack w="100%" spacing={6} align="stretch">
                <FormControl>
                    <FormLabel>Type</FormLabel>
                    <Select
                        size="sm"
                        onChange={(e) => {
                            setMsgType(e.target.value);
                        }}
                    >
                        <option value="messages" defaultChecked>
                            Messages
                        </option>
                        <option value="server-list">Server List</option>
                        <option value="member-list">Member List</option>
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel>Theme</FormLabel>
                    <RadioGroup onChange={setTheme} value={theme} size="md">
                        <Stack direction="row">
                            <Radio value="dark">Dark</Radio>
                            <Radio value="light">Light</Radio>
                        </Stack>
                    </RadioGroup>
                </FormControl>

                <Divider />

                <FormControl>
                    <FormLabel>Number to generate</FormLabel>
                    <NumberInput
                        min={1}
                        max={25}
                        size="sm"
                        value={count}
                        onChange={(_, valueAsNumber) => setCount(valueAsNumber)}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>

                <Checkbox
                    isChecked={msgType === 'messages' ? showEmbed : false}
                    isDisabled={msgType !== 'messages'}
                    onChange={(e) => setShowEmbed(e.target.checked)}
                >
                    Include Message Embeds
                </Checkbox>

                <Button onClick={onCreate}>Generate</Button>
            </VStack>
        </Flex>
    );
};

export default App;