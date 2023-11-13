function* _createSequence(start = 0, step = 1) {
  let count = start;
  while (true) {
    yield count;
    count += step;
  }
}

const blockNaturalSequence = _createSequence(1);

export const nextBlockIndex = () => blockNaturalSequence.next().value as number;
