"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { MONSTERS, TREASURES, Monster, Treasure } from "@/data/mockData";
import { useUserStore } from "../../../../store/useUserStore";
import { sendGAEvent } from "@next/third-parties/google";

// ── Types ──
type GamePhase =
  | "start"
  | "map"
  | "encounter"
  | "result"
  | "gameover"
  | "complete";
type NodeType = "combat" | "treasure" | "random";

interface MapNode {
  id: string;
  type: NodeType;
  icon: string;
  label: string;
  data?: Monster | Treasure;
}

// ── Helpers ──
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Generate 2~3 random nodes ──
function generateNodes(): MapNode[] {
  const count = Math.random() < 0.5 ? 2 : 3;
  const types: NodeType[] = ["combat", "treasure", "random"];
  const nodes: MapNode[] = [];

  for (let i = 0; i < count; i++) {
    const type = pickRandom(types);
    if (type === "combat") {
      const monster = pickRandom(MONSTERS);
      nodes.push({
        id: `node_${Date.now()}_${i}`,
        type: "combat",
        icon: "⚔️",
        label: "전투",
        data: monster,
      });
    } else if (type === "treasure") {
      const treasure = pickRandom(TREASURES);
      nodes.push({
        id: `node_${Date.now()}_${i}`,
        type: "treasure",
        icon: "🎁",
        label: "보물",
        data: treasure,
      });
    } else {
      nodes.push({
        id: `node_${Date.now()}_${i}`,
        type: "random",
        icon: "❓",
        label: "???",
      });
    }
  }
  return nodes;
}

// Max depth for "complete"
const MAX_DEPTH = 8;

