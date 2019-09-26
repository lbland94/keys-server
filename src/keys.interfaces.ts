export interface ImageRendition {
  fileName: string;
  folder: keyof ImageFolders;
  transform: string;
}

export interface Images {
  folders: ImageFolders;
  renditions: {
    [key: string]: ImageRendition;
  }
}

export interface ImageFolders {
  [key: string]: string;
}