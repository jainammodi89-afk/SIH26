import { SupportedLanguage } from '../../types';
import { TranslationStrings } from './types';
import { en } from './en';
import { hi } from './hi';
import { mr } from './mr';
import { ta } from './ta';
import { te } from './te';
import { bn } from './bn';
import { gu } from './gu';
import { kn } from './kn';

export * from './types';

export const translations: Record<SupportedLanguage, TranslationStrings> = {
  en,
  hi,
  mr,
  ta,
  te,
  bn,
  gu,
  kn,
};
