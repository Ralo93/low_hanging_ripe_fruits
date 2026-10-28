export type DimensionKey =
  | "dimension1"
  | "dimension2"
  | "dimension3"
  | "dimension4"
  | "dimension5";

export type Question = {
  id: number;
  text: string;
  dimension: DimensionKey;
};

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  dimension1: "Offenheit",
  dimension2: "Gewissenhaftigkeit",
  dimension3: "Extraversion",
  dimension4: "Umgänglichkeit",
  dimension5: "Neurotizismus",
};

export const DIMENSION_LABELS_EN: Record<DimensionKey, string> = {
  dimension1: "Openness",
  dimension2: "Conscientiousness",
  dimension3: "Extraversion",
  dimension4: "Agreeableness",
  dimension5: "Neuroticism",
};

export const QUESTIONS: Question[] = [
  { id: 1,  text: "Ich bin gerne unter Menschen und gehe mit Energie in neue Situationen.",         dimension: "dimension3" },
  { id: 2,  text: "Ich sage direkt, was ich denke – auch wenn es unbequem ist.",                    dimension: "dimension4" },
  { id: 3,  text: "Ich erledige Aufgaben verlässlich und halte mich an Pläne.",                     dimension: "dimension2" },
  { id: 4,  text: "Ich werde schnell nervös oder aufgeregt, wenn etwas schiefläuft.",               dimension: "dimension5" },
  { id: 5,  text: "Ich bin neugierig auf neue Ideen und ungewöhnliche Perspektiven.",               dimension: "dimension1" },
  { id: 6,  text: "In Gruppen halte ich mich eher im Hintergrund.",                                 dimension: "dimension3" },
  { id: 7,  text: "Mir ist es wichtig, wie es anderen geht – ich helfe gerne.",                     dimension: "dimension4" },
  { id: 8,  text: "Ich bin spontan und locker – strikte Ordnung liegt mir nicht.",                  dimension: "dimension2" },
  { id: 9,  text: "Ich bleibe ruhig und gefasst, auch wenn es stressig wird.",                      dimension: "dimension5" },
  { id: 10, text: "Ich bevorzuge bewährte Methoden statt ständig Neues auszuprobieren.",            dimension: "dimension1" },
];

export const QUESTIONS_EN: Question[] = [
  { id: 1,  text: "I enjoy being around people and approach new situations with energy.",           dimension: "dimension3" },
  { id: 2,  text: "I say what I think directly, even when it's uncomfortable.",                    dimension: "dimension4" },
  { id: 3,  text: "I complete tasks reliably and stick to plans.",                                  dimension: "dimension2" },
  { id: 4,  text: "I get nervous or upset quickly when things go wrong.",                           dimension: "dimension5" },
  { id: 5,  text: "I am curious about new ideas and unusual perspectives.",                         dimension: "dimension1" },
  { id: 6,  text: "In groups, I tend to stay in the background.",                                   dimension: "dimension3" },
  { id: 7,  text: "I care about how others are doing and like to help.",                            dimension: "dimension4" },
  { id: 8,  text: "I am spontaneous and relaxed – strict order is not my thing.",                  dimension: "dimension2" },
  { id: 9,  text: "I stay calm and composed, even when things get stressful.",                      dimension: "dimension5" },
  { id: 10, text: "I prefer tried-and-true methods over constantly trying new things.",             dimension: "dimension1" },
];
