import MarkdownIt from 'markdown-it';
import emoji from 'markdown-it-emoji'
import subscript from 'markdown-it-sub'
import superscript from 'markdown-it-sup'
import iterator from 'markdown-it-for-inline'

export const MarkdownInstance = new MarkdownIt({
    typographer: true,
    linkify: true,
  })
  .use(emoji)
  .use(subscript)
  .use(superscript)
  .use(iterator, 'url_new_win', 'link_open', function(tokens, idx) {
    tokens[idx].attrPush([ 'target', '_blank']);
  });

