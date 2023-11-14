import React from 'react';
import { render } from 'react-dom';
import { contentClient } from '../chrome';
import './ContentScripts.scss';
import { Chatroom } from './Chatroom';

export default class ContentScripts {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // 注意，必须设置了run_at=document_start 此段代码才会生效
        document.addEventListener('DOMContentLoaded', () => {
            this.initContainer();
            this.initMessageClient();
        });
    }

    // 初始化消息通道
    initMessageClient() {
        const { container } = this;

        contentClient.listen('show drawer', () => {
            this.showContainer();

            render(
                <Chatroom onClose={() => { this.hideContainer(); }} />,
                container
            );
        });
    }

    initContainer() {
        const { document } = window;
        const base = document.querySelector("#chrome-extension-content-base-elemen");
        if (base) {
            this.container = base;
        }else { 
            this.container = document.createElement('div');
            this.container.setAttribute('id', 'chrome-extension-content-base-element');
            this.container.setAttribute('class', WRAPPER_CLASS_NAME);
            document.body.appendChild(this.container);
        }
    }

    showContainer() {
        this.container.setAttribute('style', 'display: block');
    }

    hideContainer() {
        this.container.setAttribute('style', 'display: none');
    }
}
