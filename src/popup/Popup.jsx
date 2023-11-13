import React, { Component } from 'react';
import {
    Form, Image, Button, Input, Select
} from 'antd';
import './Popup.scss';
import { go } from '../chrome';

export default class Popup extends Component {

    state = {
        name: WRAPPER_CLASS_NAME,
        supportLanguage: [
            {
                label: "en-US",
                value: "en-US"
            },
            {
                label: "zh-CN",
                value: "zh-CN"
            },
            {
                label: "zh-HK",
                value: "zh-HK"
            }
        ],
        promptList: [
            {
                label: "Financial Analyst",
                value: "1"
            },
            {
                label: "Market Analyst",
                value: "2"
            }
        ]
    }

    gotoPage() {
        go('../html/view.html');
    }

    // 94854465983
    startMeetinng(value) {
        const { meetingInvitationUrl } = value;
        go(meetingInvitationUrl);
    }

    render() {
        const { supportLanguage, promptList } = this.state

        return (
            <div className={`${WRAPPER_CLASS_NAME}`}>
                <div className='main-panel'>
                    <div className='logo-panel'>
                        <Image
                            preview={false}
                            width={136}
                            src="data:image/png;base64,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"
                        />
                    </div>
                    <div>
                        <Form
                            layout="Vertical"
                            name="meetingRecordForm"
                            onFinish={this.startMeetinng}
                            initialValues={{
                                sourceLanguage: ['en-US'],
                                translateLanguage: ['zh-HK'],
                                promptId: ["1"]
                            }}
                        >
                            <Form.Item
                                label="Meeting Invitation"
                                name="meetingInvitationUrl"
                                rules={[{ required: true, message: 'Please innput the meeting invitation!' }]}
                            >
                                <Input
                                    size="large"
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder="Please innput the meeting invitation"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Meeting Language"
                                name="sourceLanguage"
                                rules={[{ required: true, message: 'Please select the meeting language!' }]}
                            >
                                <Select
                                    size="large"
                                    allowClear
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder="Please select the meeting language"
                                    options={supportLanguage}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Translate Language"
                                name="translateLanguage"
                                rules={[{ required: true, message: 'Please select the translate language' }]}
                            >
                                <Select
                                    size="large"
                                    allowClear
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder="Please select the translate language"
                                    options={supportLanguage}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Role Select"
                                name="promptId"
                                rules={[{ required: true, message: 'Please select the role' }]}
                            >
                                <Select
                                    size="large"
                                    allowClear
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder="Please select the role"
                                    options={promptList}
                                />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: '0px' }}>
                                <Button
                                    size="large"
                                    type="primary"
                                    block={true}
                                    htmlType="submit"
                                    className="form-button"
                                >
                                    Join Meeting
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}
