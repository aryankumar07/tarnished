export interface DropDownProps {
  heading: {
    title: string;
    subTitle?: string;
  };
  time?: string | null;
  content?: string
  highlights?: string[]
}

export interface ProjectInfoProps {
  title: string;
  LiveLink?: string;
  GithubLink?: string;
  Content: string
}

