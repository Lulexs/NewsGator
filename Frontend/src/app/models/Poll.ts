export interface PollOption {
  option: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  datePosted: Date;
}

export interface HomePagePoll {
  id: string;
  question: string;
  options: PollOption;
  UserVote?: PollOption;
  datePosted: Date;
}
