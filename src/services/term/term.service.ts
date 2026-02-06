import axios from 'axios';
import 'dotenv/config';

export interface Word {
  word: string;
  phonetics: [
    {
      text: string;
      audio: string;
    },
  ];
  meanings: [
    {
      partOfSpeech: string;
      definitions: [
        {
          definition: string;
          example: string;
          synonyms: [];
          antonyms: [];
        },
      ];
    },
  ];
}

const DICTIONARY_URL = process.env.DICTIONARY_URL;

export const termService = {
  findWord: async (word: string) => {
    console.log('DICTIONARY_URL', `${DICTIONARY_URL}/${word}`);
    return axios.get<Word>(`${DICTIONARY_URL}/${word}`);
  },
};
