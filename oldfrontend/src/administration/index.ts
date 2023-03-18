import { TranslationAST } from '@i18n';
import { BreadcrumbItem } from '@UI/Breadcrumbs';
import * as persons_persons from './persons/persons';

export interface AdministrationElement {
  ID: string;
  /**
   * The actual path of the element
   */
  path: (string | TranslationAST<string>)[];
  /**
   * The breadcrumbs of the element
   */
  breadcrumbs: BreadcrumbItem[];
  Card: () => JSX.Element;
}

export const ELEMENTS = [persons_persons] satisfies AdministrationElement[];
