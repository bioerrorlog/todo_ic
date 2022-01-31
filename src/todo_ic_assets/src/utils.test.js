import { convertArrayToObject } from './utils';
// const convertArrayToObject = require('./utils');

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

      console.log(convertArrayToObject(input, 'id'))

      expect(convertArrayToObject(input, 'id')).toBe(output);
    });
  });