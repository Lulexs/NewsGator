import { makeAutoObservable, runInAction } from "mobx";
import { News, NewspaperNews } from "../models/News";
import { router } from "../routes/routes";

export default class NewsEditorFormStateStore {
  editedNews: News | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setNews = (news: News) => {
    runInAction(() => {
      this.editedNews = news;
    });
  };

  handleNewspaperNewsAdd = (newspaperNews: NewspaperNews) => {
    if (this.editedNews) {
      const updatedNews = {
        ...this.editedNews,
        newspaperNews: [
          ...(this.editedNews.newspaperNews || []),
          newspaperNews,
        ],
      };
      this.setNews(updatedNews);
      router.navigate(`/imageeditor/${newspaperNews.content}.png`);
    }
  };

  handleAddCommunityNote = (text: string) => {
    if (this.editedNews) {
      const updatedNews = {
        ...this.editedNews,
        communityNotes: {
          text,
          upvotes: 0,
          downvotes: 0,
        },
      };
      this.setNews(updatedNews);
    }
  };

  changeTitle = (newTitle: string) => {
    if (this.editedNews) {
      this.editedNews.title = newTitle;
    }
  };

  changeLocation = (newLocation: string) => {
    if (this.editedNews) {
      this.editedNews.location = newLocation;
    }
  };

  changeThumbnail = (newThumb: string) => {
    if (this.editedNews) {
      this.editedNews.thumbnail = newThumb;
    }
  };

  clearCommunityNote = () => {
    if (this.editedNews) {
      this.editedNews.communityNotes = undefined;
    }
  };

  changeCommunityNote = (val: string) => {
    if (this.editedNews && this.editedNews.communityNotes) {
      this.editedNews.communityNotes.text = val;
    }
  };

  removeNewsSource = (index: number) => {
    if (this.editedNews && this.editedNews.newspaperNews) {
      this.editedNews.newspaperNews = this.editedNews.newspaperNews.filter(
        (_, i) => i !== index
      );
    }
  };
}
