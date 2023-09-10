// Interfaces
export interface IUser {
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  chatData: IMessage[];
}

export interface IMessage {
  id: number;
  text: string;
  sender: string;
  receiver: string;
  timestamp: string;
  chatName: string;
}

export interface UserData {
  name: string;
  location: UserLocation;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface ILocation {
  latitude: number;
  longitude: number;
}
