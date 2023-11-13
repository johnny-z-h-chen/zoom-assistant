import React, { Component } from 'react';
import { Drawer, Button, Select } from 'antd';
import './Chatroom.scss';
import { contentClient, ChromeMessage } from '../../chrome';

export default class Chatroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageFromBg: null
        };
    }

    // Background 通讯
    async sendMsgToBackground() {
        const res = await contentClient.seedMessage(new ChromeMessage('test connect'));

        this.setState({
            messageFromBg: res.msg
        });
    }

    render() {
        return (
            <Drawer
                title="Zoom Assistant"
                getContainer={document.querySelector('#chrome-extension-content-base-element')}
                placement="right"
                closable={false}
                zIndex={1200}
                onClose={() => { this.props.onClose(); }}
                visible
            >
                <Button type="primary" onClick={() => this.sendMsgToBackground()}>
                    点击和 background 通讯
                </Button>
                <p>{this.state.messageFromBg}</p>
            </Drawer>
        );
    }
}
