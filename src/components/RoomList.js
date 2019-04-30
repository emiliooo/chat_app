import React from 'react'

 class RoomList extends React.Component {
  render() {
    const orderedRooms = [...this.props.rooms].sort((a,b) => b.id - a.id)
    return (
      <div className="room-list">
      <ul>    
      <h3>Your rooms:</h3>
        {orderedRooms.map(room => {
          const active = this.props.roomId === room.id? "active" : "";
          console.log(active)
          return (
            <li key={room.id} className={"room"+ active}> 
                  <a 
                  onClick={() => this.props.subscribeToRoom(room.id)}
                  href="#">
                   {room.name} 
                  </a>
            </li>
          )
        })}

      </ul>
        
      </div>
    )
  }
}

export default RoomList