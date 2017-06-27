// to be used by Angular as interpretation of Mongoose schema
export class Repo {
  _id?: string; // optional field for internal id as assigned by Mongo
  repo_id: number;
  name: string;
  url: string;
  description: string;
  owner: string;
  avatar: string;
}
