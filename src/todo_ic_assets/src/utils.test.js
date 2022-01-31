import { convertArrayToObject } from './utils';

describe('convertArrayToObject', () => {
    test('convert with number item', () => {
      const input = [
        { id: 0, description: 'This is description 0.' },
        { id: 1, description: 'This is description 1.' },
        { id: 2, description: 'This is description 2.' },
        { id: 3, description: 'This is description 3.' },
      ];
  
      const output = {
        '0': { id: 0, description: 'This is description 0.' },
        '1': { id: 1, description: 'This is description 1.' },
        '2': { id: 2, description: 'This is description 2.' },
        '3': { id: 3, description: 'This is description 3.' },
      };

      expect(convertArrayToObject(input, 'id')).toStrictEqual(output);
    });

    test('convert with string item', () => {
      const input = [
        { id: 'aaa', description: 'This is description 0.' },
        { id: 'bbb', description: 'This is description 1.' },
        { id: 'ccc', description: 'This is description 2.' },
        { id: 'ddd', description: 'This is description 3.' },
      ];
  
      const output = {
        'aaa': { id: 'aaa', description: 'This is description 0.' },
        'bbb': { id: 'bbb', description: 'This is description 1.' },
        'ccc': { id: 'ccc', description: 'This is description 2.' },
        'ddd': { id: 'ddd', description: 'This is description 3.' },
      };

      expect(convertArrayToObject(input, 'id')).toStrictEqual(output);
    });
  });