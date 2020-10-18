export interface TypeDef {
    id: string;
}

export interface UserClub {
    manager: ClubTypeDef[];
    member: ClubTypeDef[];
}

export interface FriendRequests {
    inbox: UserTypeDef[];
    sent: UserTypeDef[];
}

export interface UserTypeDef extends TypeDef {
    name: string;
    username: string;
    email: string;
    dives: DiveTypeDef[];
    clubs: UserClub;
    gear: GearTypeDef[];
    friends: UserTypeDef[];
    friendRequests: FriendRequests;
}

export interface AuthPayloadTypeDef extends TypeDef {
    user: UserTypeDef;
    token: string;
}

export interface DiveTypeDef extends TypeDef {
    timeIn?: string;
    timeOut?: string;
    bottomTime?: number;
    safetyStopTime?: number;
    diveTime?: number;
    maxDepth?: number;
    location?: string;
    description?: string;
    club?: ClubTypeDef;
    user: UserTypeDef;
    buddies: UserTypeDef[];
    gear: GearTypeDef[];
    public?: boolean;
}

export interface ClubTypeDef extends TypeDef {
    name: string;
    location: string;
    managers: UserTypeDef[];
    members: UserTypeDef[];
    website?: string;
}

export interface GearTypeDef extends TypeDef {
    name?: string;
    brand?: string;
    model?: string;
    type?: string;
    owner: UserTypeDef;
}

export interface GroupTypeDef extends TypeDef {
    name: string;
    participants: UserTypeDef[];
    messages: MessageTypeDef[];
}

export interface MessageTypeDef extends TypeDef {
    text: string;
    sender: UserTypeDef;
}
