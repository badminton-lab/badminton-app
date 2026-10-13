import { content } from "./content";
import { baseWorries } from "./coachingWorries";
import { basePhrases } from "./coachingPhrases";
import type { Phrase, PhraseGroup, Worry } from "./coachingTypes";
import { phraseGroupOf } from "./coachingTypes";

/**
 * 指導者向けの読み物（指導のお悩み・声かけ集）。
 * 公開サイトに出るのは、運営者が確認済み（reviewed）にしたものだけ。
 * 開発中は NEXT_PUBLIC_SHOW_UNREVIEWED=1 で、確認前のものも表示できる（本番では常に無効）。
 * ※ 画面（クライアント）には、このファイルを読み込まない。サーバー側のページから、props で渡す。
 */
const SHOW_UNREVIEWED = process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_SHOW_UNREVIEWED === "1";

export const allWorries: Worry[] = content.worries ?? baseWorries;
export const allPhrases: Phrase[] = content.phrases ?? basePhrases;

export const worries: Worry[] = SHOW_UNREVIEWED ? allWorries : allWorries.filter((x) => x.reviewed);
export const phrases: Phrase[] = SHOW_UNREVIEWED ? allPhrases : allPhrases.filter((x) => x.reviewed);

export const phrasesOf = (group: PhraseGroup): Phrase[] => phrases.filter((p) => phraseGroupOf(p.category) === group);

/** 公開できる読み物が1件でもあるか（ナビ・サイトマップの出し分け用） */
export const hasCoaching = worries.length + phrases.length > 0;
