// The sticker pack ships as plain numbered PNGs with no category metadata,
// so they're exposed as a single flat list; the Editor's asset picker
// groups them under one "All" tab until categorized artwork is supplied.
export type StickerAsset = {
  id: string;
  source: ReturnType<typeof require>;
};

export const stickers: StickerAsset[] = Array.from({ length: 19 }, (_, i) => {
  const id = String(i + 1);
  return { id, source: stickerSource(id) };
});

function stickerSource(id: string) {
  switch (id) {
    case '1':
      return require('../../assets/stickers/1.png');
    case '2':
      return require('../../assets/stickers/2.png');
    case '3':
      return require('../../assets/stickers/3.png');
    case '4':
      return require('../../assets/stickers/4.png');
    case '5':
      return require('../../assets/stickers/5.png');
    case '6':
      return require('../../assets/stickers/6.png');
    case '7':
      return require('../../assets/stickers/7.png');
    case '8':
      return require('../../assets/stickers/8.png');
    case '9':
      return require('../../assets/stickers/9.png');
    case '10':
      return require('../../assets/stickers/10.png');
    case '11':
      return require('../../assets/stickers/11.png');
    case '12':
      return require('../../assets/stickers/12.png');
    case '13':
      return require('../../assets/stickers/13.png');
    case '14':
      return require('../../assets/stickers/14.png');
    case '15':
      return require('../../assets/stickers/15.png');
    case '16':
      return require('../../assets/stickers/16.png');
    case '17':
      return require('../../assets/stickers/17.png');
    case '18':
      return require('../../assets/stickers/18.png');
    default:
      return require('../../assets/stickers/19.png');
  }
}