// ══════════════════════════════════════
export default function AdventurePage() {
  const t = useTranslations("Adventure");

  // ── Store ──
  const {
    addGold: storeAddGold,
    addCourage: storeAddCourage,
    initializeDefaultUser,
    user,
  } = useUserStore();

  useEffect(() => {
    initializeDefaultUser();
  }, [initializeDefaultUser]);

  const courage = user?.stats?.courage ?? 0;

  // ── Game State ──
  const [phase, setPhase] = useState<GamePhase>("start");
  const [hp, setHp] = useState(100);
  const [gold, setGold] = useState(0);
  const [depth, setDepth] = useState(0); // Current map depth
  const [nodeClears, setNodeClears] = useState(0);

  // Map nodes
  const [nodes, setNodes] = useState<MapNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

  // Encounter result
  const [encounterResult, setEncounterResult] = useState<"win" | "lose" | null>(
    null,
  );
  const [resultGold, setResultGold] = useState(0);
  const [resultDamage, setResultDamage] = useState(0);
  const [resultMessage, setResultMessage] = useState("");

  // Resolved random type (for display after random is revealed)
  const [resolvedType, setResolvedType] = useState<
    "combat" | "treasure" | null
  >(null);

  // ── Generate new map ──
  const generateMap = useCallback(() => {
    setNodes(generateNodes());
    setSelectedNode(null);
    setEncounterResult(null);
    setResolvedType(null);
    setPhase("map");
  }, []);

  // ── Start game ──
  const startGame = useCallback(() => {
    setHp(100);
    setGold(0);
    setDepth(0);
    setNodeClears(0);
    sendGAEvent({ event: "adventure_start", value: { courage } });
    generateMap();
  }, [generateMap, courage]);

  // ── Select a node ──
  const selectNode = useCallback(
    (node: MapNode) => {
      setSelectedNode(node);
      let actualNode = { ...node };

      // Resolve random node
      if (node.type === "random") {
        if (Math.random() < 0.6) {
          const monster = pickRandom(MONSTERS);
          actualNode = {
            ...node,
            type: "combat",
            data: monster,
            icon: "⚔️",
            label: "전투",
          };
          setResolvedType("combat");
        } else {
          const treasure = pickRandom(TREASURES);
          actualNode = {
            ...node,
            type: "treasure",
            data: treasure,
            icon: "🎁",
            label: "보물",
          };
          setResolvedType("treasure");
        }
        setSelectedNode(actualNode);
      }

      setPhase("encounter");

      // Auto-resolve after a brief delay
      setTimeout(() => {
        sendGAEvent({
          event: "adventure_encounter",
          value: { node_type: actualNode.type },
        });

        if (actualNode.type === "treasure") {
          const tr = actualNode.data as Treasure;
          const g = randomInt(tr.goldMin, tr.goldMax);
          setResultGold(g);
          setResultDamage(0);
          setGold((prev) => prev + g);
          storeAddGold(g);
          setNodeClears((c) => c + 1);
          setEncounterResult("win");
          setResultMessage(`${tr.emoji} 보물에서 ${g} Gold를 획득했다!`);
          setPhase("result");
        } else if (actualNode.type === "combat") {
          const m = actualNode.data as Monster;
          // Win probability based on courage
          const baseWinRate = 50; // 50% base
          const courageBonus = Math.min(courage * 0.5, 40); // max +40%
          const winRate = baseWinRate + courageBonus;
          const won = Math.random() * 100 < winRate;

          if (won) {
            setResultGold(m.rewardGold);
            setResultDamage(0);
            setGold((prev) => prev + m.rewardGold);
            storeAddGold(m.rewardGold);
            setNodeClears((c) => c + 1);
            setEncounterResult("win");
            setResultMessage(
              `${m.emoji} ${m.nameKey}을(를) 물리쳤다! +${m.rewardGold} Gold`,
            );
          } else {
            setResultGold(0);
            setResultDamage(m.damage);
            setHp((h) => Math.max(0, h - m.damage));
            setEncounterResult("lose");
            setResultMessage(
              `${m.emoji} ${m.nameKey}에게 당했다... -${m.damage} HP`,
            );
          }
          setPhase("result");
        }
      }, 1500);
    },
    [courage, storeAddGold],
  );

  // ── Continue to next depth ──
  const continueAdventure = useCallback(() => {
    if (hp <= 0) {
      if (nodeClears > 0) {
        storeAddCourage(nodeClears);
      }
      sendGAEvent({ event: "adventure_gameover", value: { depth, gold } });
      setPhase("gameover");
      return;
    }

    const nextDepth = depth + 1;
    setDepth(nextDepth);

    if (nextDepth >= MAX_DEPTH) {
      if (nodeClears > 0) {
        storeAddCourage(nodeClears);
      }
      sendGAEvent({
        event: "adventure_complete",
        value: { depth: nextDepth, gold },
      });
      setPhase("complete");
      return;
    }

    generateMap();
  }, [hp, depth, nodeClears, storeAddCourage, generateMap]);

  // ── Restart ──
  const restart = useCallback(() => {
    startGame();
  }, [startGame]);

  // ══════════════════════════════════════
  // ── RENDER ──
  // ══════════════════════════════════════
  return (
    <div className={styles.gameContainer}>
      {/* Background */}
      <div className={styles.backgroundLayer}>
        <div className={styles.skyLayer} />
        <div className={styles.ground}>
          <div className={styles.groundGrid} />
        </div>
      </div>

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
          <button className={styles.startBtn} onClick={startGame}>
            {t("start.button")}
          </button>
          <p className={styles.startCourage}>
            {t.rich("start.courage", {
              value: courage,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}{" "}
            {t("start.bonus", {
              value: Math.min(courage * 0.5, 40).toFixed(0),
            })}
          </p>
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
            <span className={styles.distanceValue}>
              📍 {depth}/{MAX_DEPTH}
            </span>
          </div>
        </div>
      )}

      {/* ── MAP: Node Selection ── */}
      {phase === "map" && (
        <div className={styles.mapScreen}>
          <div className={styles.mapHeader}>
            <h2 className={styles.mapTitle}>{t("map.title")}</h2>
            <p className={styles.mapSubtitle}>{t("map.subtitle")}</p>
          </div>

          <div className={styles.nodeGrid}>
            {nodes.map((node) => (
              <button
                key={node.id}
                className={styles.nodeCard}
                onClick={() => selectNode(node)}
              >
                <div className={styles.nodeIcon}>{node.icon}</div>
                <span className={styles.nodeLabel}>{node.label}</span>
                {node.type === "combat" && node.data && (
                  <span className={styles.nodeHint}>
                    {t("map.danger", { value: (node.data as Monster).damage })}
                  </span>
                )}
                {node.type === "treasure" && (
                  <span className={styles.nodeHint}>{t("map.treasure")}</span>
                )}
                {node.type === "random" && (
                  <span className={styles.nodeHint}>{t("map.random")}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── ENCOUNTER ── */}
      {phase === "encounter" && selectedNode && (
        <div className={styles.overlay}>
          <div className={styles.encounterPanel}>
            {(selectedNode.type === "combat" || resolvedType === "combat") &&
            selectedNode.data ? (
              <>
                <div className={styles.encounterVs}>
                  <div className={styles.encounterFighter}>
                    <Image
                      src="/Crowdy/GEOS.gif"
                      alt="Player"
                      width={80}
                      height={80}
                      unoptimized
                      className={styles.encounterSprite}
                    />
                    <span>{t("encounter.player")}</span>
                  </div>
                  <span className={styles.vsText}>{t("encounter.vs")}</span>
                  <div className={styles.encounterFighter}>
                    <Image
                      src="/Crowdy/Black_Dagger_Thief_south.png"
                      alt="Enemy"
                      width={80}
                      height={80}
                      unoptimized
                      className={styles.encounterSprite}
                    />
                    <span>{(selectedNode.data as Monster).emoji}</span>
                  </div>
                </div>
                <p className={styles.encounterDesc}>
                  {t("encounter.combatStatus")}
                </p>
                <div className={styles.encounterDots}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </>
            ) : (
              <>
                <div className={styles.encounterEmoji}>
                  {selectedNode.data
                    ? (selectedNode.data as Treasure).emoji
                    : "🎁"}
                </div>
                <p className={styles.encounterDesc}>
                  {t("encounter.treasureStatus")}
                </p>
                <div className={styles.encounterDots}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {phase === "result" && (
        <div className={styles.overlay}>
          <div
            className={`${styles.resultPanel} ${
              encounterResult === "win" ? styles.resultWin : styles.resultLose
            }`}
          >
            {encounterResult === "win" ? (
              <>
                <div className={styles.resultEmoji}>🎉</div>
                <div
                  className={`${styles.resultTitle} ${styles.resultWinTitle}`}
                >
                  {t("result.win")}
                </div>
                <p className={styles.resultMessage}>{resultMessage}</p>
                {resultGold > 0 && (
                  <div className={styles.resultReward}>
                    💰 +{resultGold} Gold
                  </div>
                )}
              </>
            ) : (
              <>
                <div className={styles.resultEmoji}>💥</div>
                <div
                  className={`${styles.resultTitle} ${styles.resultLoseTitle}`}
                >
                  {t("result.lose")}
                </div>
                <p className={styles.resultMessage}>{resultMessage}</p>
                <div className={styles.resultDamage}>❤️ -{resultDamage} HP</div>
              </>
            )}
            <button className={styles.continueBtn} onClick={continueAdventure}>
              {hp <= 0
                ? t("result.viewResult")
                : depth + 1 >= MAX_DEPTH
                  ? t("result.complete")
                  : t("result.next")}
            </button>
          </div>
        </div>
      )}

      {/* ── COMPLETE ── */}
      {phase === "complete" && (
        <div className={styles.overlay}>
          <div className={styles.completePanel}>
            <div className={styles.completeEmoji}>🏆</div>
            <div className={styles.completeTitle}>
              {t("completeStats.title")}
            </div>
            <div className={styles.completeStats}>
              <div className={styles.completeStat}>
                <span>{t("completeStats.gold")}</span>
                <strong>💰 {gold} G</strong>
              </div>
              <div className={styles.completeStat}>
                <span>{t("completeStats.clearNodes")}</span>
                <strong>⚔️ {nodeClears}</strong>
              </div>
              <div className={styles.completeStat}>
                <span>{t("completeStats.courageUp")}</span>
                <strong>🛡️ +{nodeClears}</strong>
              </div>
            </div>
            <div className={styles.gameOverBtns}>
              <button className={styles.retryBtn} onClick={restart}>
                {t("completeStats.retry")}
              </button>
              <Link href="/" className={styles.homeBtn2}>
                {t("completeStats.home")}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── GAME OVER ── */}
      {phase === "gameover" && (
        <div className={styles.overlay}>
          <div className={styles.gameOverPanel}>
            <div className={styles.gameOverTitle}>GAME OVER</div>
            <div className={styles.gameOverStats}>
              <div className={styles.gameOverStat}>
                {t("gameover.distance", { distance: depth })}
              </div>
              <div className={styles.gameOverStat}>
                {t("gameover.gold", { gold })}
              </div>
              <div className={styles.gameOverStat}>
                {t("gameover.courageUp", { nodes: nodeClears })}
              </div>
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
