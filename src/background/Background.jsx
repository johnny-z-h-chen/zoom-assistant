import {
    create, backgroundClient, ChromeMessage
} from '../chrome';

export default class Background {
    constructor() {
        this.init();
    }

    init() {
        this.initContentMenu();
        this.initMessageClient();
    }

    // 初始化右键菜单
    initContentMenu() {
        create({
            id: 'showZoomAssistantPanel',
            title: 'Open Zoom Assistant',
            onclick: () => {
                backgroundClient.seedMessage(new ChromeMessage('show drawer'));
            }
        });
    }

    // 初始化消息通道
    initMessageClient() {
        backgroundClient.listen('test connect', (res, sendResponse) => {
            sendResponse(new ChromeMessage('connect success'));
        });
    }
}
