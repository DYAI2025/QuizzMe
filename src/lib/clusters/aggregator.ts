
import { ClusterDefinition, ClusterProgress, ClusterContributionEvent } from '../types/cluster';

export function aggregateCluster(
  clusterDef: ClusterDefinition,
  progress: ClusterProgress
): ClusterContributionEvent['payload'] | null {
  
  if (!progress.isComplete || progress.completedQuizzes.length < clusterDef.quizzes.length) {
    return null;
  }

  // 1. Gather all results
  // For Naturkind, we expect 4 results matching the quiz IDs
  // We need the ACTUAL result/profile data to do meaningful text generation.
  // However, the progress store only stores resultId and resultTitle.
  // For a robust system, we might need to re-fetch or store more data.
  // FOR NOW: We will rely on resultId string parsing or mapping if needed, 
  // or just use the IDs to construct the narrative.
  
  // Since we don't have the full profile objects in store, we might need to import them 
  // or just use the IDs to generate the narrative if the ID contains the key.
  // The IDs are like "lotus", "obsidian", etc.
  
  const resultsMap = new Map<string, string>(); // quizId -> resultId
  progress.completedQuizzes.forEach(q => {
    resultsMap.set(q.quizId, q.resultId);
  });

  const aura = resultsMap.get("quiz.aura_colors.v1");
  const animal = resultsMap.get("quiz.krafttier.v1");
  const flower = resultsMap.get("quiz.blumenwesen.v1");
  const stone = resultsMap.get("quiz.energiestein.v1");

  // Simple Narrative Construction based on template
  // "Deine Natur-Signatur ist {rarity}: Die {aura} verrät {aura_insight}, ..."
  // Since we don't have lookup tables for "aura_insight" here without importing all data files,
  // we will generate a generic but thematic summary.
  
  // In a real app, we'd probably have a "ClusterOutcomeRegistry" or similar.
  // For this prototype, I will hardcode a simple generator here or assume
  // the resultIds are descriptive enough.
  
  const narrative = `Deine Natur-Signatur vereint ${clusterDef.quizzes.length} Elemente. ` +
    `Aura: ${aura}. Krafttier: ${animal}. Blumenwesen: ${flower}. Energiestein: ${stone}. ` +
    `Zusammen bilden sie den Archetyp "Naturkind".`;

  // 2. Calculate Rarity (Mock)
  // We can hash the combination to get a deterministic mock rarity or score
  const score = (progress.completedQuizzes.length * 25); 

  // 3. Construct Payload
  const payload: ClusterContributionEvent['payload'] = {
    markers: clusterDef.aggregation.outputMarkers.map(m => ({ id: m, weight: 1.0 })),
    unlocks: [
      { 
        id: clusterDef.completionReward.unlockId, 
        unlocked: true, 
        level: clusterDef.completionReward.unlockLevel 
      }
    ],
    clusterAttribute: {
      id: clusterDef.completionReward.attributeId,
      name: clusterDef.completionReward.attributeName,
      level: clusterDef.completionReward.unlockLevel,
      archetype: "Naturkind",
      components: progress.completedQuizzes.map(q => ({
        quizId: q.quizId,
        component: q.resultTitle,
        weight: 1.0
      })),
      narrative: narrative
    },
    summary: {
      title: "Archetyp: Naturkind",
      tagline: "Du hast deine Verbindung zur Natur wiederhergestellt.",
      bullets: [
        `Aura: ${aura?.toUpperCase()}`,
        `Krafttier: ${animal?.toUpperCase()}`,
        `Blüte: ${flower?.toUpperCase()}`,
        `Stein: ${stone?.toUpperCase()}`
      ]
    }
  };

  return payload;
}
