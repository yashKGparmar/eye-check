import { useAppConfig } from '@/store/useAppConfig';
import en from './en.json';
import hi from './hi.json';
import gu from './gu.json';

const dictionaries = { en, hi, gu };

type Dictionary = typeof en;
interface NestedRecord {
  [key: string]: string | NestedRecord;
}

export function useTranslation() {
  const { language } = useAppConfig();
  
  const dict = (dictionaries[language] as Dictionary) || en;

  // Simple dot notation accessor: t('home.title')
  const t = (key: string, variables?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: string | NestedRecord = dict as unknown as NestedRecord;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as NestedRecord)[k];
      } else {
        // Fallback to english if not found
        let fallbackValue: string | NestedRecord = en as unknown as NestedRecord;
        for (const fk of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
            fallbackValue = (fallbackValue as NestedRecord)[fk];
          } else {
            return key; // Return key if not found in fallback either
          }
        }
        value = fallbackValue;
        break;
      }
    }

    if (typeof value !== 'string') return key;
    
    if (variables) {
      return Object.entries(variables).reduce((str, [k, v]) => {
        return str.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
      }, value);
    }
    
    return value;
  };

  return { t, language };
}
