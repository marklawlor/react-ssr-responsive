declare module "react-native-web/dist/exports/StyleSheet/styleResolver" {
  export interface OrderedCSSStyleSheet {
    insert(cssText: string, groupValue: number): void;
  }

  export default {
    get sheet(): OrderedCSSStyleSheet;,
  };
}

declare module "react-native-web/dist/exports/StyleSheet/compile" {
  type Value = Object | Array<any> | string | number;
  type Style = { [key: string]: Value };
  type Rule = string;
  type Rules = Array<Rule>;
  type RulesData = {
    property?: string;
    value?: string;
    identifier: string;
    rules: Rules;
  };
  type CompilerOutput = { [key: string]: RulesData };

  export function atomic(style: Style): CompilerOutput;
}

declare module "react-native-web/dist/exports/StyleSheet/createCompileableStyle" {
  type Value = Object | Array<any> | string | number;
  type Style = { [key: string]: Value };
  export default function createCompileableStyle(styles: Object): Style;
}

declare module "react-native-web/dist/exports/StyleSheet/i18nStyle" {
  export default function i18nStyle(styles: Object): Object;
}
