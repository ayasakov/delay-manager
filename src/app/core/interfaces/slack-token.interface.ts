export interface ISlackTeam {
  id: string;
}

export interface ISlackUser {
  name: string;
  id: string;
}

export interface ISlackToken {
  access_token: string;
  ok: boolean;
  error?: string;
  scope: string;
  team: ISlackTeam;
  team_id: string;
  user: ISlackUser;
  user_id: string;
}
