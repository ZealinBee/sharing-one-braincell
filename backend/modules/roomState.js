const RoomState = {
  rooms: [],
  getAllRooms() {
    return this.rooms;
  },
  addRoom(room) {
    this.rooms.push(room);
  },
  removeRoom(roomId) {
    this.rooms = this.rooms.filter((room) => room.roomId !== roomId);
  },
  getRoom(roomId) {
    return this.rooms.find((room) => room.roomId === roomId);
  },
  updateRoom(room) {
    this.rooms = this.rooms.map((r) => {
      if (r.roomId === room.roomId) {
        return room;
      }
      return r;
    });
  },
  updateRoomGameStateById(roomId, gameState) {
    const room = this.getRoom(roomId);
    room.gameState = gameState;
    this.updateRoom(room);
  },
  removePlayerFromRoom(roomId, playerId) {
    const room = this.getRoom(roomId);
    room.players = room.players.filter((player) => player.id !== playerId);
    this.updateRoom(room);
  },
  removeRoomIfEmpty(roomId) {
    const room = this.getRoom(roomId);
    if (room.players.length === 0) {
      this.removeRoom(roomId);
    }
  },
};

module.exports = RoomState;
