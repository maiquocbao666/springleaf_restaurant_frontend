export interface Token {
    tokenId: number;
    token: string;
    revoked: boolean;
    expired: boolean;
    userid: number;
    tokenType: string;
}