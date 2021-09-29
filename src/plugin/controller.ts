import {random as randomColor} from '@ctrl/tinycolor';
import {easterEggText} from './easteregg';
import {textIcon, groupIcon, voiceIcon} from './icons';

type TextRowType = {
    frame: FrameNode;
    count: number;
};

type Theme = 'dark' | 'light';
type ChannelType = 'text' | 'voice';

const themeColorMap = {
    dark: {r: 1, g: 1, b: 1},
    light: {r: 0, g: 0, b: 0},
};

let currentSelection: any;
let theme: Theme;
let channelType: ChannelType;
let themeColors: RGB;
let totalCount: number;
let showEmbed: boolean;
let node: FrameNode | TextNode;

const defaultTheme = figma.editorType === 'figjam' ? 'light' : 'dark'

figma.showUI(__html__, {height: 378});
figma.ui.postMessage({type: 'default-theme', theme: defaultTheme});

figma.ui.onmessage = async (msg) => {
    // Tmp variables
    theme = msg.theme;
    totalCount = msg.count;
    showEmbed = msg.showEmbed;
    channelType = msg.channelType;
    themeColors = themeColorMap[theme];

    // Preload Courier
    await figma.loadFontAsync({family: 'Courier', style: 'Regular'});

    // Not sure why exactly, but it is necessary to load these both for Figma/FigJam(?)
    await figma.loadFontAsync({family: 'Inter', style: 'Medium'});
    await figma.loadFontAsync({family: 'Roboto', style: 'Regular'});

    // Store selection or currentPage
    if (figma.currentPage.selection.length !== 0) {
        const node = figma.currentPage.selection[0];
        currentSelection = node.type === 'FRAME' ? node : figma.currentPage;
    } else {
        currentSelection = figma.currentPage;
    }

    // Generate based on message type
    if (msg.type === 'create-messages') {
        node = createManyMessages();
    } else if (msg.type === 'create-server-list') {
        node = createManyServers();
    } else if (msg.type === 'create-member-list') {
        node = createManyMembers();
    } else if (msg.type === 'create-channel-list') {
        node = createManyChannels();
    } else if (msg.type === 'create-easter-egg') {
        node = createEasterEgg();

        // Focus on it
        node.x = figma.viewport.center.x - (node.width >> 1);
        node.y = figma.viewport.center.y - (node.height >> 1);

        currentSelection.appendChild(node);
        figma.viewport.scrollAndZoomIntoView([node]);

        return;
    }

    node.x = figma.viewport.center.x - (node.width >> 1);
    node.y = figma.viewport.center.y;

    currentSelection.appendChild(node);
};

const createAvatar = () => {
    const ellipse = figma.createEllipse();
    ellipse.name = 'Avatar';
    ellipse.fills = [{type: 'SOLID', color: themeColors, opacity: 0.08}];
    ellipse.resize(40, 40);

    return ellipse;
};

const createUsername = () => {
    const rect = figma.createRectangle();
    rect.name = 'Username';
    rect.cornerRadius = 50;
    rect.fills = [{type: 'SOLID', color: themeColors, opacity: 0.16}];
    rect.resize(rand(60, 128), 16);

    return rect;
};

const createEmbed = () => {
    const width = rand(140, 400);
    const height = rand(100, 240);
    const rect = figma.createRectangle();
    rect.name = 'Embed/Attachment';
    rect.cornerRadius = 8;
    rect.fills = [{type: 'SOLID', color: themeColors, opacity: 0.03}];
    rect.resize(width, height);

    return rect;
};

const createTextRow = (): TextRowType => {
    const count = rand(2, 6);

    // Create a Text Row
    const frame = figma.createFrame();
    frame.name = 'Row';
    frame.counterAxisSizingMode = 'AUTO';
    frame.fills = [];
    frame.itemSpacing = 4;
    frame.layoutMode = 'HORIZONTAL';

    for (let i = 0; i < count; i++) {
        const rect = figma.createRectangle();
        rect.cornerRadius = 8;
        rect.fills = [{type: 'SOLID', color: themeColors, opacity: 0.05}];
        rect.resize(rand(24, 80), 16);
        frame.appendChild(rect);
    }

    return {frame, count};
};

const createTextRows = () => {
    const sortArr: TextRowType[] = [];
    const rowCount = rand(1, 4);

    // Create a set of Rows
    const frame = figma.createFrame();
    frame.name = 'Text';
    frame.counterAxisSizingMode = 'AUTO';
    frame.fills = [];
    frame.itemSpacing = 6;
    frame.layoutMode = 'VERTICAL';

    // add username first
    frame.appendChild(createUsername());

    // Create a set of Text rows
    for (let i = 0; i < rowCount; i++) {
        const row = createTextRow();
        sortArr.push(row);
    }

    // Sort them so that they are in length/count order
    const sortedRows = sortArr.sort(sortTextRows);
    sortedRows.map((row) => {
        frame.appendChild(row.frame);
    });

    // if showEmbed is enabled
    if (showEmbed) {
        const embed = createEmbed();
        frame.appendChild(embed);
    }

    return frame;
};

