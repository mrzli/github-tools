export interface RepoData {
  readonly id: number; // id
  readonly owner: string; // owner.login
  readonly name: string; // name
  readonly url: string; // html_url
  readonly description: string; // description
  readonly private: boolean; // private
  readonly archived: boolean; // archived
  readonly topics: readonly string[]; // topics
}
