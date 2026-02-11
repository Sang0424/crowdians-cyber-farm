"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { MONSTERS, TREASURES, Monster, Treasure } from "@/data/mockData";

// ── Types ──
type GamePhase = "start" | "running" | "encounter" | "combat" | "result" | "gameover";
type CombatType = "rps" | "dice" | "timing";
type RPS = "rock" | "paper" | "scissors";
type CombatResult = "win" | "lose" | null;
type EncounterData =
  | { type: "monster"; data: Monster }
  | { type: "treasure"; data: Treasure };

// ── Helpers ──
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const RPS_EMOJI: Record<RPS, string> = { rock: "✊", paper: "✋", scissors: "✌️" };

function rpsWinner(player: RPS, enemy: RPS): CombatResult {
  if (player === enemy) return "lose"; // tie = lose for simplicity
  if (
    (player === "rock" && enemy === "scissors") ||
    (player === "scissors" && enemy === "paper") ||
    (player === "paper" && enemy === "rock")
  ) return "win";
  return "lose";
}

// ══════════════════════════════════════
export default function AdventurePage() {
  const t = useTranslations("Adventure");
  const tData = useTranslations("MockData");

  // ── Game State ──
  const [phase, setPhase] = useState<GamePhase>("start");
  const [hp, setHp] = useState(100);
  const [gold, setGold] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

  // encounter
  const [encounter, setEncounter] = useState<EncounterData | null>(null);
  const [combatType, setCombatType] = useState<CombatType>("rps");
  const [combatResult, setCombatResult] = useState<CombatResult>(null);

  // RPS state
  const [playerRPS, setPlayerRPS] = useState<RPS | null>(null);
  const [enemyRPS, setEnemyRPS] = useState<RPS | null>(null);

  // Dice state
  const [playerDice, setPlayerDice] = useState<number | null>(null);
  const [enemyDice, setEnemyDice] = useState<number | null>(null);
  const [diceRolling, setDiceRolling] = useState(false);

  // Timing bar state
  const [timingPos, setTimingPos] = useState(0);
  const [timingStopped, setTimingStopped] = useState(false);
  const timingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timingDirRef = useRef(1);

  // result display
  const [resultGold, setResultGold] = useState(0);
  const [resultDamage, setResultDamage] = useState(0);

  // ── Distance runner ──
  useEffect(() => {
    if (phase !== "running") return;
    const interval = setInterval(() => {
      setDistance((d) => d + 1);
    }, 100);
    return () => clearInterval(interval);
  }, [phase]);

  // ── Random encounter trigger ──
  useEffect(() => {
    if (phase !== "running") return;
    const delay = randomInt(5000, 8000);
    const timeout = setTimeout(() => {
      triggerEncounter();
    }, delay);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, distance]);

  const triggerEncounter = useCallback(() => {
    // 70% monster, 30% treasure
    if (Math.random() < 0.7) {
      setEncounter({ type: "monster", data: pickRandom(MONSTERS) });
    } else {
      setEncounter({ type: "treasure", data: pickRandom(TREASURES) });
    }
    setPhase("encounter");
  }, []);

  // ── Jump ──
  const doJump = useCallback(() => {
    if (isJumping) return;
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
  }, [isJumping]);

  // ── Combat: Timing bar animation ──
  useEffect(() => {
    if (phase === "combat" && combatType === "timing" && !timingStopped) {
      timingDirRef.current = 1;
      setTimingPos(0);
      timingRef.current = setInterval(() => {
        setTimingPos((p) => {
          let next = p + timingDirRef.current * 2;
          if (next >= 100) { next = 100; timingDirRef.current = -1; }
          if (next <= 0) { next = 0; timingDirRef.current = 1; }
          return next;
        });
      }, 16);
      return () => { if (timingRef.current) clearInterval(timingRef.current); };
    }
  }, [phase, combatType, timingStopped]);

  // ── Start combat mini-game ──
  const startCombat = useCallback(() => {
    const types: CombatType[] = ["rps", "dice", "timing"];
    const chosen = pickRandom(types);
    setCombatType(chosen);
    setCombatResult(null);
    setPlayerRPS(null);
    setEnemyRPS(null);
    setPlayerDice(null);
    setEnemyDice(null);
    setDiceRolling(false);
    setTimingStopped(false);
    setTimingPos(0);
    setPhase("combat");
  }, []);

  // ── Process encounter action ──
  const handleEncounterAction = useCallback(() => {
    if (!encounter) return;
    if (encounter.type === "treasure") {
      const tr = encounter.data as Treasure;
      const g = randomInt(tr.goldMin, tr.goldMax);
      setResultGold(g);
      setResultDamage(0);
      setGold((prev) => prev + g);
      setCombatResult("win");
      setPhase("result");
    } else {
      startCombat();
    }
  }, [encounter, startCombat]);

  // ── RPS combat ──
  const handleRPS = useCallback((choice: RPS) => {
    const enemy: RPS = pickRandom(["rock", "paper", "scissors"]);
    setPlayerRPS(choice);
    setEnemyRPS(enemy);
    const result = rpsWinner(choice, enemy);
    setCombatResult(result);

    if (encounter?.type === "monster") {
      const m = encounter.data as Monster;
      if (result === "win") {
        setResultGold(m.rewardGold);
        setResultDamage(0);
        setGold((g) => g + m.rewardGold);
      } else {
        setResultGold(0);
        setResultDamage(m.damage);
        setHp((h) => Math.max(0, h - m.damage));
      }
    }
    setTimeout(() => setPhase("result"), 1200);
  }, [encounter]);

  // ── Dice combat ──
  const handleDiceRoll = useCallback(() => {
    if (diceRolling) return;
    setDiceRolling(true);
    setPlayerDice(null);
    setEnemyDice(null);

    // animate for 1s then reveal
    setTimeout(() => {
      const p = randomInt(1, 6);
      const e = randomInt(1, 6);
      setPlayerDice(p);
      setEnemyDice(e);
      setDiceRolling(false);

      const result: CombatResult = p >= e ? "win" : "lose";
      setCombatResult(result);

      if (encounter?.type === "monster") {
        const m = encounter.data as Monster;
        if (result === "win") {
          setResultGold(m.rewardGold);
          setResultDamage(0);
          setGold((g) => g + m.rewardGold);
        } else {
          setResultGold(0);
          setResultDamage(m.damage);
          setHp((h) => Math.max(0, h - m.damage));
        }
      }
      setTimeout(() => setPhase("result"), 1200);
    }, 1000);
  }, [diceRolling, encounter]);

  // ── Timing combat ──
  const handleTimingStop = useCallback(() => {
    if (timingStopped) return;
    setTimingStopped(true);
    if (timingRef.current) clearInterval(timingRef.current);

    // green zone: 35-65
    const inZone = timingPos >= 35 && timingPos <= 65;
    const result: CombatResult = inZone ? "win" : "lose";
    setCombatResult(result);

    if (encounter?.type === "monster") {
      const m = encounter.data as Monster;
      if (result === "win") {
        setResultGold(m.rewardGold);
        setResultDamage(0);
        setGold((g) => g + m.rewardGold);
      } else {
        setResultGold(0);
        setResultDamage(m.damage);
        setHp((h) => Math.max(0, h - m.damage));
      }
    }
    setTimeout(() => setPhase("result"), 1000);
  }, [timingStopped, timingPos, encounter]);

  // ── Resume after result ──
  const resumeAfterResult = useCallback(() => {
    // check game over
    if (hp <= 0) {
      setPhase("gameover");
    } else {
      setEncounter(null);
      setCombatResult(null);
      setPhase("running");
    }
  }, [hp]);

  // ── Restart ──
  const restart = useCallback(() => {
    setHp(100);
    setGold(0);
    setDistance(0);
    setPhase("running");
    setEncounter(null);
    setCombatResult(null);
  }, []);

  // ── Keyboard handler ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase === "start") {
        setPhase("running");
        return;
      }

      if (phase === "running" && e.code === "Space") {
        e.preventDefault();
        doJump();
        return;
      }

      if (phase === "encounter") {
        handleEncounterAction();
        return;
      }

      if (phase === "combat") {
        if (combatType === "rps" && !playerRPS) {
          if (e.key === "1") handleRPS("rock");
          if (e.key === "2") handleRPS("scissors");
          if (e.key === "3") handleRPS("paper");
        }
        if (combatType === "dice" && e.code === "Enter") {
          handleDiceRoll();
        }
        if (combatType === "timing" && e.code === "Space") {
          e.preventDefault();
          handleTimingStop();
        }
        return;
      }

      if (phase === "result") {
        resumeAfterResult();
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    phase, combatType, playerRPS, doJump,
    handleEncounterAction, handleRPS, handleDiceRoll,
    handleTimingStop, resumeAfterResult,
  ]);

  // check game over after hp change
  useEffect(() => {
    if (hp <= 0 && phase === "result") {
      // will be caught by resumeAfterResult
    }
  }, [hp, phase]);

  // ══════════════════════════════════════
  // ── RENDER ──
  // ══════════════════════════════════════
  return (
    <div className={styles.gameContainer}>
      {/* Background layers */}
      <div className={styles.backgroundLayer}>
        <div className={styles.skyLayer} />
        <div className={styles.starsLayer} />
        <div className={styles.cityFar} />
        <div className={styles.cityNear} />
        <div className={styles.neonLine} />
        <div className={styles.ground}>
          <div className={styles.groundGrid} />
        </div>
      </div>

      {/* CRT scanlines overlay */}
      <div className={styles.scanLine} />

      {/* ── START SCREEN ── */}
      {phase === "start" && (
        <div className={styles.startScreen}>
          <h1 className={styles.startTitle}>⚔️ ADVENTURE</h1>
          <p className={styles.startSubtitle}>{t("start.subtitle")}</p>
          <Image
            src="/Crowdy/GEOS.gif"
            alt="Character"
            width={120}
            height={120}
            unoptimized
            className={styles.startCharacter}
          />
          <p className={styles.startAction}>{t("start.pressKey")}</p>
        </div>
      )}

      {/* ── HUD ── */}
      {phase !== "start" && (
        <div className={styles.hud}>
          <div className={styles.hudLeft}>
            <Link href="/" className={styles.homeBtn}>
              {t("hud.home")}
            </Link>
            <div className={styles.statGroup}>
              <span className={styles.statIcon}>❤️</span>
              <div className={styles.statBar}>
                <div
                  className={`${styles.statBarFill} ${styles.hpFill}`}
                  style={{ width: `${hp}%` }}
                />
              </div>
              <span className={styles.statValue}>{hp}/100</span>
            </div>
          </div>
          <div className={styles.hudRight}>
            <span className={styles.goldValue}>💰 {gold} G</span>
            <span className={styles.distanceValue}>📍 {distance}m</span>
          </div>
        </div>
      )}

      {/* ── Player Character ── */}
      {phase !== "start" && (
        <div className={styles.playerArea}>
          <Image
            src="/Crowdy/GEOS.gif"
            alt="Player"
            width={80}
            height={80}
            unoptimized
            className={`${styles.player} ${
              isJumping ? styles.playerJumping : phase === "running" ? styles.playerWalking : ""
            }`}
          />
        </div>
      )}

      {/* ── Encounter Alert [!] ── */}
      {phase === "encounter" && (
        <>
          <div className={styles.encounterAlert}>
            <div className={styles.alertBubble}>!</div>
          </div>
          <div className={styles.overlay}>
            <div className={styles.encounterPanel}>
              {encounter?.type === "monster" ? (
                <>
                  <div className={styles.encounterEmoji}>
                    {(encounter.data as Monster).emoji}
                  </div>
                  <div className={styles.encounterName}>
                    {tData((encounter.data as Monster).nameKey)}
                  </div>
                  <div className={styles.encounterDesc}>
                    {t("encounter.monsterAppeared")}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.encounterEmoji}>
                    {(encounter?.data as Treasure).emoji}
                  </div>
                  <div className={styles.encounterName}>
                    {tData((encounter?.data as Treasure).nameKey)}
                  </div>
                  <div className={styles.encounterDesc}>
                    {t("encounter.treasureFound")}
                  </div>
                </>
              )}
              <div className={styles.encounterAction}>
                {t("encounter.pressKeyContinue")}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Combat ── */}
      {phase === "combat" && encounter?.type === "monster" && (
        <div className={styles.overlay}>
          <div className={styles.combatPanel}>
            <div className={styles.combatTitle}>{t("combat.title")}</div>

            <div className={styles.combatVs}>
              <div className={styles.combatFighter}>
                <span className={styles.combatFighterEmoji}>🧑‍💻</span>
                <span className={styles.combatFighterName}>{t("combat.me")}</span>
              </div>
              <span className={styles.vsText}>VS</span>
              <div className={styles.combatFighter}>
                <span className={styles.combatFighterEmoji}>
                  {(encounter.data as Monster).emoji}
                </span>
                <span className={styles.combatFighterName}>
                  {tData((encounter.data as Monster).nameKey)}
                </span>
              </div>
            </div>

            {/* RPS */}
            {combatType === "rps" && (
              <>
                <div className={styles.combatSubtitle}>
                  {t("combat.rps.subtitle")}
                </div>
                {!playerRPS ? (
                  <div className={styles.rpsButtons}>
                    <button className={styles.rpsBtn} onClick={() => handleRPS("rock")}>
                      <span className={styles.rpsBtnEmoji}>✊</span>
                      <span>{t("combat.rps.rock")}</span>
                      <span className={styles.rpsBtnKey}>[1]</span>
                    </button>
                    <button className={styles.rpsBtn} onClick={() => handleRPS("scissors")}>
                      <span className={styles.rpsBtnEmoji}>✌️</span>
                      <span>{t("combat.rps.scissors")}</span>
                      <span className={styles.rpsBtnKey}>[2]</span>
                    </button>
                    <button className={styles.rpsBtn} onClick={() => handleRPS("paper")}>
                      <span className={styles.rpsBtnEmoji}>✋</span>
                      <span>{t("combat.rps.paper")}</span>
                      <span className={styles.rpsBtnKey}>[3]</span>
                    </button>
                  </div>
                ) : (
                  <div className={styles.rpsResult}>
                    <div className={styles.rpsChoice}>
                      <span className={styles.rpsChoiceEmoji}>{RPS_EMOJI[playerRPS]}</span>
                      <span className={styles.rpsChoiceLabel}>{t("combat.me")}: {t(`combat.rps.${playerRPS}`)}</span>
                    </div>
                    <span className={styles.vsText}>VS</span>
                    <div className={styles.rpsChoice}>
                      <span className={styles.rpsChoiceEmoji}>{enemyRPS ? RPS_EMOJI[enemyRPS] : "❓"}</span>
                      <span className={styles.rpsChoiceLabel}>{t("combat.enemy")}: {enemyRPS ? t(`combat.rps.${enemyRPS}`) : "?"}</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Dice */}
            {combatType === "dice" && (
              <>
                <div className={styles.combatSubtitle}>
                  {t("combat.dice.subtitle")}
                </div>
                <div className={styles.diceArea}>
                  <div className={styles.diceRow}>
                    <div className={styles.diceSlot}>
                      <div
                        className={`${styles.dice} ${diceRolling ? styles.diceRolling : ""}`}
                      >
                        {playerDice ?? "?"}
                      </div>
                      <span className={styles.diceLabel}>{t("combat.me")}</span>
                    </div>
                    <span className={styles.vsText}>VS</span>
                    <div className={styles.diceSlot}>
                      <div
                        className={`${styles.dice} ${diceRolling ? styles.diceRolling : ""}`}
                      >
                        {enemyDice ?? "?"}
                      </div>
                      <span className={styles.diceLabel}>{t("combat.enemy")}</span>
                    </div>
                  </div>
                  {!diceRolling && !playerDice && (
                    <div className={styles.diceAction}>
                      {t("combat.dice.action")}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Timing */}
            {combatType === "timing" && (
              <>
                <div className={styles.combatSubtitle}>
                  {t("combat.timing.subtitle")}
                </div>
                <div className={styles.timingArea}>
                  <div className={styles.timingBarOuter}>
                    <div
                      className={styles.timingZoneGreen}
                      style={{ left: "35%", width: "30%" }}
                    />
                    <div
                      className={`${styles.timingCursor} ${timingStopped ? styles.timingStopped : ""}`}
                      style={{ left: `${timingPos}%` }}
                    />
                  </div>
                  {!timingStopped && (
                    <div className={styles.timingAction}>
                      {t("combat.timing.action")}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Result ── */}
      {phase === "result" && (
        <div className={styles.overlay}>
          <div
            className={`${styles.resultPanel} ${
              combatResult === "win" ? styles.resultWin : styles.resultLose
            }`}
          >
            {combatResult === "win" ? (
              <>
                <div className={styles.resultEmoji}>🎉</div>
                <div className={`${styles.resultTitle} ${styles.resultWinTitle}`}>
                  {t("result.win")}
                </div>
                {encounter?.type === "treasure" ? (
                  <div className={styles.resultTreasure}>
                    {t("result.goldGained", { gold: resultGold })}
                  </div>
                ) : (
                  <div className={styles.resultReward}>
                    {t("result.goldGainedPlus", { gold: resultGold })}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className={styles.resultEmoji}>💥</div>
                <div className={`${styles.resultTitle} ${styles.resultLoseTitle}`}>
                  {t("result.lose")}
                </div>
                <div className={styles.resultDamage}>
                  ❤️ -{resultDamage} HP
                </div>
              </>
            )}
            <div className={styles.resultContinue}>
              {t("result.pressKeyContinue")}
            </div>
          </div>
        </div>
      )}

      {/* ── Game Over ── */}
      {phase === "gameover" && (
        <div className={styles.overlay}>
          <div className={styles.gameOverPanel}>
            <div className={styles.gameOverTitle}>GAME OVER</div>
            <div className={styles.gameOverStats}>
              <div className={styles.gameOverStat}>{t("gameover.distance", { distance })}</div>
              <div className={styles.gameOverStat}>{t("gameover.gold", { gold })}</div>
            </div>
            <div className={styles.gameOverBtns}>
              <button className={styles.retryBtn} onClick={restart}>
                {t("gameover.retry")}
              </button>
              <Link href="/" className={styles.homeBtn2}>
                {t("gameover.home")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
