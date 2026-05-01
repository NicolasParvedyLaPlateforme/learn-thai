const text = "สวัสดีครับ";
const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
let offset = 0;
const bounds = [];
for (const segment of segmenter.segment(text)) {
  offset += segment.segment.length;
  bounds.push(offset);
  console.log(segment.segment, segment.isWordLike);
}
console.log(bounds);
