import {ChakraProvider} from '@chakra-ui/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';
import theme from './theme';

ReactDOM.render(
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>,
    document.getElementById('react-page')
);