const createSingleMessage = () => {
    const frame = figma.createFrame();
    frame.name = 'Message';
    frame.counterAxisSizingMode = 'AUTO';
    frame.fills = [];
    frame.itemSpacing = 16;
    frame.layoutMode = 'HORIZONTAL';

    const avatar = createAvatar();
    const texts = createTextRows();

    frame.appendChild(avatar);
    frame.appendChild(texts);

    return frame;
};

const createManyMessages = () => {
    const frame = figma.createFrame();
    frame.name = 'Messages';
    frame.counterAxisSizingMode = 'AUTO';
    frame.fills = [];
    frame.itemSpacing = 24;
    frame.layoutMode = 'VERTICAL';

    // Create a set of Messages
    for (let i = 0; i < totalCount; i++) {
        frame.appendChild(createSingleMessage());
    }

    return frame;
};

const createSingleServer = () => {
    const rect = figma.createRectangle();
    rect.name = 'Server';
    rect.cornerRadius = 50;
    rect.fills = [{type: 'SOLID', color: getRandServerColor(), opacity: 1}];
    rect.resize(48, 48);

    return rect;
};

const createManyServers = () => {
    const frame = figma.createFrame();
    frame.name = 'Servers';
    frame.counterAxisSizingMode = 'AUTO';
    frame.fills = [];
    frame.itemSpacing = 8;
    frame.layoutMode = 'VERTICAL';

    // Create a set of Messages
    for (let i = 0; i < totalCount; i++) {
        frame.appendChild(createSingleServer());
    }

    return frame;
};

const createSingleMember = () => {
    const frame = figma.createFrame();
    frame.name = 'Member';
    frame.counterAxisSizingMode = 'AUTO';
    frame.counterAxisAlignItems = 'CENTER';
    frame.fills = [];
    frame.itemSpacing = 12;
    frame.layoutMode = 'HORIZONTAL';

    const avatar = createAvatar();
    avatar.resize(32, 32);

    const username = createUsername();

    frame.appendChild(avatar);
    frame.appendChild(username);

    return frame;
};

const createManyMembers = () => {
    const frame = figma.createFrame();
    frame.name = 'Members';
    frame.counterAxisSizingMode = 'AUTO';
    frame.fills = [];
    frame.itemSpacing = 8;
    frame.layoutMode = 'VERTICAL';

    // Create a set of Messages
    for (let i = 0; i < totalCount; i++) {
        frame.appendChild(createSingleMember());
    }

    return frame;
};

const createSingleChannel = () => {
    const frame = figma.createFrame();
    frame.name = 'Channel';
    frame.counterAxisSizingMode = 'AUTO';
    frame.counterAxisAlignItems = 'CENTER';
    frame.fills = [];
    frame.itemSpacing = 8;
    frame.layoutMode = 'HORIZONTAL';
    frame.paddingLeft = 16;

    const icon = figma.createNodeFromSvg(channelType === 'text' ? textIcon : voiceIcon);
    const username = createUsername();
    username.fills = [{type: 'SOLID', color: themeColors, opacity: 0.09}]; // overwrite opacity

    frame.appendChild(icon);
    frame.appendChild(username);

    return frame;
};

const createSingleChannelGroup = () => {
    const frame = figma.createFrame();
    frame.name = 'Channel Group';
    frame.counterAxisSizingMode = 'AUTO';
    frame.counterAxisAlignItems = 'CENTER';
    frame.fills = [];
    frame.itemSpacing = 8;
    frame.layoutMode = 'HORIZONTAL';

    const icon = figma.createNodeFromSvg(groupIcon);
    const channelName = createUsername();
    channelName.name = 'Channel Name';

    frame.appendChild(icon);
    frame.appendChild(channelName);

    return frame;
};

const createManyChannels = () => {
    const frame = figma.createFrame();
    frame.name = 'Channels';
    frame.counterAxisSizingMode = 'AUTO';
    frame.fills = [];
    frame.itemSpacing = 16;
    frame.layoutMode = 'VERTICAL';

    // Create a Channel Group
    const channelGroup = createSingleChannelGroup();
    frame.appendChild(channelGroup);

    // Create a set of Channels, indented from the left
    for (let i = 0; i < totalCount; i++) {
        frame.appendChild(createSingleChannel());
    }

    return frame;
};

const createEasterEgg = () => {
    const text = figma.createText();
    text.name = 'Skeleton Easter Egg';
    text.fontSize = 16;
    text.fontName = {family: 'Courier', style: 'Regular'};
    text.characters = easterEggText;
    text.fills = [{type: 'SOLID', color: themeColors, opacity: 1}];

    return text;
};

const getRandServerColor = () => {
    const pastelColor = randomColor().saturate(20).mix('#808080').toRgb();
    delete pastelColor.a; // remove alpha

    // map from 0-255 to 0-1 for Figma
    return {
        r: mapValues(pastelColor.r, 0, 255, 0, 1),
        g: mapValues(pastelColor.g, 0, 255, 0, 1),
        b: mapValues(pastelColor.b, 0, 255, 0, 1),
    };
};

const rand = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const sortTextRows = (a: TextRowType, b: TextRowType) => {
    return a.count < b.count ? 1 : -1;
};

const mapValues = (value: number, x1: number, y1: number, x2: number, y2: number) => {
    return ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
};
