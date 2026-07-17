import { EnvironmentData, TestScores, QuestionnaireData } from "@/store/useVisionTest";

export type DetailedScores = {
  overall: number;
  distance: number | null;
  near: number | null;
  astigmatism: number | null;
  contrast: number | null;
  color: number | null;
  peripheral: number | null;
  nightVision: number | null;
  digitalEyeStrain: number | null;
  dryEye: number | null;
};

export type AnalysisResult = {
  visionScore: number; // For backwards compatibility
  detailedScores: DetailedScores;
  recommendationLevel: 'Low' | 'Medium' | 'High';
  requiresEmergencyCare: boolean;
  acuityEstimate: string;
  insights: string[];
  lifestyleTips: string[];
}

export function analyzeResults(
  env: EnvironmentData,
  scores: TestScores,
  questionnaire: QuestionnaireData
): AnalysisResult {
  let overall = 100;
  const detailed: DetailedScores = {
    overall: 100,
    distance: 100,
    near: 100,
    astigmatism: 100,
    contrast: 100,
    color: 100,
    peripheral: 100,
    nightVision: 100,
    digitalEyeStrain: 100,
    dryEye: 100,
  };
  
  const insights: string[] = [];
  const lifestyleTips: string[] = [];
  let recommendationLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let requiresEmergencyCare = false;

  // Emergency triggers
  // While we can't definitively diagnose, sudden changes or double vision are red flags.
  if (questionnaire.doubleVision) {
    requiresEmergencyCare = true;
    insights.push("Double vision can be worth checking soon. A professional exam may help.");
  }

  // Distance Vision Analysis
  const worstDistance = Math.max(
    scores.distanceLeft || 20, 
    scores.distanceRight || 20, 
    scores.distanceBoth || 20
  );
  
  const acuityEstimate = worstDistance >= 100
    ? "Distance check suggests your result may warrant a professional exam"
    : worstDistance >= 40
      ? "Distance check suggests mild concern"
      : "Distance check did not raise a clear concern";

  if (worstDistance >= 100) {
    detailed.distance = 30;
    overall -= 30;
    insights.push("Distance viewing felt harder than usual today.");
    recommendationLevel = 'High';
  } else if (worstDistance >= 40) {
    detailed.distance = 70;
    overall -= 15;
    insights.push("Distance viewing felt a little harder than usual.");
    recommendationLevel = 'Medium';
  }

  // Near Vision Analysis
  if (scores.near) {
    if (scores.near > 50) {
      detailed.near = 40;
      overall -= 20;
      insights.push("Reading up close felt a little harder.");
      if (recommendationLevel === 'Low') recommendationLevel = 'Medium';
    } else if (scores.near > 30) {
      detailed.near = 75;
    }
  } else {
    detailed.near = null; // Test skipped
  }

  // Astigmatism
  if (scores.astigmatism !== null) {
    if (scores.astigmatism) {
      detailed.astigmatism = 50;
      overall -= 10;
      insights.push("Some lines looked a little less even than others.");
    }
  } else {
    detailed.astigmatism = null;
  }

  // Contrast
  if (scores.contrast !== null) {
    if (scores.contrast >= 50) {
      detailed.contrast = 60;
      overall -= 15;
      insights.push("Low-contrast details were harder to see.");
    }
  } else {
    detailed.contrast = null;
  }

  // Color Vision
  if (scores.color !== null) {
    if (scores.color < 2) {
      detailed.color = 40;
      insights.push("Some color differences were harder to spot.");
    } else {
      detailed.color = 100;
    }
  } else {
    detailed.color = null;
  }

  // Peripheral Vision
  if (scores.peripheralVision !== null) {
    detailed.peripheral = scores.peripheralVision;
    if (detailed.peripheral < 50) {
      insights.push("Side vision felt a little less clear.");
      recommendationLevel = 'High';
    }
  } else {
    detailed.peripheral = null;
  }

  // Night Vision
  if (questionnaire.nightDrivingIssues !== undefined) { // Check if answered
    if (questionnaire.nightDrivingIssues) {
      detailed.nightVision = 40;
      overall -= 10;
      insights.push("Night driving or glare felt a little harder.");
    }
  } else {
    detailed.nightVision = null;
  }

  // Dry Eye
  if (questionnaire.dryEyes !== undefined) {
    if (questionnaire.dryEyes) {
      detailed.dryEye = 50;
      overall -= 10;
      insights.push("Dryness felt noticeable today.");
      lifestyleTips.push("A humidifier or lubricating drops may help if your eyes feel dry.");
    }
  } else {
    detailed.dryEye = null;
  }

  // Digital Eye Strain
  if (questionnaire.screenFatigue !== undefined) {
    if (questionnaire.screenFatigue || questionnaire.eyeStrain) {
      detailed.digitalEyeStrain = 50;
      overall -= 15;
      insights.push("Screen time may be leaving your eyes feeling tired.");
      lifestyleTips.push("Try the 20-20-20 break: every 20 minutes, look 20 feet away for 20 seconds.");
    }
  } else {
    detailed.digitalEyeStrain = null;
  }
  
  // Extra Questionnaire Impacts
  let symptomCount = 0;
  if (questionnaire.blurVision) symptomCount++;
  if (questionnaire.headache) symptomCount++;
  
  if (symptomCount >= 2) {
    overall -= 10;
    if (recommendationLevel === 'Low') recommendationLevel = 'Medium';
  }

  if (env.lighting === 'poor') {
    lifestyleTips.push("Improve your room lighting to reduce eye strain when working or reading.");
  }

  lifestyleTips.push("Take a moment to blink and drink water during long screen sessions.");
  lifestyleTips.push("A regular eye exam can help keep things comfortable.");

  // Bound overall score
  overall = Math.max(0, Math.min(100, overall));
  detailed.overall = overall;

  if (overall < 50) recommendationLevel = 'High';
  else if (overall < 80 && recommendationLevel === 'Low') recommendationLevel = 'Medium';

  return {
    visionScore: overall,
    detailedScores: detailed,
    recommendationLevel,
    requiresEmergencyCare,
    acuityEstimate,
    insights,
    lifestyleTips
  };
}
