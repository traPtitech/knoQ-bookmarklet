export type Room = {
  place: string;
  timeStart: Date;
  timeEnd: Date;
};

export function extractRooms(): Room[] {
  return [
    {
      place: 'S512',
      timeStart: new Date(),
      timeEnd: new Date(),
    },
  ];
}
