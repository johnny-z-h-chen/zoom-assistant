import React, { Component } from 'react';
import { Drawer, Button, Input, Tooltip } from 'antd';
import './Chatroom.scss';
import { contentClient, ChromeMessage } from '../../chrome';
import Message from '../Message/Message';
import { SendOutlined } from '@ant-design/icons';
import { Lights } from '../Icon';
import _ from 'lodash';

export default class Chatroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageFromBg: null,
            targetMessage: [
                {
                    userName: "Speaker",
                    content: "Hello, this is the HSBC comany Hello, this is the HSBC comany Hello, this is the HSBC comany"
                },{
                    userName: "Speaker",
                    content: "Hello, this is the HSBC comany Hello, this is the HSBC comany Hello, this is the HSBC comany"
                },{
                    userName: "AI Assistant",
                    content: "Hello, this is the HSBC comany Hello, this is the HSBC comany Hello, this is the HSBC comany",
                    icon: Lights,
                    color: '#e52c26'
                }
            ],
            messageList: [
            ],
            isSpeaking: false,
            isRecording: false,
            mediaRecorder: null,
            timerInterval: null,
            audioPlayerUrl: null,
            analyser: null,
            audioChunks: [],
            speakingLevel: 5,
            messageContainerRef: null
        };
    }

    // Background 通讯
    async sendMsgToBackground() {
        const res = await contentClient.seedMessage(new ChromeMessage('test connect'));

        this.setState({
            messageFromBg: res.msg
        });
    }

    loadingMessage = () => {
        const { messageList, messageContainerRef } = this.state;

        return <div className='message-queue-panel'>
            {
                messageList.map((currenntMessage, index) => {
                    return <Message userName={currenntMessage.userName} 
                        key={index}
                        content={currenntMessage.content} 
                        loading={currenntMessage.loading}
                        color={currenntMessage.color}
                        icon={currenntMessage.icon} />
                })
            }

            <div ref={messageContainerRef}></div>
        </div>
    }

    debounceRefreshMessageList = _.debounce(() => {
        this.refreshMessageList();
    }, 1.5 * 1000);

    async componentDidMount() {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new window.AudioContext();
        const audioSource = audioContext.createMediaStreamSource(audioStream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;

        // connect the analyser
        audioSource.connect(analyser);

        const mimeTypes = ["audio/mp4", "audio/webm"].filter((type) =>
            MediaRecorder.isTypeSupported(type)
        );

        this.setState({
            analyser: analyser,
            mediaRecorder: new MediaRecorder(audioStream, { mimeType: mimeTypes[0] }),
            messageContainerRef: React.createRef()
        })
    }

    refreshMessageList = () => {
        const { messageList, targetMessage, messageContainerRef } = this.state;
        messageList.push(targetMessage[0]);

        this.setState({
            messageList: messageList
        }, () => {
            messageContainerRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            })
        })
    }

    /**
     * start recording
     */
    startRecording =  async () => {
        try {
            const { mediaRecorder } = this.state;
            let targetAudioChunks = [];

            this.setState({
                isRecording: true
            });

            const detectSpeech = () => {
                const { analyser, speakingLevel } = this.state;

                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(dataArray);
                const level = dataArray.reduce((acc, curr) => acc + curr) / dataArray.length;

                const speakingNow = level > speakingLevel;

                this.setState({
                    isSpeaking: speakingNow
                })
                
                if (speakingNow == true) {
                    this.debounceRefreshMessageList();
                }
            }

            this.setState({
                timerInterval: setInterval(() => {
                    detectSpeech();
                }, 500)
            });

            // mediaRecorder.addEventListener("dataavailable", async (event) => {
            //     if (event.data.size > 0) {
            //         targetAudioChunks.push(event.data);
            //         this.setState({
            //             audioChunks: targetAudioChunks
            //         })
            //     }
            // });

            mediaRecorder.start(500);
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    }

    /**
     * store recordinng
     */
    stopRecording = () => {
        const { timerInterval, mediaRecorder, audioChunks } = this.state;

        clearInterval(timerInterval);

        // mediaRecorder.addEventListener("stop", () => {
        //     const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        //     const audioURL = URL.createObjectURL(audioBlob);
        //     this.setState({
        //         audioPlayerUrl: audioURL
        //     }, () => {
        //         console.log(this.state.audioPlayerUrl)
        //     })
        // })

        mediaRecorder.stop();

        this.setState({
            isRecording: false,
            isSpeaking: false
        })
    };

    renderTitle = () => {
        const {isSpeaking } = this.state;

        return `AI Assistant ${ isSpeaking == true ? " (speaking)" : "" }`
    }

    render() {
        const { isRecording } = this.state;
        
        return (
            <Drawer
                title={ this.renderTitle() }
                getContainer={document.querySelector('#chrome-extension-content-base-element')}
                placement="right"
                closable={false}
                zIndex={1200}
                onClose={() => { this.props.onClose(); }}
                visible
            >
                <div className="chat-panel">
                    { this.loadingMessage() }
                    <div className='submit-panel'>
                        <Input.Group compact>
                            <Input
                                size="large"
                                style={{ width: '100%' }}
                                suffix={
                                    <SendOutlined style={{ color: '#e52c26' }} />
                                }
                                placeholder={"Ask the question to AI assistant"}
                            />
                        </Input.Group>
                        <Button
                            size="large"
                            type="primary"
                            block={true}
                            onClick={() => { isRecording == false ? this.startRecording() : this.stopRecording() }}
                        >
                           { isRecording == true ? "Stop Recordinng" : "Start Recordinng" }
                        </Button>
                    </div>  
                </div>
            </Drawer>
        );
    }
}
