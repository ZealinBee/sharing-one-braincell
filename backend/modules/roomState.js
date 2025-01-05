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
};

module.exports = RoomState;
