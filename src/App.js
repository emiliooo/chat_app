import React from 'react'
import Chatkit from '@pusher/chatkit-client'
import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import RoomList from './components/RoomList'
import NewRoomForm from './components/NewRoomForm'

import { tokenUrl, instanceLocator } from './config'

class App extends React.Component {

    constructor() {
        super()
        this.state = {
            roomId:null,
            messages:[],
            joinableRooms:[],
            joinedRooms:[]
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.subscribeToRoom = this.subscribeToRoom.bind(this)
        this.getRooms = this.getRooms.bind(this)
        this.createRoom = this.createRoom.bind(this)
    }

    componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
                instanceLocator:instanceLocator,
                userId:'emil',
                tokenProvider: new Chatkit.TokenProvider({
                    url:tokenUrl
                })
        })

        chatManager.connect()
        .then(currentUser => {
            this.currentUser = currentUser
            this.getRooms()
        })
      }

      getRooms(){
        this.currentUser.getJoinableRooms()
        .then(joinableRooms => {
            console.log(joinableRooms,'joinabkel')
        
            this.setState({
                joinableRooms,
                joinedRooms:this.currentUser.rooms

            })
        })
        .catch(err => console.log('error on jaoinableRooms', err))
      }

      subscribeToRoom(roomId) {
         this.setState({messages:[]})
        this.currentUser.subscribeToRoom({
            roomId:roomId,
            hooks: {
                onMessage: message => {
                    this.setState({
                        messages:[...this.state.messages,message]
                    })
                }
            }
          })
          .then(room => {
              this.setState({
                  roomId:room.id
              })
              this.getRooms()
          })
          .catch(err => console.log('error on subscribeToRoom', err))
      }

      sendMessage(text) {
          this.currentUser.sendMessage({
              text,
              roomId:this.state.roomId
          })
      }

      createRoom(roomName) {
        this.currentUser.createRoom({
            name: roomName,
            private: false
          }).then(room => {
            this.subscribeToRoom(room.id)
            console.log(`Created room called ${room.name}`)
          })
          .catch(err => {
            console.log(`Error creating room ${err}`)
          })
      }

    render() {
        console.log(this.state.roomId)
        return (      
            <div className="app">
                <RoomList roomId={this.state.roomId} subscribeToRoom={this.subscribeToRoom} rooms={[...this.state.joinableRooms,...this.state.joinedRooms]}/>
                <MessageList roomId={this.state.roomId} messages={this.state.messages} />
                <SendMessageForm disabled={!this.state.roomId} sendMessage={this.sendMessage} />
                <NewRoomForm createRoom={this.createRoom}/>
            </div>
        );
    }
}

export default App