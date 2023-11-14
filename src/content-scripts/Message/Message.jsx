import React, { Component } from 'react';
import { Avatar, Card, Skeleton, Switch } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import './Message.scss';
const { Meta } = Card;

export default class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    renderUserAvatar = () => {
      const { icon, color } = this.props;

      return <Avatar
        style={{
          backgroundColor: color == undefined ? '#87d068' : color
        }}
        icon={
          icon == undefined ? <UserOutlined /> : <Icon
            className="message-user-avatar-icon"
            component={icon}
          />
        }
      />
    }

    render() {
      const { loading = false, userName, content, color = "#87d068" } = this.props;
      
      return (
        <div className='message-panel'>
          <Card>
            <Skeleton loading={loading} avatar active>
              <Meta
                avatar={ this.renderUserAvatar() }
                title={ userName }
                description={ content }
              />
            </Skeleton>
          </Card>
        </div>
      );
    }
}
