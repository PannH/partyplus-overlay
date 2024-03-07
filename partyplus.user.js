// ==UserScript==
// @name        PartyPlus - BombParty Overlay
// @description Un overlay pour dynamiser BombParty avec des fonctionnalités supplémentaires et une customisation complète
// @version     2.0.0
// @author      PannH
// @homepage    https://github.com/PannH/partyplus-jklm-bombparty-overlay#readme
// @supportURL  https://github.com/PannH/partyplus-jklm-bombparty-overlay/issues
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @require     https://cdn.jsdelivr.net/npm/linkifyjs@4.1.3/dist/linkify.min.js
// @match       *://*.jklm.macadelic.me/*
// @match       *://*.jklm.macadelic.me/games/bombparty/
// @match       https://*.jklm.fun/games/bombparty/
// @match       https://jklm.fun/*
// @iconURL     https://jklm.fun/images/icon.svg
// @namespace   https://jklm.fun
// @license     MIT
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_notification
// @grant       window.focus
// ==/UserScript==

(() => {
   "use strict";
   var e, t, a, n, i = {
         921: (e, t, a) => {
            a.d(t, {
               A: () => i
            });
            var n = a(101);
            const i = {
               DEFAULT_SETTINGS: {
                  notifyOnGameOver: n.mh.Never,
                  notifyOnChatMention: n.mh.Never,
                  linkifyChat: n.$h.Full,
                  mentionTriggers: [],
                  timestampFormat: n.sd.Default,
                  chatFontFamily: "Varela Round",
                  enableEmojiShortcuts: !0,
                  displayGameStatsTable: !0,
                  enableGameStatsTableFreePosition: !1,
                  gameStatsTablePosition: {
                     x: 0,
                     y: 0
                  },
                  displayWordsStat: !0,
                  displayAlphaStat: !0,
                  displayHyphenatedWordsStat: !0,
                  displayLongWordsStat: !0,
                  displayLivesStat: !0,
                  displayDurationWithoutDeathStat: !0,
                  displayWordsPerMinuteStat: !0,
                  displayReactionTimeStat: !0,
                  chatFontWeight: n.IT.Normal,
                  enableSkipTurnShortcut: !0,
                  enableGiveUpShortcut: !0,
                  enableTabKey: !0,
                  topbarBackgroundColor: "#7855c7",
                  topbarTextColor: "#eeeeee",
                  sidebarBackgroundColor: "#202020",
                  chatNicknamesColor: "#eeeeee",
                  chatMessagesColor: "#cccccc",
                  chatSystemMessagesColor: "#88aaaa",
                  chatLinksColor: "#2266ff",
                  remainingBonusLettersColor: "#ddbb66",
                  usedBonusLettersColor: "#888888",
                  presentPlayerNicknamesColor: "#ffffff",
                  absentPlayerNicknamesColor: "#888888",
                  currentPlayerWordColor: "#ffffff",
                  otherPlayersWordColor: "#aaaaaa",
                  wordSyllableColor: "#44dd44",
                  lifeEmoji: "❤️",
                  deathEmoji: "☠️",
                  winEmoji: "🥇",
                  sidebarWidth: 350,
                  gameBackgroundType: n.D6.Gradient,
                  gradientColors: ["#564a42", "#463d36", "#37302b"],
                  solidColor: "#564a42",
                  imageURL: void 0,
                  enableInnerShadow: !0,
                  hideInGameAvatars: !1,
                  hideInGameNicknames: !1,
                  trainListId: void 0,
                  trainLists: [],
                  forceTrainList: !1,
                  enableTrainMessages: !0
               },
               ALPHA_LETTERS: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
            }
         },
         101: (e, t, a) => {
            var n, i, o, s, r;
            a.d(t, {
                  IT: () => r,
                  D6: () => o,
                  $h: () => i,
                  mh: () => n,
                  sd: () => s
               }),
               function (e) {
                  e[e.Always = 0] = "Always", e[e.OnlyWhenNotFocused = 1] = "OnlyWhenNotFocused", e[e.Never = 2] = "Never"
               }(n || (n = {})),
               function (e) {
                  e[e.Shortened = 0] = "Shortened", e[e.Full = 1] = "Full", e[e.Disabled = 2] = "Disabled"
               }(i || (i = {})),
               function (e) {
                  e[e.Gradient = 0] = "Gradient", e[e.Solid = 1] = "Solid", e[e.OnlineImage = 2] = "OnlineImage"
               }(o || (o = {})),
               function (e) {
                  e[e.Default = 0] = "Default", e[e.Full = 1] = "Full"
               }(s || (s = {})),
               function (e) {
                  e[e.Light = 300] = "Light", e[e.Normal = 400] = "Normal", e[e.Medium = 500] = "Medium", e[e.SemiBold = 600] = "SemiBold", e[e.Bold = 700] = "Bold"
               }(r || (r = {}))
         },
         980: (e, t, a) => {
            a.d(t, {
               A: () => n
            });
            const n = {
               socket: null,
               jklmSettings: null,
               settings: null,
               states: {
                  giveUp: !1,
                  selfPeerId: null,
                  trainingMode: {
                     correctWords: 0,
                     wrongWords: 0,
                     successRate: 1
                  },
                  lastWord: null,
                  playerGameStats: {}
               },
               gameTimerInterval: null
            }
         },
         667: (e, t, a) => {
            a.r(t);
            var n = a(980),
               i = a(84),
               o = a(101),
               s = a(921);
            const r = {
                  setup: function (e) {
                     switch (n.A.states.selfPeerId = e.selfPeerId, e.milestone.name) {
                        case "seating":
                           e.milestone.lastRound && e.milestone.lastRound.winner.peerId !== e.selfPeerId && ($(".winnerNickname.streamerMode").text(`Guest (${e.milestone.lastRound.winner.peerId})`), n.A.settings.hideInGameAvatars && ($(".winnerPicture > .streamerMode").show(), $(".winnerPicture > img:not(.streamerMode)").hide()), n.A.settings.hideInGameNicknames && ($(".winnerNickname:not(.streamerMode)").hide(), $(".winnerNickname.streamerMode").show()));
                           break;
                        case "round": {
                           const t = e.milestone;
                           window.parent.postMessage({
                              name: "gameStart",
                              startTime: t.startTime,
                              words: t.usedWordCount
                           }, "*");
                           const a = Object.keys(t.playerStatesByPeerId);
                           window.parent.postMessage({
                              name: "initializeGameStats",
                              peerIds: a,
                              deadPeerIds: a.filter((e => !t.playerStatesByPeerId[Number(e)].lives)),
                              selfPeerId: e.selfPeerId
                           }, "*"), n.A.states.playerGameStats = {};
                           for (const e of a) n.A.states.playerGameStats[e] = {
                              words: 0,
                              hyphenatedWords: 0,
                              longWords: 0,
                              lives: [0, 0],
                              typing: {
                                 startTime: null,
                                 duration: 0
                              },
                              isDead: !1,
                              lastDeathTime: Date.now(),
                              durationWithoutDeath: 0,
                              alpha: {
                                 currentLetter: "a",
                                 completedAlphabets: 0
                              },
                              wordsPerMinute: null,
                              averageReactionTime: null,
                              turnStartTime: null
                           };
                           break
                        }
                     }
                  },
                  setMilestone: function (e) {
                     switch (e.name) {
                        case "seating": {
                           window.parent.postMessage({
                              name: "gameOver"
                           }, "*"), n.A.states.giveUp = !1, n.A.states.lastWord = null, n.A.states.trainingMode.correctWords = 0, n.A.states.trainingMode.wrongWords = 0;
                           const {
                              notifyOnGameOver: t
                           } = n.A.settings;
                           (t === o.mh.Always || t === o.mh.OnlyWhenNotFocused && !document.hasFocus()) && GM_notification({
                              title: "💣 Partie terminée",
                              text: "La partie vient de se terminer, cliquez ici pour y aller.",
                              onclick: () => window.parent.focus(),
                              timeout: 7e3
                           }), e.lastRound && e.lastRound.winner.peerId !== n.A.states.selfPeerId ? ($(".winnerNickname.streamerMode").text(`Guest (${e.lastRound.winner.peerId})`), n.A.settings.hideInGameAvatars && ($(".winnerPicture > .streamerMode").show(), $(".winnerPicture > img:not(.streamerMode)").hide()), n.A.settings.hideInGameNicknames && ($(".winnerNickname:not(.streamerMode)").hide(), $(".winnerNickname.streamerMode").show())) : ($(".winnerPicture > .streamerMode").hide(), $(".winnerPicture > img:not(.streamerMode)").show(), $(".winnerNickname:not(.streamerMode)").show(), $(".winnerNickname.streamerMode").hide());
                           break
                        }
                        case "round": {
                           window.parent.postMessage({
                              name: "gameStart",
                              startTime: e.startTime,
                              words: 0
                           }, "*");
                           const t = Object.keys(e.playerStatesByPeerId);
                           window.parent.postMessage({
                              name: "initializeGameStats",
                              peerIds: t,
                              deadPeerIds: t.filter((t => !e.playerStatesByPeerId[Number(t)].lives)),
                              selfPeerId: n.A.states.selfPeerId
                           }, "*"), n.A.states.playerGameStats = {};
                           for (const e of t) n.A.states.playerGameStats[e] = {
                              words: 0,
                              hyphenatedWords: 0,
                              longWords: 0,
                              lives: [0, 0],
                              typing: {
                                 startTime: null,
                                 duration: 0
                              },
                              isDead: !1,
                              lastDeathTime: Date.now(),
                              durationWithoutDeath: 0,
                              alpha: {
                                 currentLetter: "a",
                                 completedAlphabets: 0
                              },
                              wordsPerMinute: null,
                              averageReactionTime: null,
                              turnStartTime: null
                           };
                           if (n.A.settings.trainListId) {
                              const e = n.A.settings.trainLists.find((e => e.id === n.A.settings.trainListId));
                              window.parent.postMessage({
                                 name: "trainingModeStats",
                                 correctWords: 0,
                                 successRate: 1,
                                 totalWords: e.words.length
                              }, "*")
                           }
                           break
                        }
                     }
                  },
                  nextTurn: function (e, t, a) {
                     const i = n.A.states.playerGameStats[e];
                     i && (i.turnStartTime = Date.now(), n.A.states.giveUp && e === n.A.states.selfPeerId && n.A.socket.emit("setWord", "/suicide", !0))
                  },
                  livesLost: function (e, t) {
                     !t && n.A.states.giveUp && e === n.A.states.selfPeerId && (n.A.states.giveUp = !1);
                     const a = n.A.states.playerGameStats[e];
                     if (!a) return;
                     a.lives[1] += 1;
                     const i = Date.now();
                     a.durationWithoutDeath = i - a.lastDeathTime, a.lastDeathTime = i, a.typing.startTime && (a.typing.startTime = null), window.parent.postMessage({
                        name: "updateGameStats",
                        playerPeerId: e,
                        stats: {
                           lives: a.lives,
                           isDead: !t,
                           durationWithoutDeath: a.durationWithoutDeath
                        }
                     }, "*")
                  },
                  correctWord: function (e) {
                     const {
                        lastWord: t
                     } = n.A.states;
                     window.parent.postMessage({
                        name: "correctWord",
                        playerPeerId: e.playerPeerId,
                        word: t
                     }, "*");
                     const a = n.A.states.playerGameStats[e.playerPeerId];
                     if (a) {
                        if (a.words += 1, t.includes("-") && (a.hyphenatedWords += 1), t.length >= 20 && (a.longWords += 1), a.typing.startTime && (a.typing.duration += Date.now() - a.typing.startTime, a.wordsPerMinute = a.words / a.typing.duration * 6e4), t[0] === a.alpha.currentLetter) {
                           const e = s.A.ALPHA_LETTERS.indexOf(a.alpha.currentLetter) + 1,
                              t = s.A.ALPHA_LETTERS[e];
                           t ? a.alpha.currentLetter = t : (a.alpha.currentLetter = "a", a.alpha.completedAlphabets += 1)
                        }
                        if (window.parent.postMessage({
                              name: "updateGameStats",
                              playerPeerId: e.playerPeerId,
                              stats: {
                                 words: a.words,
                                 wordsPerMinute: a.wordsPerMinute,
                                 hyphenatedWords: a.hyphenatedWords,
                                 longWords: a.longWords,
                                 alpha: a.alpha
                              }
                           }, "*"), a.typing.startTime && (a.typing.startTime = null), n.A.settings.trainListId && n.A.states.selfPeerId === e.playerPeerId) {
                           const e = n.A.settings.trainLists.find((e => e.id === n.A.settings.trainListId));
                           e.words.includes(n.A.states.lastWord) ? (n.A.states.trainingMode.correctWords += 1, n.A.settings.enableTrainMessages && window.parent.postMessage({
                              name: "appendToChat",
                              text: `✅ Mot de la liste: ${n.A.states.lastWord.toUpperCase()}.`
                           }, "https://jklm.fun")) : (n.A.states.trainingMode.wrongWords += 1, n.A.settings.enableTrainMessages && window.parent.postMessage({
                              name: "appendToChat",
                              text: `❌ Mot hors liste: ${n.A.states.lastWord.toUpperCase()}.`
                           }, "https://jklm.fun")), n.A.states.trainingMode.successRate = n.A.states.trainingMode.correctWords / (n.A.states.trainingMode.correctWords + n.A.states.trainingMode.wrongWords), window.parent.postMessage({
                              name: "trainingModeStats",
                              correctWords: n.A.states.trainingMode.correctWords,
                              successRate: n.A.states.trainingMode.successRate,
                              totalWords: e.words.length
                           }, "*")
                        }
                     }
                  },
                  setPlayerWord: function (e, t) {
                     n.A.states.lastWord = (0, i.CR)(t);
                     const a = n.A.states.playerGameStats[e];
                     if (a && (a.typing.startTime || (a.typing.startTime = Date.now()), a.turnStartTime)) {
                        const t = Date.now() - a.turnStartTime;
                        a.averageReactionTime = a.averageReactionTime ? (a.averageReactionTime + t) / 2 : t, a.turnStartTime = null, window.parent.postMessage({
                           name: "updateGameStats",
                           playerPeerId: e,
                           stats: {
                              averageReactionTime: a.averageReactionTime
                           }
                        }, "*")
                     }
                  },
                  bonusAlphabetCompleted: function (e, t) {
                     const a = n.A.states.playerGameStats[e];
                     a && (a.lives[0] += 1, window.parent.postMessage({
                        name: "updateGameStats",
                        playerPeerId: e,
                        stats: {
                           lives: a.lives
                        }
                     }, "*"))
                  },
                  failWord: function (e, t) {
                     const a = n.A.states.playerGameStats[e];
                     a && a.typing.startTime && (a.typing.startTime = null)
                  }
               },
               l = {
                  keydown: function (e) {
                     const {
                        enableTabKey: t,
                        enableGiveUpShortcut: a,
                        enableSkipTurnShortcut: i
                     } = n.A.settings;
                     t || "Tab" !== e.key ? a && e.altKey && "Delete" === e.key ? (n.A.socket.emit("setWord", "/suicide", !0), n.A.states.giveUp = !0) : i && "Delete" === e.key && n.A.socket.emit("setWord", "/suicide", !0) : e.preventDefault()
                  }
               };
            console.log(`🎉 PartyPlus Overlay (v${GM_info.script.version}): game module is running`), (() => {
               for (const e of Object.keys(r)) n.A.socket.on(e, r[e])
            })(), (() => {
               for (const e of Object.keys(l)) window.addEventListener(e, l[e])
            })(), (() => {
               const {
                  settings: e
               } = n.A;
               animate = t => {
                  requestAnimationFrame(animate);
                  let a = previousAnimateTime > 0 ? t - previousAnimateTime : 0;
                  previousAnimateTime = t;
                  let i = canvas.getBoundingClientRect(),
                     o = i.width,
                     s = i.height;
                  dpr > 1 && !document.hidden && a > 50 ? ++accumulatedSlowFrames > 5 && (console.log("Game is running slowly, downgrading to non-high-density rendering."), dpr = 1) : accumulatedSlowFrames = 0, canvas.width = Math.round(o * dpr), canvas.height = Math.round(s * dpr), ctx.scale(dpr, dpr), ctx.clearRect(0, 0, o, s);
                  let r = "seating" === milestone.name && null == milestone.lastRound && 0 === players.length;
                  if (r) {
                     ctx.save(), ctx.translate(o / 2, s / 2);
                     let e = Math.min(.5, o / logo.width);
                     ctx.scale(e, e), logo.complete && jklmGfx.draw(ctx, logo), ctx.restore()
                  }
                  ctx.font = '1em "Lato"', ctx.textAlign = "center", ctx.textBaseline = "middle";
                  let l = 0,
                     c = Math.max(50, Math.min(250, o / 2 - 60, s / 2 - 100)),
                     d = Math.max(.5, c / 250),
                     u = 1 + Math.min(d, 1 / Math.max(1, players.length - 4)),
                     p = 40 * d;
                  if (ctx.save(), ctx.translate(o / 2, s / 2), ctx.scale(d, d), "round" === milestone.name && (null != animateBackground && (ctx.save(), animateBackground(a, o, s, d), ctx.restore()), statsTimerTd.textContent = jklmMath.formatSeconds(jklmMath.secondsSince(milestone.startTime + serverToLocalNow)), ctx.save(), lerpArrowAngle = jklmMath.lerpAngle(lerpArrowAngle, arrowAngle, .15), ctx.rotate(lerpArrowAngle), arrow.complete && jklmGfx.draw(ctx, arrow), ctx.restore()), !r && null == milestone.lastRound && bomb.complete)
                     if ("round" === milestone.name) {
                        bombPulseTimer++;
                        let e = bombPulseTimer % 20 / 20,
                           t = 1.05 - .05 * e * e;
                        ctx.scale(t, t), jklmGfx.draw(ctx, bomb), ctx.save(), ctx.translate(50, -65), ctx.rotate(Math.random() * Math.PI * 2);
                        let a = .8 + .4 * Math.random();
                        ctx.scale(a, a), spark.complete && jklmGfx.draw(ctx, spark), ctx.restore()
                     } else jklmGfx.draw(ctx, bomb);
                  if (0 !== explosionStartTime) {
                     let e = Date.now() - explosionStartTime;
                     if (e > explosionDuration) explosionStartTime = 0;
                     else {
                        let t = e / explosionDuration,
                           a = 1 - Math.pow(t, 5);
                        ctx.save(), ctx.scale(2 + 2 * a, 2 + 2 * a), ctx.font = '4em "Lato"', ctx.fillStyle = `rgba(255, 255, 255, ${.5*(1-t)})`, ctx.rotate(Math.random() * Math.PI * 2), ctx.fillText("💥", 0, 0), ctx.restore()
                     }
                  }
                  if (ctx.restore(), "round" === milestone.name) {
                     let t = milestone.playerStatesByPeerId[selfPeerId];
                     if (null != t && c > 50) {
                        let a = o < 400 + 2 * c,
                           n = a ? 24 : 36;
                        ctx.textAlign = "center", ctx.save(), a ? ctx.translate(8, s - n - 8) : ctx.translate(o - n - 8, 8), ctx.translate(n / 2, n / 2);
                        let i = 0,
                           r = 0,
                           l = rules.customBonusAlphabet.value;
                        for (let c in l) 0 !== l[c] && (ctx.save(), ctx.translate(a ? i : r, a ? r : i), ctx.fillStyle = t.bonusLetters[c] <= 0 ? e.usedBonusLettersColor : e.remainingBonusLettersColor, ctx.fillRect(-n / 2, -n / 2, n, n), ctx.font = 'bold 1em "Lato"', ctx.fillStyle = "#444", ctx.fillText(c.toUpperCase(), 0, 0), ctx.restore(), l[c] > 0 && t.bonusLetters[c] > 1 && (ctx.font = "bold 0.7em 'Lato'", ctx.fillStyle = "#444", ctx.fillText(t.bonusLetters[c], a ? i - n / 3.5 : r - n / 3.5, a ? r + 2 * n / 6 : i + 2 * n / 5.5)), i += n + 8, a ? i + n + 16 > o && (i = 0, r -= n + 8) : i + n + 16 > s && (i = 0, r -= n + 8));
                        ctx.restore()
                     }
                  }
                  let h = c <= 50;

                  function g(e) {
                     l = e / players.length * Math.PI * 2;
                     let t = Math.cos(l) * c,
                        a = Math.sin(l) * c;
                     ctx.save(), ctx.translate(o / 2 + t, s / 2 + a), ctx.scale(u, u)
                  }! function () {
                     ctx.fillStyle = "#888", ctx.shadowColor = "rgba(0,0,0,0.5)", ctx.shadowBlur = 2, ctx.font = '1.25em "Lato"';
                     for (let t = 0; t < players.length; t++) {
                        let a = players[t];
                        g(t), ctx.save();
                        let {
                           animation: i
                        } = playersByPeerId[a.profile.peerId], o = 0;
                        if (null != i)
                           if ((o = (Date.now() - i.startTime) / i.duration) < 1) switch (i.type) {
                              case "join": {
                                 let e = Math.pow(1 - o, 3),
                                    t = 1 - .5 * e;
                                 ctx.scale(t, t), ctx.rotate(Math.PI / 4 * e);
                                 break
                              }
                              case "failWord_mustContainSyllable":
                              case "failWord_notInDictionary":
                              case "failWord_alreadyUsed": {
                                 let e = 10 * (1 - o);
                                 ctx.translate(Math.cos(20 * o) * e, 0);
                                 break
                              }
                              case "correct": {
                                 let e = Math.pow(1 - o, 3),
                                    t = 1 + .3 * e;
                                 ctx.scale(t, t), ctx.rotate(i.angle * e);
                                 break
                              }
                              case "woo": {
                                 let e = Math.pow(1 - o, 3),
                                    t = 1 + .3 * e;
                                 ctx.scale(1, t), ctx.rotate(2 * Math.PI * (1 - e));
                                 break
                              }
                              case "loseLife": {
                                 let e = 1 - .2 * Math.pow(1 - o, 3);
                                 ctx.scale(1, e);
                                 let t = 10 * (1 - o),
                                    a = 10 * Math.pow(1 - o, 2);
                                 ctx.translate(Math.cos(20 * o) * t, a)
                              }
                           } else playersByPeerId[a.profile.peerId].animation = null;
                        if (e.hideInGameAvatars && a.profile.peerId !== n.A.states.selfPeerId || !a.image.src.length || !a.image.complete || 0 === a.image.naturalHeight ? (ctx.fillRect(-p / 2, -p / 2, p, p), ctx.save(), ctx.globalAlpha = .5, ctx.scale(d, d), ctx.fillText("👤", 0, 0), ctx.restore()) : ctx.drawImage(a.image, -p / 2, -p / 2, p, p), ctx.restore(), null != i) {
                           let e = 1 - Math.pow(1 - o, 2);
                           switch (i.type) {
                              case "loseLife":
                                 let t = milestone.playerStatesByPeerId[a.profile.peerId];
                                 ctx.fillStyle = t.lives > 0 ? `rgba(255, ${Math.floor(255*(1-e))}, 0, ${.5-.5*e})` : `rgba(0, 0, 0, ${.5-.5*e})`, ctx.scale(1 + e, 1 + e), ctx.beginPath(), ctx.arc(0, 0, p, 0, 2 * Math.PI), ctx.fill(), 0 === t.lives ? (ctx.scale(3, 3), ctx.fillText("☠", 0, 0)) : ctx.fillText("💔", 0, -p * (.5 + e / 2));
                                 break;
                              case "correct":
                                 ctx.fillStyle = `rgba(64, ${64+Math.floor(192*e)}, 64, ${.5-.5*e})`, ctx.scale(1 + e, 1 + e), ctx.beginPath(), ctx.arc(0, 0, p, 0, 2 * Math.PI), ctx.fill(), ctx.fillText("✔️", 0, -p * (.5 + e / 2));
                                 break;
                              case "failWord_mustContainSyllable":
                              case "failWord_notInDictionary":
                              case "failWord_alreadyUsed":
                                 ctx.fillStyle = `rgba(255, 255, 255, ${.5-.5*e})`, ctx.scale(1 + e, 1 + e), ctx.fillText("failWord_alreadyUsed" === i.type ? "🔒" : "❌", 0, -p * (.5 + e / 2));
                                 break;
                              case "woo":
                                 ctx.fillStyle = `rgba(255, 255, 255, ${.5-.5*e})`, ctx.scale(1 + e, 1 + e), ctx.beginPath(), ctx.arc(0, 0, p, 0, 2 * Math.PI), ctx.fill(), ctx.fillText("💖", 0, -p * (.5 + e / 2))
                           }
                        }
                        ctx.restore()
                     }
                  }(),
                  function () {
                     if ("round" === milestone.name) {
                        ctx.font = .7 / d + 'em "Lato"';
                        for (let t = 0; t < players.length; t++) {
                           let a = players[t];
                           g(t), ctx.scale(d, d);
                           let n = milestone.playerStatesByPeerId[a.profile.peerId],
                              i = n.lives > 0 ? (n.hasBirthday ? "🍰" : e.lifeEmoji).repeat(n.lives) : e.deathEmoji;
                           ctx.fillText(i, 0, -20), ctx.restore()
                        }
                     }
                  }(),
                  function () {
                     ctx.globalAlpha = 1, ctx.shadowColor = "black", ctx.shadowBlur = 4, ctx.textAlign = "center";
                     for (let t = 0; t < players.length; t++) {
                        let a = players[t];
                        if (h && a.profile.peerId !== selfPeerId) continue;
                        g(t), ctx.font = (a.isOnline ? "" : "italic ") + '0.75em "Lato"', ctx.fillStyle = a.isOnline ? e.presentPlayerNicknamesColor : e.absentPlayerNicknamesColor;
                        let i = e.hideInGameNicknames && a.profile.peerId !== n.A.states.selfPeerId ? `Guest (${a.profile.peerId})` : a.profile.nickname;
                        if (i.length > 1 && ctx.measureText(i).width > 100 * d) {
                           let e = Array.from(i);
                           for (; e.length > 1 && ctx.measureText(e.join("")).width > 100 * d;) e.splice(e.length - 1);
                           i = e.join("") + "…"
                        }
                        "round" === milestone.name && milestone.playerStatesByPeerId[a.profile.peerId].hasBirthday && (i = `🥳 ${i}`), ctx.fillText(i, 0, -p / 2 - 15), ctx.restore()
                     }
                     ctx.shadowColor = "transparent"
                  }(),
                  function () {
                     if ("round" === milestone.name) {
                        ctx.shadowColor = "black", ctx.shadowBlur = 2, ctx.textAlign = "left";
                        for (let t = 0; t < players.length; t++) {
                           let a = players[t],
                              n = a.profile.peerId === milestone.currentPlayerPeerId;
                           if (h && !n) continue;
                           g(t), ctx.font = (n ? "bold " : "") + '0.75em "Lato"';
                           let i = n ? e.currentPlayerWordColor : e.otherPlayersWordColor;
                           ctx.fillStyle = i;
                           let {
                              word: o,
                              syllable: s,
                              wasWordValidated: r
                           } = milestone.playerStatesByPeerId[a.profile.peerId], l = null != s ? o.indexOf(s) : -1, c = ctx.measureText(o.toUpperCase()).width, d = -c / 2, u = 0 + p / 2 + 15;
                           if (-1 !== l) {
                              let t = o.substring(0, l),
                                 a = o.substring(l + s.length);
                              ctx.fillText(t.toUpperCase(), d, u), d += ctx.measureText(t.toUpperCase()).width, ctx.fillStyle = e.wordSyllableColor, ctx.fillText(s.toUpperCase(), d, u), d += ctx.measureText(s.toUpperCase()).width, ctx.fillStyle = i, ctx.fillText(a.toUpperCase(), d, u)
                           } else ctx.fillText(o.toUpperCase(), d, u);
                           n || r || ctx.fillRect(-c / 2, u - 1, c, 2), ctx.restore()
                        }
                     }
                  }()
               }
            })(), $(".winnerPicture").append('\n      <img\n         class="streamerMode"\n         src="/images/auth/guest.png"\n      />\n   '), $(".winnerPicture .streamerMode").hide(), $('\n      <div class="winnerNickname streamerMode"></div>\n   ').insertAfter(".winnerNickname"), $(".winnerNickname.streamerMode").hide(), $('.selfTurn input[type="text"]').on("keydown", (e => {
               const {
                  trainListId: t,
                  forceTrainList: a
               } = n.A.settings;
               if ("Enter" === e.key && t && a) {
                  const a = $(e.target),
                     {
                        words: o
                     } = n.A.settings.trainLists.find((e => e.id === t)),
                     s = (0, i.CR)(a.val().toString());
                  o.includes(s) || (e.preventDefault(), a.val(""))
               }
            })), (0, i.PB)()
         },
         421: (e, t, a) => {
            a.r(t);
            var n = a(921),
               i = a(101),
               o = a(980),
               s = a(84);

            function r(e) {
               const t = Date.now() - e,
                  a = Math.floor(t / 1e3 / 60 / 60),
                  n = Math.floor(t / 1e3 / 60),
                  i = n - 60 * a,
                  o = Math.floor(t / 1e3) - 60 * n;
               return `${a.toString().padStart(2,"0")}:${i.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}`
            }
            const l = {
               keydown: function (e) {
                  const {
                     enableTabKey: t
                  } = o.A.settings;
                  t || "Tab" !== e.key || e.preventDefault()
               },
               message: function (e) {
                  switch (e.data.name) {
                     case "gameStart": {
                        $(".statsTable").show();
                        const t = $(".gameStats");
                        t.show();
                        const {
                           startTime: a,
                           words: n
                        } = e.data;
                        if (t.find("> .time").text(r(a)), t.find("> .words").text(`(${n} ${(0,s.td)(n,"mot","mots")})`), o.A.gameTimerInterval = setInterval((() => {
                              t.find("> .time").text(r(a))
                           }), 1e3), o.A.settings.trainListId) {
                           $(".trainingModeStats").show();
                           const e = o.A.settings.trainLists.find((e => e.id === o.A.settings.trainListId));
                           $(".trainingModeStats .correctWords").text("0"), $(".trainingModeStats .totalWords").text(`${(0,s.ZV)(e.words.length)} ${(0,s.td)(e.words.length,"mot","mots")}`)
                        }
                        break
                     }
                     case "gameOver":
                        clearInterval(o.A.gameTimerInterval), o.A.gameTimerInterval = null;
                        break;
                     case "correctWord": {
                        const e = $(".gameStats");
                        if ("none" === e.css("display")) return;
                        const t = parseInt(e.find("> .words").text().match(/\d+/)[0]) + 1;
                        $(".gameStats > .words").text(`(${t} ${(0,s.td)(t,"mot","mots")})`);
                        break
                     }
                     case "trainingModeStats": {
                        const {
                           correctWords: t,
                           successRate: a,
                           totalWords: n
                        } = e.data;
                        $(".trainingModeStats .correctWords").text((0, s.ZV)(t)), $(".trainingModeStats .totalWords").text(`${(0,s.ZV)(n)} ${(0,s.td)(n,"mot","mots")}`), $(".trainingModeStats .successRate").text(`(${(100*a).toFixed(1)}%)`);
                        break
                     }
                     case "initializeGameStats": {
                        const t = $(".statsTable > tbody"),
                           {
                              peerIds: a,
                              deadPeerIds: n,
                              selfPeerId: i
                           } = e.data;
                        t.empty(), o.A.socket.emit("getChatterProfiles", (e => {
                           for (const o of a) {
                              const a = e.find((e => e.peerId === Number(o)));
                              a && (t.append(`\n                  <tr id="${o}" ${Number(o)===i?'class="self"':""}>\n                     <td class="nickname" title="${a.nickname}">${a.nickname}</td>\n                     <td class="words">0</td>\n                     <td class="alpha">A (0)</td>\n                     <td class="hyphenatedWords">0</td>\n                     <td class="longWords">0</td>\n                     <td class="lives">+0 / -0</td>\n                     <td class="durationWithoutDeath">-</td>\n                     <td class="wordsPerMinute">-</td>\n                     <td class="averageReactionTime">-</td>\n                  </tr>\n               `), (null != n ? n : []).includes(o) && $(`#${o}`).addClass("isDead"))
                           }(0, s.PB)()
                        }));
                        break
                     }
                     case "updateGameStats": {
                        const {
                           playerPeerId: t,
                           stats: a
                        } = e.data;
                        for (const e of Object.keys(a)) {
                           const n = a[e],
                              i = $(`#${t}`);
                           switch (e) {
                              case "words":
                                 i.find("> .words").text((0, s.ZV)(n));
                                 break;
                              case "hyphenatedWords":
                                 i.find("> .hyphenatedWords").text((0, s.ZV)(n));
                                 break;
                              case "alpha":
                                 i.find("> .alpha").text(`${n.currentLetter.toUpperCase()} (${n.completedAlphabets})`);
                                 break;
                              case "lives":
                                 i.find("> .lives").text(`+${n[0]} / -${n[1]}`);
                                 break;
                              case "durationWithoutDeath": {
                                 const e = e => {
                                    const t = Math.floor(e / 1e3),
                                       a = Math.floor(t / 60),
                                       n = Math.floor(a / 60);
                                    return `${n?`${n}h `:""}${a?a%60+"m ":""}${t%60}s`
                                 };
                                 i.find("> .durationWithoutDeath").text(e(n));
                                 break
                              }
                              case "wordsPerMinute":
                                 i.find("> .wordsPerMinute").text(`${parseInt(n)} mpm`);
                                 break;
                              case "averageReactionTime":
                                 i.find("> .averageReactionTime").text(`${(parseInt(n)/1e3).toFixed(2)}s`);
                                 break;
                              case "isDead":
                                 n && i.addClass("isDead")
                           }
                        }
                        break
                     }
                  }
               }
            };
            let c = !1,
               d = [];
            const u = void 0 !== window.ontouchstart,
               p = JSON.parse('{"😀":["grinning","grinning_face"],"😃":["smiley"],"😄":["smile"],"😁":["grin"],"😆":["laughing","satisfied"],"😅":["sweat_smile"],"🤣":["rofl","rolling_on_the_floor_laughing"],"😂":["joy"],"🙂":["slight_smile","slightly_smiling_face"],"🙃":["upside_down","upside_down_face"],"🫠":["melting_face"],"😉":["wink","winking_face"],"😊":["blush"],"😇":["innocent"],"🥰":["smiling_face_with_3_hearts"],"😍":["heart_eyes"],"🤩":["star_struck"],"😘":["kissing_heart"],"😗":["kissing","kissing_face"],"☺️":["relaxed","smiling_face"],"😚":["kissing_closed_eyes"],"😙":["kissing_smiling_eyes"],"🥲":["smiling_face_with_tear"],"😋":["yum"],"😛":["stuck_out_tongue"],"😜":["stuck_out_tongue_winking_eye"],"🤪":["zany_face"],"😝":["stuck_out_tongue_closed_eyes"],"🤑":["money_mouth","money_mouth_face"],"🤗":["hugging","hugging_face"],"🤭":["face_with_hand_over_mouth"],"🫢":["face_with_open_eyes_and_hand_over_mouth"],"🫣":["face_with_peeking_eye"],"🤫":["shushing_face"],"🤔":["thinking","thinking_face"],"🫡":["saluting_face"],"🤐":["zipper_mouth","zipper_mouth_face"],"🤨":["face_with_raised_eyebrow"],"😐️":["neutral_face"],"😑":["expressionless"],"😶":["no_mouth"],"🫥":["dotted_line_face"],"😶‍🌫️":["face_in_clouds"],"😏":["smirk","smirking_face"],"😒":["unamused","unamused_face"],"🙄":["face_with_rolling_eyes","rolling_eyes"],"😬":["grimacing"],"😮‍💨":["face_exhaling"],"🤥":["liar","lying_face"],"🫨":["shaking_face"],"😌":["relieved","relieved_face"],"😔":["pensive","pensive_face"],"😪":["sleepy","sleepy_face"],"🤤":["drool","drooling_face"],"😴":["sleeping","sleeping_face"],"😷":["mask"],"🤒":["face_with_thermometer","thermometer_face"],"🤕":["face_with_head_bandage","head_bandage"],"🤢":["nauseated_face","sick"],"🤮":["face_vomiting"],"🤧":["sneeze","sneezing_face"],"🥵":["hot_face"],"🥶":["cold_face"],"🥴":["woozy_face"],"😵":["dizzy_face"],"😵‍💫":["face_with_spiral_eyes"],"🤯":["exploding_head"],"🤠":["cowboy","face_with_cowboy_hat"],"🥳":["partying_face"],"🥸":["disguised_face"],"😎":["sunglasses"],"🤓":["nerd","nerd_face"],"🧐":["face_with_monocle"],"😕":["confused","confused_face"],"🫤":["face_with_diagonal_mouth"],"😟":["worried","worried_face"],"🙁":["slight_frown","slightly_frowning_face"],"☹️":["frowning2","frowning_face","white_frowning_face"],"😮":["open_mouth"],"😯":["hushed","hushed_face"],"😲":["astonished"],"😳":["flushed","flushed_face"],"🥺":["pleading_face"],"🥹":["face_holding_back_tears"],"😦":["frowning"],"😧":["anguished"],"😨":["fearful","fearful_face"],"😰":["cold_sweat"],"😥":["disappointed_relieved"],"😢":["cry","crying_face"],"😭":["sob"],"😱":["scream"],"😖":["confounded"],"😣":["persevere"],"😞":["disappointed"],"😓":["sweat"],"😩":["weary","weary_face"],"😫":["tired_face"],"🥱":["yawning_face"],"😤":["triumph"],"😡":["pouting_face","rage"],"😠":["angry","angry_face"],"🤬":["face_with_symbols_over_mouth"],"😈":["smiling_imp"],"👿":["imp"],"💀":["skeleton","skull"],"☠️":["skull_and_crossbones","skull_crossbones"],"💩":["hankey","pile_of_poo","poo","poop","shit"],"🤡":["clown","clown_face"],"👹":["japanese_ogre","ogre"],"👺":["goblin","japanese_goblin"],"👻":["ghost"],"👽️":["alien"],"👾":["alien_monster","space_invader"],"🤖":["robot","robot_face"],"😺":["grinning_cat","smiley_cat"],"😸":["smile_cat"],"😹":["joy_cat"],"😻":["heart_eyes_cat"],"😼":["smirk_cat"],"😽":["kissing_cat"],"🙀":["scream_cat","weary_cat"],"😿":["crying_cat","crying_cat_face"],"😾":["pouting_cat"],"🙈":["see_no_evil"],"🙉":["hear_no_evil"],"🙊":["speak_no_evil"],"💌":["love_letter"],"💘":["cupid"],"💝":["gift_heart"],"💖":["sparkling_heart"],"💗":["growing_heart","heartpulse"],"💓":["beating_heart","heartbeat"],"💞":["revolving_hearts"],"💕":["two_hearts"],"💟":["heart_decoration"],"❣️":["heart_exclamation","heavy_heart_exclamation_mark_ornament"],"💔":["broken_heart"],"❤️‍🔥":["heart_on_fire"],"❤️‍🩹":["mending_heart"],"❤️":["heart","red_heart"],"🩷":["pink_heart"],"🧡":["orange_heart"],"💛":["yellow_heart"],"💚":["green_heart"],"💙":["blue_heart"],"🩵":["light_blue_heart"],"💜":["purple_heart"],"🤎":["brown_heart"],"🖤":["black_heart"],"🩶":["grey_heart"],"🤍":["white_heart"],"💋":["kiss","kiss_mark"],"💯":["100"],"💢":["anger"],"💥":["boom","collision"],"💫":["dizzy"],"💦":["sweat_drops"],"💨":["dash","dashing_away"],"🕳️":["hole"],"💬":["speech_balloon"],"👁️‍🗨️":["eye_in_speech_bubble"],"🗨️":["left_speech_bubble","speech_left"],"🗯️":["anger_right","right_anger_bubble"],"💭":["thought_balloon"],"💤":["zzz"],"👋":["wave","waving_hand"],"🤚":["back_of_hand","raised_back_of_hand"],"🖐️":["hand_splayed","raised_hand_with_fingers_splayed"],"✋️":["raised_hand"],"🖖":["raised_hand_with_part_between_middle_and_ring_fingers","vulcan","vulcan_salute"],"🫱":["rightwards_hand"],"🫲":["leftwards_hand"],"🫳":["palm_down_hand"],"🫴":["palm_up_hand"],"🫷":["leftwards_pushing_hand"],"🫸":["rightwards_pushing_hand"],"👌":["ok_hand"],"🤌":["pinched_fingers"],"🤏":["pinching_hand"],"✌️":["v","victory_hand"],"🤞":["fingers_crossed","hand_with_index_and_middle_finger_crossed"],"🫰":["hand_with_index_finger_and_thumb_crossed"],"🤟":["love_you_gesture"],"🤘":["metal","sign_of_the_horns"],"🤙":["call_me","call_me_hand"],"👈️":["point_left"],"👉️":["point_right"],"👆️":["point_up_2"],"🖕":["middle_finger","reversed_hand_with_middle_finger_extended"],"👇️":["point_down"],"☝️":["point_up"],"🫵":["index_pointing_at_the_viewer"],"👍️":["+1","thumbs_up","thumbsup","thumbup"],"👎️":["-1","thumbdown","thumbs_down","thumbsdown"],"✊️":["fist","raised_fist"],"👊":["oncoming_fist","punch"],"🤛":["left_facing_fist","left_fist"],"🤜":["right_facing_fist","right_fist"],"👏":["clap"],"🙌":["raised_hands","raising_hands"],"🫶":["heart_hands"],"👐":["open_hands"],"🤲":["palms_up_together"],"🤝":["handshake","shaking_hands"],"🙏":["folded_hands","pray"],"✍️":["writing_hand"],"💅":["nail_care","nail_polish"],"🤳":["selfie"],"💪":["flexed_biceps","muscle"],"🦾":["mechanical_arm"],"🦿":["mechanical_leg"],"🦵":["leg"],"🦶":["foot"],"👂️":["ear"],"🦻":["ear_with_hearing_aid"],"👃":["nose"],"🧠":["brain"],"🫀":["anatomical_heart"],"🫁":["lungs"],"🦷":["tooth"],"🦴":["bone"],"👀":["eyes"],"👁️":["eye"],"👅":["tongue"],"👄":["lips","mouth"],"🫦":["biting_lip"],"👶":["baby"],"🧒":["child"],"👦":["boy"],"👧":["girl"],"🧑":["adult","person"],"👱":["blond_haired_person","person_with_blond_hair"],"👨":["man"],"🧔":["bearded_person","person_beard"],"🧔‍♂️":["man_beard"],"🧔‍♀️":["woman_beard"],"👨‍🦰":["man_red_hair","man_red_haired"],"👨‍🦱":["man_curly_haired"],"👨‍🦳":["man_white_haired"],"👨‍🦲":["man_bald"],"👩":["woman"],"👩‍🦰":["woman_red_haired"],"🧑‍🦰":["person_red_hair"],"👩‍🦱":["woman_curly_haired"],"🧑‍🦱":["person_curly_hair"],"👩‍🦳":["woman_white_haired"],"🧑‍🦳":["person_white_hair"],"👩‍🦲":["woman_bald"],"🧑‍🦲":["person_bald"],"👱‍♀️":["blond-haired_woman"],"👱‍♂️":["blond-haired_man"],"🧓":["older_adult","older_person"],"👴":["old_man","older_man"],"👵":["grandma","old_woman","older_woman"],"🙍":["person_frowning"],"🙍‍♂️":["man_frowning"],"🙍‍♀️":["woman_frowning"],"🙎":["person_pouting","person_with_pouting_face"],"🙎‍♂️":["man_pouting"],"🙎‍♀️":["woman_pouting"],"🙅":["no_good","person_gesturing_no"],"🙅‍♂️":["man_gesturing_no"],"🙅‍♀️":["woman_gesturing_no"],"🙆":["ok_woman","person_gesturing_ok"],"🙆‍♂️":["man_gesturing_ok"],"🙆‍♀️":["woman_gesturing_ok"],"💁":["information_desk_person","person_tipping_hand"],"💁‍♂️":["man_tipping_hand"],"💁‍♀️":["woman_tipping_hand"],"🙋":["person_raising_hand","raising_hand"],"🙋‍♂️":["man_raising_hand"],"🙋‍♀️":["woman_raising_hand"],"🧏":["deaf_person"],"🧏‍♂️":["deaf_man"],"🧏‍♀️":["deaf_woman"],"🙇":["bow","person_bowing"],"🙇‍♂️":["man_bowing"],"🙇‍♀️":["woman_bowing"],"🤦":["face_palm","facepalm","person_facepalming"],"🤦‍♂️":["man_facepalming"],"🤦‍♀️":["woman_facepalming"],"🤷":["person_shrugging","shrug"],"🤷‍♂️":["man_shrugging"],"🤷‍♀️":["woman_shrugging"],"🧑‍⚕️":["health_worker"],"👨‍⚕️":["man_health_worker"],"👩‍⚕️":["woman_health_worker"],"🧑‍🎓":["student"],"👨‍🎓":["man_student"],"👩‍🎓":["woman_student"],"🧑‍🏫":["teacher"],"👨‍🏫":["man_teacher"],"👩‍🏫":["woman_teacher"],"🧑‍⚖️":["judge"],"👨‍⚖️":["man_judge"],"👩‍⚖️":["woman_judge"],"🧑‍🌾":["farmer"],"👨‍🌾":["man_farmer"],"👩‍🌾":["woman_farmer"],"🧑‍🍳":["cook"],"👨‍🍳":["man_cook"],"👩‍🍳":["woman_cook"],"🧑‍🔧":["mechanic"],"👨‍🔧":["man_mechanic"],"👩‍🔧":["woman_mechanic"],"🧑‍🏭":["factory_worker"],"👨‍🏭":["man_factory_worker"],"👩‍🏭":["woman_factory_worker"],"🧑‍💼":["office_worker"],"👨‍💼":["man_office_worker"],"👩‍💼":["woman_office_worker"],"🧑‍🔬":["scientist"],"👨‍🔬":["man_scientist"],"👩‍🔬":["woman_scientist"],"🧑‍💻":["technologist"],"👨‍💻":["man_technologist"],"👩‍💻":["woman_technologist"],"🧑‍🎤":["singer"],"👨‍🎤":["man_singer"],"👩‍🎤":["woman_singer"],"🧑‍🎨":["artist"],"👨‍🎨":["man_artist"],"👩‍🎨":["woman_artist"],"🧑‍✈️":["pilot"],"👨‍✈️":["man_pilot"],"👩‍✈️":["woman_pilot"],"🧑‍🚀":["astronaut"],"👨‍🚀":["man_astronaut"],"👩‍🚀":["woman_astronaut"],"🧑‍🚒":["firefighter"],"👨‍🚒":["man_firefighter"],"👩‍🚒":["woman_firefighter"],"👮":["cop","police_officer"],"👮‍♂️":["man_police_officer"],"👮‍♀️":["woman_police_officer"],"🕵️":["detective","sleuth_or_spy","spy"],"🕵️‍♂️":["man_detective"],"🕵️‍♀️":["woman_detective"],"💂":["guard","guardsman"],"💂‍♂️":["man_guard"],"💂‍♀️":["woman_guard"],"🥷":["ninja"],"👷":["construction_worker"],"👷‍♂️":["man_construction_worker"],"👷‍♀️":["woman_construction_worker"],"🫅":["person_with_crown"],"🤴":["prince"],"👸":["princess"],"👳":["man_with_turban","person_wearing_turban"],"👳‍♂️":["man_wearing_turban"],"👳‍♀️":["woman_wearing_turban"],"👲":["man_with_chinese_cap","man_with_gua_pi_mao"],"🧕":["woman_with_headscarf"],"🤵":["person_in_tuxedo"],"🤵‍♂️":["man_in_tuxedo"],"🤵‍♀️":["woman_in_tuxedo"],"👰":["person_with_veil"],"👰‍♂️":["man_with_veil"],"👰‍♀️":["woman_with_veil"],"🤰":["expecting_woman","pregnant_woman"],"🫃":["pregnant_man"],"🫄":["pregnant_person"],"🤱":["breast_feeding"],"👩‍🍼":["woman_feeding_baby"],"👨‍🍼":["man_feeding_baby"],"🧑‍🍼":["person_feeding_baby"],"👼":["angel","baby_angel"],"🎅":["santa","santa_claus"],"🤶":["mother_christmas","mrs_claus"],"🧑‍🎄":["mx_claus"],"🦸":["superhero"],"🦸‍♂️":["man_superhero"],"🦸‍♀️":["woman_superhero"],"🦹":["supervillain"],"🦹‍♂️":["man_supervillain"],"🦹‍♀️":["woman_supervillain"],"🧙":["mage"],"🧙‍♂️":["man_mage"],"🧙‍♀️":["woman_mage"],"🧚":["fairy"],"🧚‍♂️":["man_fairy"],"🧚‍♀️":["woman_fairy"],"🧛":["vampire"],"🧛‍♂️":["man_vampire"],"🧛‍♀️":["woman_vampire"],"🧜":["merperson"],"🧜‍♂️":["merman"],"🧜‍♀️":["mermaid"],"🧝":["elf"],"🧝‍♂️":["man_elf"],"🧝‍♀️":["woman_elf"],"🧞":["genie"],"🧞‍♂️":["man_genie"],"🧞‍♀️":["woman_genie"],"🧟":["zombie"],"🧟‍♂️":["man_zombie"],"🧟‍♀️":["woman_zombie"],"🧌":["troll"],"💆":["massage","person_getting_massage"],"💆‍♂️":["man_getting_face_massage"],"💆‍♀️":["woman_getting_face_massage"],"💇":["haircut","person_getting_haircut"],"💇‍♂️":["man_getting_haircut"],"💇‍♀️":["woman_getting_haircut"],"🚶":["person_walking","walking"],"🚶‍♂️":["man_walking"],"🚶‍♀️":["woman_walking"],"🧍":["person_standing"],"🧍‍♂️":["man_standing"],"🧍‍♀️":["woman_standing"],"🧎":["person_kneeling"],"🧎‍♂️":["man_kneeling"],"🧎‍♀️":["woman_kneeling"],"🧑‍🦯":["person_with_probing_cane"],"👨‍🦯":["man_with_probing_cane"],"👩‍🦯":["woman_with_probing_cane"],"🧑‍🦼":["person_in_motorized_wheelchair"],"👨‍🦼":["man_in_motorized_wheelchair"],"👩‍🦼":["woman_in_motorized_wheelchair"],"🧑‍🦽":["person_in_manual_wheelchair"],"👨‍🦽":["man_in_manual_wheelchair"],"👩‍🦽":["woman_in_manual_wheelchair"],"🏃":["person_running","runner"],"🏃‍♂️":["man_running"],"🏃‍♀️":["woman_running"],"💃":["dancer","woman_dancing"],"🕺":["male_dancer","man_dancing"],"🕴️":["levitate","man_in_business_suit_levitating"],"👯":["dancers","people_with_bunny_ears_partying"],"👯‍♂️":["men_with_bunny_ears_partying"],"👯‍♀️":["women_with_bunny_ears_partying"],"🧖":["person_in_steamy_room"],"🧖‍♂️":["man_in_steamy_room"],"🧖‍♀️":["woman_in_steamy_room"],"🧗":["person_climbing"],"🧗‍♂️":["man_climbing"],"🧗‍♀️":["woman_climbing"],"🤺":["fencer","fencing","person_fencing"],"🏇":["horse_racing"],"⛷️":["skier"],"🏂️":["snowboarder"],"🏌️":["golfer","person_golfing"],"🏌️‍♂️":["man_golfing"],"🏌️‍♀️":["woman_golfing"],"🏄️":["person_surfing","surfer"],"🏄‍♂️":["man_surfing"],"🏄‍♀️":["woman_surfing"],"🚣":["person_rowing_boat","rowboat"],"🚣‍♂️":["man_rowing_boat"],"🚣‍♀️":["woman_rowing_boat"],"🏊️":["person_swimming","swimmer"],"🏊‍♂️":["man_swimming"],"🏊‍♀️":["woman_swimming"],"⛹️":["basketball_player","person_bouncing_ball","person_with_ball"],"⛹️‍♂️":["man_bouncing_ball"],"⛹️‍♀️":["woman_bouncing_ball"],"🏋️":["lifter","person_lifting_weights","weight_lifter"],"🏋️‍♂️":["man_lifting_weights"],"🏋️‍♀️":["woman_lifting_weights"],"🚴":["bicyclist","person_biking"],"🚴‍♂️":["man_biking"],"🚴‍♀️":["woman_biking"],"🚵":["mountain_bicyclist","person_mountain_biking"],"🚵‍♂️":["man_mountain_biking"],"🚵‍♀️":["woman_mountain_biking"],"🤸":["cartwheel","person_doing_cartwheel"],"🤸‍♂️":["man_cartwheeling"],"🤸‍♀️":["woman_cartwheeling"],"🤼":["people_wrestling","wrestlers","wrestling"],"🤼‍♂️":["men_wrestling"],"🤼‍♀️":["women_wrestling"],"🤽":["person_playing_water_polo","water_polo"],"🤽‍♂️":["man_playing_water_polo"],"🤽‍♀️":["woman_playing_water_polo"],"🤾":["handball","person_playing_handball"],"🤾‍♂️":["man_playing_handball"],"🤾‍♀️":["woman_playing_handball"],"🤹":["juggler","juggling","person_juggling"],"🤹‍♂️":["man_juggling"],"🤹‍♀️":["woman_juggling"],"🧘":["person_in_lotus_position"],"🧘‍♂️":["man_in_lotus_position"],"🧘‍♀️":["woman_in_lotus_position"],"🛀":["bath"],"🛌":["person_in_bed","sleeping_accommodation"],"🧑‍🤝‍🧑":["people_holding_hands"],"👭":["two_women_holding_hands"],"👫":["couple"],"👬":["two_men_holding_hands"],"💏":["couplekiss"],"👩‍❤️‍💋‍👨":["kiss_woman_man"],"👨‍❤️‍💋‍👨":["couplekiss_mm","kiss_man_man","kiss_mm"],"👩‍❤️‍💋‍👩":["couplekiss_ww","kiss_ww"],"💑":["couple_with_heart"],"👩‍❤️‍👨":["couple_with_heart_woman_man"],"👨‍❤️‍👨":["couple_mm","couple_with_heart_mm"],"👩‍❤️‍👩":["couple_with_heart_ww","couple_ww"],"👨‍👩‍👦":["family_man_woman_boy"],"👨‍👩‍👧":["family_mwg"],"👨‍👩‍👧‍👦":["family_mwgb"],"👨‍👩‍👦‍👦":["family_mwbb"],"👨‍👩‍👧‍👧":["family_mwgg"],"👨‍👨‍👦":["family_mmb"],"👨‍👨‍👧":["family_mmg"],"👨‍👨‍👧‍👦":["family_mmgb"],"👨‍👨‍👦‍👦":["family_mmbb"],"👨‍👨‍👧‍👧":["family_mmgg"],"👩‍👩‍👦":["family_wwb"],"👩‍👩‍👧":["family_wwg"],"👩‍👩‍👧‍👦":["family_wwgb"],"👩‍👩‍👦‍👦":["family_wwbb"],"👩‍👩‍👧‍👧":["family_wwgg"],"👨‍👦":["family_man_boy"],"👨‍👦‍👦":["family_man_boy_boy"],"👨‍👧":["family_man_girl"],"👨‍👧‍👦":["family_man_girl_boy"],"👨‍👧‍👧":["family_man_girl_girl"],"👩‍👦":["family_woman_boy"],"👩‍👦‍👦":["family_woman_boy_boy"],"👩‍👧":["family_woman_girl"],"👩‍👧‍👦":["family_woman_girl_boy"],"👩‍👧‍👧":["family_woman_girl_girl"],"🗣️":["speaking_head","speaking_head_in_silhouette"],"👤":["bust_in_silhouette"],"👥":["busts_in_silhouette"],"🫂":["people_hugging"],"👪️":["family"],"👣":["footprints"],"🦰":["red_hair","red_haired"],"🦱":["curly_hair","curly_haired"],"🦳":["white_hair","white_haired"],"🦲":["bald"],"🐵":["monkey_face"],"🐒":["monkey"],"🦍":["gorilla"],"🦧":["orangutan"],"🐶":["dog","dog_face"],"🐕️":["dog2"],"🦮":["guide_dog"],"🐕‍🦺":["service_dog"],"🐩":["poodle"],"🐺":["wolf"],"🦊":["fox","fox_face"],"🦝":["raccoon"],"🐱":["cat","cat_face"],"🐈️":["cat2"],"🐈‍⬛":["black_cat"],"🦁":["lion","lion_face"],"🐯":["tiger","tiger_face"],"🐅":["tiger2"],"🐆":["leopard"],"🐴":["horse","horse_face"],"🫎":["moose"],"🫏":["donkey"],"🐎":["racehorse"],"🦄":["unicorn","unicorn_face"],"🦓":["zebra"],"🦌":["deer"],"🦬":["bison"],"🐮":["cow","cow_face"],"🐂":["ox"],"🐃":["water_buffalo"],"🐄":["cow2"],"🐷":["pig","pig_face"],"🐖":["pig2"],"🐗":["boar"],"🐽":["pig_nose"],"🐏":["ram"],"🐑":["ewe","sheep"],"🐐":["goat"],"🐪":["dromedary_camel"],"🐫":["camel"],"🦙":["llama"],"🦒":["giraffe"],"🐘":["elephant"],"🦣":["mammoth"],"🦏":["rhino","rhinoceros"],"🦛":["hippopotamus"],"🐭":["mouse","mouse_face"],"🐁":["mouse2"],"🐀":["rat"],"🐹":["hamster"],"🐰":["rabbit","rabbit_face"],"🐇":["rabbit2"],"🐿️":["chipmunk"],"🦫":["beaver"],"🦔":["hedgehog"],"🦇":["bat"],"🐻":["bear"],"🐻‍❄️":["polar_bear"],"🐨":["koala"],"🐼":["panda","panda_face"],"🦥":["sloth"],"🦦":["otter"],"🦨":["skunk"],"🦘":["kangaroo"],"🦡":["badger"],"🐾":["feet","paw_prints"],"🦃":["turkey"],"🐔":["chicken"],"🐓":["rooster"],"🐣":["hatching_chick"],"🐤":["baby_chick"],"🐥":["hatched_chick"],"🐦️":["bird"],"🐧":["penguin"],"🕊️":["dove","dove_of_peace"],"🦅":["eagle"],"🦆":["duck"],"🦢":["swan"],"🦉":["owl"],"🦤":["dodo"],"🪶":["feather"],"🦩":["flamingo"],"🦚":["peacock"],"🦜":["parrot"],"🪽":["wing"],"🐦‍⬛":["black_bird"],"🪿":["goose"],"🐸":["frog"],"🐊":["crocodile"],"🐢":["turtle"],"🦎":["lizard"],"🐍":["snake"],"🐲":["dragon_face"],"🐉":["dragon"],"🦕":["sauropod"],"🦖":["t_rex"],"🐳":["whale"],"🐋":["whale2"],"🐬":["dolphin"],"🦭":["seal"],"🐟️":["fish"],"🐠":["tropical_fish"],"🐡":["blowfish"],"🦈":["shark"],"🐙":["octopus"],"🐚":["shell","spiral_shell"],"🪸":["coral"],"🪼":["jellyfish"],"🐌":["snail"],"🦋":["butterfly"],"🐛":["bug"],"🐜":["ant"],"🐝":["bee","honeybee"],"🪲":["beetle"],"🐞":["lady_beetle"],"🦗":["cricket"],"🪳":["cockroach"],"🕷️":["spider"],"🕸️":["spider_web"],"🦂":["scorpion"],"🦟":["mosquito"],"🪰":["fly"],"🪱":["worm"],"🦠":["microbe"],"💐":["bouquet"],"🌸":["cherry_blossom"],"💮":["white_flower"],"🪷":["lotus"],"🏵️":["rosette"],"🌹":["rose"],"🥀":["wilted_flower","wilted_rose"],"🌺":["hibiscus"],"🌻":["sunflower"],"🌼":["blossom"],"🌷":["tulip"],"🪻":["hyacinth"],"🌱":["seedling"],"🪴":["potted_plant"],"🌲":["evergreen_tree"],"🌳":["deciduous_tree"],"🌴":["palm_tree"],"🌵":["cactus"],"🌾":["ear_of_rice","sheaf_of_rice"],"🌿":["herb"],"☘️":["shamrock"],"🍀":["four_leaf_clover"],"🍁":["maple_leaf"],"🍂":["fallen_leaf"],"🍃":["leaves"],"🪹":["empty_nest"],"🪺":["nest_with_eggs"],"🍄":["mushroom"],"🍇":["grapes"],"🍈":["melon"],"🍉":["watermelon"],"🍊":["tangerine"],"🍋":["lemon"],"🍌":["banana"],"🍍":["pineapple"],"🥭":["mango"],"🍎":["apple","red_apple"],"🍏":["green_apple"],"🍐":["pear"],"🍑":["peach"],"🍒":["cherries"],"🍓":["strawberry"],"🫐":["blueberries"],"🥝":["kiwi","kiwi_fruit","kiwifruit"],"🍅":["tomato"],"🫒":["olive"],"🥥":["coconut"],"🥑":["avocado"],"🍆":["eggplant"],"🥔":["potato"],"🥕":["carrot"],"🌽":["corn","ear_of_corn"],"🌶️":["hot_pepper"],"🫑":["bell_pepper"],"🥒":["cucumber"],"🥬":["leafy_green"],"🥦":["broccoli"],"🧄":["garlic"],"🧅":["onion"],"🥜":["peanuts","shelled_peanut"],"🫘":["beans"],"🌰":["chestnut"],"🫚":["ginger_root"],"🫛":["pea_pod"],"🍞":["bread"],"🥐":["croissant"],"🥖":["baguette_bread","french_bread"],"🫓":["flatbread"],"🥨":["pretzel"],"🥯":["bagel"],"🥞":["pancakes"],"🧇":["waffle"],"🧀":["cheese","cheese_wedge"],"🍖":["meat_on_bone"],"🍗":["poultry_leg"],"🥩":["cut_of_meat"],"🥓":["bacon"],"🍔":["hamburger"],"🍟":["french_fries","fries"],"🍕":["pizza"],"🌭":["hot_dog","hotdog"],"🥪":["sandwich"],"🌮":["taco"],"🌯":["burrito"],"🫔":["tamale"],"🥙":["stuffed_flatbread","stuffed_pita"],"🧆":["falafel"],"🥚":["egg"],"🍳":["cooking"],"🥘":["paella","shallow_pan_of_food"],"🍲":["pot_of_food","stew"],"🫕":["fondue"],"🥣":["bowl_with_spoon"],"🥗":["green_salad","salad"],"🍿":["popcorn"],"🧈":["butter"],"🧂":["salt"],"🥫":["canned_food"],"🍱":["bento","bento_box"],"🍘":["rice_cracker"],"🍙":["rice_ball"],"🍚":["cooked_rice","rice"],"🍛":["curry","curry_rice"],"🍜":["ramen","steaming_bowl"],"🍝":["spaghetti"],"🍠":["sweet_potato"],"🍢":["oden"],"🍣":["sushi"],"🍤":["fried_shrimp"],"🍥":["fish_cake"],"🥮":["moon_cake"],"🍡":["dango"],"🥟":["dumpling"],"🥠":["fortune_cookie"],"🥡":["takeout_box"],"🦀":["crab"],"🦞":["lobster"],"🦐":["shrimp"],"🦑":["squid"],"🦪":["oyster"],"🍦":["icecream"],"🍧":["shaved_ice"],"🍨":["ice_cream"],"🍩":["doughnut"],"🍪":["cookie"],"🎂":["birthday","birthday_cake"],"🍰":["cake","shortcake"],"🧁":["cupcake"],"🥧":["pie"],"🍫":["chocolate_bar"],"🍬":["candy"],"🍭":["lollipop"],"🍮":["custard","flan","pudding"],"🍯":["honey_pot"],"🍼":["baby_bottle"],"🥛":["glass_of_milk","milk"],"☕️":["coffee","hot_beverage"],"🫖":["teapot"],"🍵":["tea"],"🍶":["sake"],"🍾":["bottle_with_popping_cork","champagne"],"🍷":["wine_glass"],"🍸️":["cocktail"],"🍹":["tropical_drink"],"🍺":["beer","beer_mug"],"🍻":["beers"],"🥂":["champagne_glass","clinking_glass"],"🥃":["tumbler_glass","whisky"],"🫗":["pouring_liquid"],"🥤":["cup_with_straw"],"🧋":["bubble_tea"],"🧃":["beverage_box"],"🧉":["mate"],"🧊":["ice_cube"],"🥢":["chopsticks"],"🍽️":["fork_and_knife_with_plate","fork_knife_plate"],"🍴":["fork_and_knife"],"🥄":["spoon"],"🔪":["kitchen_knife","knife"],"🫙":["jar"],"🏺":["amphora"],"🌍️":["earth_africa"],"🌎️":["earth_americas"],"🌏️":["earth_asia"],"🌐":["globe_with_meridians"],"🗺️":["map","world_map"],"🗾":["japan","map_of_japan"],"🧭":["compass"],"🏔️":["mountain_snow","snow_capped_mountain"],"⛰️":["mountain"],"🌋":["volcano"],"🗻":["mount_fuji"],"🏕️":["camping"],"🏖️":["beach","beach_with_umbrella"],"🏜️":["desert"],"🏝️":["desert_island","island"],"🏞️":["national_park","park"],"🏟️":["stadium"],"🏛️":["classical_building"],"🏗️":["building_construction","construction_site"],"🧱":["brick","bricks"],"🪨":["rock"],"🪵":["wood"],"🛖":["hut"],"🏘️":["homes","house_buildings","houses"],"🏚️":["derelict_house_building","house_abandoned"],"🏠️":["house"],"🏡":["house_with_garden"],"🏢":["office"],"🏣":["post_office"],"🏤":["european_post_office"],"🏥":["hospital"],"🏦":["bank"],"🏨":["hotel"],"🏩":["love_hotel"],"🏪":["convenience_store"],"🏫":["school"],"🏬":["department_store"],"🏭️":["factory"],"🏯":["japanese_castle"],"🏰":["castle","european_castle"],"💒":["wedding"],"🗼":["tokyo_tower"],"🗽":["statue_of_liberty"],"⛪️":["church"],"🕌":["mosque"],"🛕":["hindu_temple"],"🕍":["synagogue"],"⛩️":["shinto_shrine"],"🕋":["kaaba"],"⛲️":["fountain"],"⛺️":["tent"],"🌁":["foggy"],"🌃":["night_with_stars"],"🏙️":["cityscape"],"🌄":["sunrise_over_mountains"],"🌅":["sunrise"],"🌆":["city_dusk"],"🌇":["city_sunrise","city_sunset","sunset"],"🌉":["bridge_at_night"],"♨️":["hot_springs","hotsprings"],"🎠":["carousel_horse"],"🛝":["playground_slide"],"🎡":["ferris_wheel"],"🎢":["roller_coaster"],"💈":["barber","barber_pole"],"🎪":["circus_tent"],"🚂":["locomotive","steam_locomotive"],"🚃":["railway_car"],"🚄":["bullettrain_side"],"🚅":["bullet_train","bullettrain_front"],"🚆":["train2"],"🚇️":["metro"],"🚈":["light_rail"],"🚉":["station"],"🚊":["tram"],"🚝":["monorail"],"🚞":["mountain_railway"],"🚋":["train","tram_car"],"🚌":["bus"],"🚍️":["oncoming_bus"],"🚎":["trolleybus"],"🚐":["minibus"],"🚑️":["ambulance"],"🚒":["fire_engine"],"🚓":["police_car"],"🚔️":["oncoming_police_car"],"🚕":["taxi"],"🚖":["oncoming_taxi"],"🚗":["automobile","red_car"],"🚘️":["oncoming_automobile"],"🚙":["blue_car"],"🛻":["pickup_truck"],"🚚":["truck"],"🚛":["articulated_lorry"],"🚜":["tractor"],"🏎️":["race_car","racing_car"],"🏍️":["motorcycle","racing_motorcycle"],"🛵":["motor_scooter","motorbike"],"🦽":["manual_wheelchair"],"🦼":["motorized_wheelchair"],"🛺":["auto_rickshaw"],"🚲️":["bicycle","bike"],"🛴":["kick_scooter","scooter"],"🛹":["skateboard"],"🛼":["roller_skate"],"🚏":["bus_stop","busstop"],"🛣️":["motorway"],"🛤️":["railroad_track","railway_track"],"🛢️":["oil","oil_drum"],"⛽️":["fuel_pump","fuelpump"],"🛞":["wheel"],"🚨":["rotating_light"],"🚥":["traffic_light"],"🚦":["vertical_traffic_light"],"🛑":["octagonal_sign","stop_sign"],"🚧":["construction"],"⚓️":["anchor"],"🛟":["ring_buoy"],"⛵️":["sailboat"],"🛶":["canoe","kayak"],"🚤":["speedboat"],"🛳️":["cruise_ship","passenger_ship"],"⛴️":["ferry"],"🛥️":["motor_boat","motorboat"],"🚢":["ship"],"✈️":["airplane"],"🛩️":["airplane_small","small_airplane"],"🛫":["airplane_departure"],"🛬":["airplane_arriving"],"🪂":["parachute"],"💺":["seat"],"🚁":["helicopter"],"🚟":["suspension_railway"],"🚠":["mountain_cableway"],"🚡":["aerial_tramway"],"🛰️":["satellite_orbital"],"🚀":["rocket"],"🛸":["flying_saucer"],"🛎️":["bellhop","bellhop_bell"],"🧳":["luggage"],"⌛️":["hourglass"],"⏳️":["hourglass_flowing_sand"],"⌚️":["watch"],"⏰️":["alarm_clock"],"⏱️":["stopwatch"],"⏲️":["timer","timer_clock"],"🕰️":["clock","mantlepiece_clock"],"🕛️":["clock12","twelve_oclock"],"🕧️":["clock1230","twelve_thirty"],"🕐️":["clock1","one_oclock"],"🕜️":["clock130","one_thirty"],"🕑️":["clock2","two_oclock"],"🕝️":["clock230","two_thirty"],"🕒️":["clock3","three_oclock"],"🕞️":["clock330","three_thirty"],"🕓️":["clock4","four_oclock"],"🕟️":["clock430","four_thirty"],"🕔️":["clock5","five_oclock"],"🕠️":["clock530","five_thirty"],"🕕️":["clock6","six_oclock"],"🕡️":["clock630","six_thirty"],"🕖️":["clock7","seven_oclock"],"🕢️":["clock730","seven_thirty"],"🕗️":["clock8","eight_oclock"],"🕣️":["clock830","eight_thirty"],"🕘️":["clock9","nine_oclock"],"🕤️":["clock930","nine_thirty"],"🕙️":["clock10","ten_oclock"],"🕥️":["clock1030","ten_thirty"],"🕚️":["clock11","eleven_oclock"],"🕦️":["clock1130","eleven_thirty"],"🌑":["new_moon"],"🌒":["waxing_crescent_moon"],"🌓":["first_quarter_moon"],"🌔":["waxing_gibbous_moon"],"🌕️":["full_moon"],"🌖":["waning_gibbous_moon"],"🌗":["last_quarter_moon"],"🌘":["waning_crescent_moon"],"🌙":["crescent_moon"],"🌚":["new_moon_face","new_moon_with_face"],"🌛":["first_quarter_moon_with_face"],"🌜️":["last_quarter_moon_with_face"],"🌡️":["thermometer"],"☀️":["sun","sunny"],"🌝":["full_moon_with_face"],"🌞":["sun_with_face"],"🪐":["ringed_planet"],"⭐️":["star"],"🌟":["glowing_star","star2"],"🌠":["shooting_star","stars"],"🌌":["milky_way"],"☁️":["cloud"],"⛅️":["partly_sunny"],"⛈️":["thunder_cloud_and_rain","thunder_cloud_rain"],"🌤️":["white_sun_small_cloud","white_sun_with_small_cloud"],"🌥️":["white_sun_behind_cloud","white_sun_cloud"],"🌦️":["white_sun_behind_cloud_with_rain","white_sun_rain_cloud"],"🌧️":["cloud_rain","cloud_with_rain"],"🌨️":["cloud_snow","cloud_with_snow"],"🌩️":["cloud_lightning","cloud_with_lightning"],"🌪️":["cloud_tornado","cloud_with_tornado","tornado"],"🌫️":["fog"],"🌬️":["wind_blowing_face","wind_face"],"🌀":["cyclone"],"🌈":["rainbow"],"🌂":["closed_umbrella"],"☂️":["umbrella2"],"☔️":["umbrella"],"⛱️":["beach_umbrella","umbrella_on_ground"],"⚡️":["high_voltage","zap"],"❄️":["snowflake"],"☃️":["snowman2"],"⛄️":["snowman"],"☄️":["comet"],"🔥":["fire","flame"],"💧":["droplet"],"🌊":["ocean","water_wave"],"🎃":["jack_o_lantern"],"🎄":["christmas_tree"],"🎆":["fireworks"],"🎇":["sparkler"],"🧨":["firecracker"],"✨️":["sparkles"],"🎈":["balloon"],"🎉":["party_popper","tada"],"🎊":["confetti_ball"],"🎋":["tanabata_tree"],"🎍":["bamboo"],"🎎":["dolls"],"🎏":["carp_streamer","flags"],"🎐":["wind_chime"],"🎑":["rice_scene"],"🧧":["red_envelope"],"🎀":["ribbon"],"🎁":["gift","wrapped_gift"],"🎗️":["reminder_ribbon"],"🎟️":["admission_tickets","tickets"],"🎫":["ticket"],"🎖️":["military_medal"],"🏆️":["trophy"],"🏅":["medal","sports_medal"],"🥇":["first_place","first_place_medal"],"🥈":["second_place","second_place_medal"],"🥉":["third_place","third_place_medal"],"⚽️":["soccer","soccer_ball"],"⚾️":["baseball"],"🥎":["softball"],"🏀":["basketball"],"🏐":["volleyball"],"🏈":["football"],"🏉":["rugby_football"],"🎾":["tennis"],"🥏":["flying_disc"],"🎳":["bowling"],"🏏":["cricket_bat_ball","cricket_game"],"🏑":["field_hockey"],"🏒":["hockey","ice_hockey"],"🥍":["lacrosse"],"🏓":["ping_pong","table_tennis"],"🏸":["badminton"],"🥊":["boxing_glove","boxing_gloves"],"🥋":["karate_uniform","martial_arts_uniform"],"🥅":["goal","goal_net"],"⛳️":["flag_in_hole","golf"],"⛸️":["ice_skate"],"🎣":["fishing_pole","fishing_pole_and_fish"],"🤿":["diving_mask"],"🎽":["running_shirt","running_shirt_with_sash"],"🎿":["ski","skis"],"🛷":["sled"],"🎯":["dart","direct_hit"],"🪀":["yo_yo"],"🪁":["kite"],"🔫":["gun","pistol"],"🎱":["8ball"],"🔮":["crystal_ball"],"🪄":["magic_wand"],"🎮️":["video_game"],"🕹️":["joystick"],"🎰":["slot_machine"],"🎲":["game_die"],"🧩":["jigsaw","puzzle_piece"],"🧸":["teddy_bear"],"🪅":["pinata"],"🪩":["mirror_ball"],"🪆":["nesting_dolls"],"♠️":["spade_suit","spades"],"♥️":["heart_suit","hearts"],"♦️":["diamond_suit","diamonds"],"♣️":["club_suit","clubs"],"♟️":["chess_pawn"],"🃏":["black_joker","joker"],"🀄️":["mahjong"],"🎴":["flower_playing_cards"],"🎭️":["performing_arts"],"🖼️":["frame_photo","frame_with_picture"],"🎨":["art"],"🧵":["thread"],"🪡":["sewing_needle"],"🧶":["yarn"],"🪢":["knot"],"👓️":["eyeglasses","glasses"],"🕶️":["dark_sunglasses"],"🥽":["goggles"],"🥼":["lab_coat"],"🦺":["safety_vest"],"👔":["necktie"],"👕":["shirt","t_shirt"],"👖":["jeans"],"🧣":["scarf"],"🧤":["gloves"],"🧥":["coat"],"🧦":["socks"],"👗":["dress"],"👘":["kimono"],"🥻":["sari"],"🩱":["one_piece_swimsuit"],"🩲":["briefs"],"🩳":["shorts"],"👙":["bikini"],"👚":["womans_clothes"],"🪭":["folding_hand_fan"],"👛":["purse"],"👜":["handbag"],"👝":["clutch_bag","pouch"],"🛍️":["shopping_bags"],"🎒":["backpack","school_satchel"],"🩴":["thong_sandal"],"👞":["mans_shoe"],"👟":["athletic_shoe","running_shoe"],"🥾":["hiking_boot"],"🥿":["flat_shoe","womans_flat_shoe"],"👠":["high_heel"],"👡":["sandal","womans_sandal"],"🩰":["ballet_shoes"],"👢":["boot","womans_boot"],"🪮":["hair_pick"],"👑":["crown"],"👒":["womans_hat"],"🎩":["top_hat","tophat"],"🎓️":["mortar_board"],"🧢":["billed_cap"],"🪖":["military_helmet"],"⛑️":["helmet_with_cross","helmet_with_white_cross"],"📿":["prayer_beads"],"💄":["lipstick"],"💍":["ring"],"🔇":["mute","muted_speaker"],"🔈️":["speaker"],"🔉":["sound"],"🔊":["loud_sound"],"📢":["loudspeaker"],"📣":["mega","megaphone"],"📯":["postal_horn"],"🔔":["bell"],"🔕":["no_bell"],"🎼":["musical_score"],"🎵":["musical_note"],"🎶":["musical_notes","notes"],"🎙️":["microphone2","studio_microphone"],"🎚️":["level_slider"],"🎛️":["control_knobs"],"🎤":["microphone"],"🎧️":["headphone","headphones"],"📻️":["radio"],"🎷":["saxophone"],"🪗":["accordion"],"🎸":["guitar"],"🎹":["musical_keyboard"],"🎺":["trumpet"],"🎻":["violin"],"🪕":["banjo"],"🥁":["drum","drum_with_drumsticks"],"🪘":["long_drum"],"🪇":["maracas"],"🪈":["flute"],"📱":["mobile_phone"],"📲":["calling"],"☎️":["telephone"],"📞":["telephone_receiver"],"📟️":["pager"],"📠":["fax","fax_machine"],"🔋":["battery"],"🪫":["low_battery"],"🔌":["electric_plug"],"💻️":["computer"],"🖥️":["desktop","desktop_computer"],"🖨️":["printer"],"⌨️":["keyboard"],"🖱️":["mouse_three_button","three_button_mouse"],"🖲️":["trackball"],"💽":["computer_disk","minidisc"],"💾":["floppy_disk"],"💿️":["cd","optical_disk"],"📀":["dvd"],"🧮":["abacus"],"🎥":["movie_camera"],"🎞️":["film_frames"],"📽️":["film_projector","projector"],"🎬️":["clapper","clapper_board"],"📺️":["television","tv"],"📷️":["camera"],"📸":["camera_with_flash"],"📹️":["video_camera"],"📼":["vhs","videocassette"],"🔍️":["mag"],"🔎":["mag_right"],"🕯️":["candle"],"💡":["bulb","light_bulb"],"🔦":["flashlight"],"🏮":["izakaya_lantern"],"🪔":["diya_lamp"],"📔":["notebook_with_decorative_cover"],"📕":["closed_book"],"📖":["book","open_book"],"📗":["green_book"],"📘":["blue_book"],"📙":["orange_book"],"📚️":["books"],"📓":["notebook"],"📒":["ledger"],"📃":["page_with_curl"],"📜":["scroll"],"📄":["page_facing_up"],"📰":["newspaper"],"🗞️":["newspaper2","rolled_up_newspaper"],"📑":["bookmark_tabs"],"🔖":["bookmark"],"🏷️":["label"],"💰️":["money_bag","moneybag"],"🪙":["coin"],"💴":["yen","yen_banknote"],"💵":["dollar"],"💶":["euro","euro_banknote"],"💷":["pound"],"💸":["money_with_wings"],"💳️":["credit_card"],"🧾":["receipt"],"💹":["chart"],"✉️":["envelope"],"📧":["e-mail","e_mail","email"],"📨":["incoming_envelope"],"📩":["envelope_with_arrow"],"📤️":["outbox_tray"],"📥️":["inbox_tray"],"📦️":["package"],"📫️":["mailbox"],"📪️":["mailbox_closed"],"📬️":["mailbox_with_mail"],"📭️":["mailbox_with_no_mail"],"📮":["postbox"],"🗳️":["ballot_box","ballot_box_with_ballot"],"✏️":["pencil2"],"✒️":["black_nib"],"🖋️":["fountain_pen","lower_left_fountain_pen","pen_fountain"],"🖊️":["lower_left_ballpoint_pen","pen","pen_ballpoint"],"🖌️":["lower_left_paintbrush","paintbrush"],"🖍️":["crayon","lower_left_crayon"],"📝":["memo","pencil"],"💼":["briefcase"],"📁":["file_folder"],"📂":["open_file_folder"],"🗂️":["card_index_dividers","dividers"],"📅":["date"],"📆":["calendar"],"🗒️":["notepad_spiral","spiral_note_pad"],"🗓️":["calendar_spiral","spiral_calendar_pad"],"📇":["card_index"],"📈":["chart_with_upwards_trend"],"📉":["chart_with_downwards_trend"],"📊":["bar_chart"],"📋️":["clipboard"],"📌":["pushpin"],"📍":["round_pushpin"],"📎":["paperclip"],"🖇️":["linked_paperclips","paperclips"],"📏":["straight_ruler"],"📐":["triangular_ruler"],"✂️":["scissors"],"🗃️":["card_box","card_file_box"],"🗄️":["file_cabinet"],"🗑️":["wastebasket"],"🔒️":["lock","locked"],"🔓️":["unlock","unlocked"],"🔏":["lock_with_ink_pen"],"🔐":["closed_lock_with_key"],"🔑":["key"],"🗝️":["key2","old_key"],"🔨":["hammer"],"🪓":["axe"],"⛏️":["pick"],"⚒️":["hammer_and_pick","hammer_pick"],"🛠️":["hammer_and_wrench","tools"],"🗡️":["dagger","dagger_knife"],"⚔️":["crossed_swords"],"💣️":["bomb"],"🪃":["boomerang"],"🏹":["archery","bow_and_arrow"],"🛡️":["shield"],"🪚":["carpentry_saw"],"🔧":["wrench"],"🪛":["screwdriver"],"🔩":["nut_and_bolt"],"⚙️":["gear"],"🗜️":["clamp","compression"],"⚖️":["balance_scale","scales"],"🦯":["probing_cane"],"🔗":["link"],"⛓️":["chains"],"🪝":["hook"],"🧰":["toolbox"],"🧲":["magnet"],"🪜":["ladder"],"⚗️":["alembic"],"🧪":["test_tube"],"🧫":["petri_dish"],"🧬":["dna"],"🔬":["microscope"],"🔭":["telescope"],"📡":["satellite"],"💉":["syringe"],"🩸":["drop_of_blood"],"💊":["pill"],"🩹":["adhesive_bandage"],"🩼":["crutch"],"🩺":["stethoscope"],"🩻":["x_ray"],"🚪":["door"],"🛗":["elevator"],"🪞":["mirror"],"🪟":["window"],"🛏️":["bed"],"🛋️":["couch","couch_and_lamp"],"🪑":["chair"],"🚽":["toilet"],"🪠":["plunger"],"🚿":["shower"],"🛁":["bathtub"],"🪤":["mouse_trap"],"🪒":["razor"],"🧴":["lotion_bottle","squeeze_bottle"],"🧷":["safety_pin"],"🧹":["broom"],"🧺":["basket"],"🧻":["roll_of_paper"],"🪣":["bucket"],"🧼":["soap"],"🫧":["bubbles"],"🪥":["toothbrush"],"🧽":["sponge"],"🧯":["fire_extinguisher"],"🛒":["shopping_cart","shopping_trolley"],"🚬":["cigarette","smoking"],"⚰️":["coffin"],"⚱️":["funeral_urn","urn"],"🧿":["nazar_amulet"],"🪬":["hamsa"],"🗿":["moai","moyai"],"🪧":["placard"],"🪪":["identification_card"],"🏧":["atm"],"🚮":["put_litter_in_its_place"],"🚰":["potable_water"],"♿️":["wheelchair"],"🚹️":["mens","mens_room"],"🚺️":["womens","womens_room"],"🚻":["restroom"],"🚼️":["baby_symbol"],"🚾":["water_closet","wc"],"🛂":["passport_control"],"🛃":["customs"],"🛄":["baggage_claim"],"🛅":["left_luggage"],"⚠️":["warning"],"🚸":["children_crossing"],"⛔️":["no_entry"],"🚫":["no_entry_sign","prohibited"],"🚳":["no_bicycles"],"🚭️":["no_smoking"],"🚯":["do_not_litter","no_littering"],"🚱":["non-potable_water"],"🚷":["no_pedestrians"],"📵":["no_mobile_phones"],"🔞":["underage"],"☢️":["radioactive","radioactive_sign"],"☣️":["biohazard","biohazard_sign"],"⬆️":["arrow_up","up_arrow"],"↗️":["arrow_upper_right"],"➡️":["arrow_right","right_arrow"],"↘️":["arrow_lower_right"],"⬇️":["arrow_down","down_arrow"],"↙️":["arrow_lower_left"],"⬅️":["arrow_left","left_arrow"],"↖️":["arrow_upper_left","up_left_arrow"],"↕️":["arrow_up_down","up_down_arrow"],"↔️":["left_right_arrow"],"↩️":["leftwards_arrow_with_hook"],"↪️":["arrow_right_hook"],"⤴️":["arrow_heading_up"],"⤵️":["arrow_heading_down"],"🔃":["arrows_clockwise"],"🔄":["arrows_counterclockwise"],"🔙":["back","back_arrow"],"🔚":["end","end_arrow"],"🔛":["on","on_arrow"],"🔜":["soon","soon_arrow"],"🔝":["top","top_arrow"],"🛐":["place_of_worship","worship_symbol"],"⚛️":["atom","atom_symbol"],"🕉️":["om_symbol"],"✡️":["star_of_david"],"☸️":["wheel_of_dharma"],"☯️":["yin_yang"],"✝️":["cross","latin_cross"],"☦️":["orthodox_cross"],"☪️":["star_and_crescent"],"☮️":["peace","peace_symbol"],"🕎":["menorah"],"🔯":["six_pointed_star"],"🪯":["khanda"],"♈️":["aries"],"♉️":["taurus"],"♊️":["gemini"],"♋️":["cancer"],"♌️":["leo"],"♍️":["virgo"],"♎️":["libra"],"♏️":["scorpio","scorpius"],"♐️":["sagittarius"],"♑️":["capricorn"],"♒️":["aquarius"],"♓️":["pisces"],"⛎️":["ophiuchus"],"🔀":["twisted_rightwards_arrows"],"🔁":["repeat"],"🔂":["repeat_one"],"▶️":["arrow_forward"],"⏩️":["fast_forward"],"⏭️":["next_track","track_next"],"⏯️":["play_pause"],"◀️":["arrow_backward"],"⏪️":["rewind"],"⏮️":["previous_track","track_previous"],"🔼":["arrow_up_small"],"⏫️":["arrow_double_up"],"🔽":["arrow_down_small"],"⏬️":["arrow_double_down"],"⏸️":["double_vertical_bar","pause_button"],"⏹️":["stop_button"],"⏺️":["record_button"],"⏏️":["eject","eject_symbol"],"🎦":["cinema"],"🔅":["low_brightness"],"🔆":["high_brightness"],"📶":["antenna_bars","signal_strength"],"🛜":["wireless"],"📳":["vibration_mode"],"📴":["mobile_phone_off"],"♀️":["female_sign"],"♂️":["male_sign"],"⚧️":["transgender_symbol"],"✖️":["heavy_multiplication_x"],"➕️":["heavy_plus_sign"],"➖️":["heavy_minus_sign"],"➗️":["heavy_division_sign"],"🟰":["heavy_equals_sign"],"♾️":["infinity"],"‼️":["bangbang"],"⁉️":["interrobang"],"❓️":["question","question_mark"],"❔️":["grey_question"],"❕️":["grey_exclamation"],"❗️":["exclamation"],"〰️":["wavy_dash"],"💱":["currency_exchange"],"💲":["heavy_dollar_sign"],"⚕️":["medical_symbol"],"♻️":["recycle"],"⚜️":["fleur-de-lis","fleur_de_lis"],"🔱":["trident"],"📛":["name_badge"],"🔰":["beginner"],"⭕️":["o"],"✅️":["white_check_mark"],"☑️":["ballot_box_with_check"],"✔️":["check_mark","heavy_check_mark"],"❌️":["cross_mark","x"],"❎️":["negative_squared_cross_mark"],"➰️":["curly_loop"],"➿️":["loop"],"〽️":["part_alternation_mark"],"✳️":["eight_spoked_asterisk"],"✴️":["eight_pointed_black_star"],"❇️":["sparkle"],"©️":["copyright"],"®️":["registered"],"™️":["tm","trade_mark"],"#️⃣":["hash"],"*️⃣":["asterisk","keycap_asterisk"],"0️⃣":["zero"],"1️⃣":["one"],"2️⃣":["two"],"3️⃣":["three"],"4️⃣":["four"],"5️⃣":["five"],"6️⃣":["six"],"7️⃣":["seven"],"8️⃣":["eight"],"9️⃣":["nine"],"🔟":["keycap_ten"],"🔠":["capital_abcd"],"🔡":["abcd"],"🔢":["1234","input_numbers"],"🔣":["input_symbols","symbols"],"🔤":["abc"],"🅰️":["a"],"🆎":["ab"],"🅱️":["b"],"🆑":["cl"],"🆒":["cool"],"🆓":["free"],"ℹ️":["information","information_source"],"🆔":["id"],"Ⓜ️":["circled_m","m"],"🆕":["new"],"🆖":["ng"],"🅾️":["o2"],"🆗":["ok"],"🅿️":["parking"],"🆘":["sos"],"🆙":["up"],"🆚":["vs"],"🈁":["koko"],"🈂️":["sa"],"🈷️":["u6708"],"🈶":["u6709"],"🈯️":["u6307"],"🉐":["ideograph_advantage"],"🈹":["u5272"],"🈚️":["u7121"],"🈲":["u7981"],"🉑":["accept"],"🈸":["u7533"],"🈴":["u5408"],"🈳":["u7a7a"],"㊗️":["congratulations"],"㊙️":["secret"],"🈺":["u55b6"],"🈵":["u6e80"],"🔴":["red_circle"],"🟠":["orange_circle"],"🟡":["yellow_circle"],"🟢":["green_circle"],"🔵":["blue_circle"],"🟣":["purple_circle"],"🟤":["brown_circle"],"⚫️":["black_circle"],"⚪️":["white_circle"],"🟥":["red_square"],"🟧":["orange_square"],"🟨":["yellow_square"],"🟩":["green_square"],"🟦":["blue_square"],"🟪":["purple_square"],"🟫":["brown_square"],"⬛️":["black_large_square"],"⬜️":["white_large_square"],"◼️":["black_medium_square"],"◻️":["white_medium_square"],"◾️":["black_medium_small_square"],"◽️":["white_medium_small_square"],"▪️":["black_small_square"],"▫️":["white_small_square"],"🔶":["large_orange_diamond"],"🔷":["large_blue_diamond"],"🔸":["small_orange_diamond"],"🔹":["small_blue_diamond"],"🔺":["small_red_triangle"],"🔻":["small_red_triangle_down"],"💠":["diamond_shape_with_a_dot_inside"],"🔘":["radio_button"],"🔳":["white_square_button"],"🔲":["black_square_button"],"🏁":["checkered_flag"],"🚩":["triangular_flag_on_post"],"🎌":["crossed_flags"],"🏴":["black_flag","flag_black","waving_black_flag"],"🏳️":["flag_white","waving_white_flag","white_flag"],"🏳️‍🌈":["gay_pride_flag","rainbow_flag"],"🏳️‍⚧️":["transgender_flag"],"🏴‍☠️":["pirate_flag"],"🇦🇨":["ac","flag_ac"],"🇦🇩":["ad","flag_ad"],"🇦🇪":["ae","flag_ae"],"🇦🇫":["af","flag_af"],"🇦🇬":["ag","flag_ag"],"🇦🇮":["ai","flag_ai"],"🇦🇱":["al","flag_al"],"🇦🇲":["am","flag_am"],"🇦🇴":["ao","flag_ao"],"🇦🇶":["aq","flag_aq"],"🇦🇷":["ar","flag_ar"],"🇦🇸":["as","flag_as"],"🇦🇹":["at","flag_at"],"🇦🇺":["au","flag_au"],"🇦🇼":["aw","flag_aw"],"🇦🇽":["ax","flag_ax"],"🇦🇿":["az","flag_az"],"🇧🇦":["ba","flag_ba"],"🇧🇧":["bb","flag_bb"],"🇧🇩":["bd","flag_bd"],"🇧🇪":["be","flag_be"],"🇧🇫":["bf","flag_bf"],"🇧🇬":["bg","flag_bg"],"🇧🇭":["bh","flag_bh"],"🇧🇮":["bi","flag_bi"],"🇧🇯":["bj","flag_bj"],"🇧🇱":["bl","flag_bl"],"🇧🇲":["bm","flag_bm"],"🇧🇳":["bn","flag_bn"],"🇧🇴":["bo","flag_bo"],"🇧🇶":["bq","flag_bq"],"🇧🇷":["br","flag_br"],"🇧🇸":["bs","flag_bs"],"🇧🇹":["bt","flag_bt"],"🇧🇻":["bv","flag_bv"],"🇧🇼":["bw","flag_bw"],"🇧🇾":["by","flag_by"],"🇧🇿":["bz","flag_bz"],"🇨🇦":["ca","flag_ca"],"🇨🇨":["cc","flag_cc"],"🇨🇩":["congo","flag_cd"],"🇨🇫":["cf","flag_cf"],"🇨🇬":["cg","flag_cg"],"🇨🇭":["ch","flag_ch"],"🇨🇮":["ci","flag_ci"],"🇨🇰":["ck","flag_ck"],"🇨🇱":["chile","flag_cl"],"🇨🇲":["cm","flag_cm"],"🇨🇳":["cn","flag_cn"],"🇨🇴":["co","flag_co"],"🇨🇵":["cp","flag_cp"],"🇨🇷":["cr","flag_cr"],"🇨🇺":["cu","flag_cu"],"🇨🇻":["cv","flag_cv"],"🇨🇼":["cw","flag_cw"],"🇨🇽":["cx","flag_cx"],"🇨🇾":["cy","flag_cy"],"🇨🇿":["cz","flag_cz"],"🇩🇪":["de","flag_de"],"🇩🇬":["dg","flag_dg"],"🇩🇯":["dj","flag_dj"],"🇩🇰":["dk","flag_dk"],"🇩🇲":["dm","flag_dm"],"🇩🇴":["do","flag_do"],"🇩🇿":["dz","flag_dz"],"🇪🇦":["ea","flag_ea"],"🇪🇨":["ec","flag_ec"],"🇪🇪":["ee","flag_ee"],"🇪🇬":["eg","flag_eg"],"🇪🇭":["eh","flag_eh"],"🇪🇷":["er","flag_er"],"🇪🇸":["es","flag_es"],"🇪🇹":["et","flag_et"],"🇪🇺":["eu","flag_eu"],"🇫🇮":["fi","flag_fi"],"🇫🇯":["fj","flag_fj"],"🇫🇰":["fk","flag_fk"],"🇫🇲":["flag_fm","fm"],"🇫🇴":["flag_fo","fo"],"🇫🇷":["flag_fr","fr"],"🇬🇦":["flag_ga","ga"],"🇬🇧":["flag_gb","gb"],"🇬🇩":["flag_gd","gd"],"🇬🇪":["flag_ge","ge"],"🇬🇫":["flag_gf","gf"],"🇬🇬":["flag_gg","gg"],"🇬🇭":["flag_gh","gh"],"🇬🇮":["flag_gi","gi"],"🇬🇱":["flag_gl","gl"],"🇬🇲":["flag_gm","gm"],"🇬🇳":["flag_gn","gn"],"🇬🇵":["flag_gp","gp"],"🇬🇶":["flag_gq","gq"],"🇬🇷":["flag_gr","gr"],"🇬🇸":["flag_gs","gs"],"🇬🇹":["flag_gt","gt"],"🇬🇺":["flag_gu","gu"],"🇬🇼":["flag_gw","gw"],"🇬🇾":["flag_gy","gy"],"🇭🇰":["flag_hk","hk"],"🇭🇲":["flag_hm","hm"],"🇭🇳":["flag_hn","hn"],"🇭🇷":["flag_hr","hr"],"🇭🇹":["flag_ht","ht"],"🇭🇺":["flag_hu","hu"],"🇮🇨":["flag_ic","ic"],"🇮🇩":["flag_id","indonesia"],"🇮🇪":["flag_ie","ie"],"🇮🇱":["flag_il","il"],"🇮🇲":["flag_im","im"],"🇮🇳":["flag_in","in"],"🇮🇴":["flag_io","io"],"🇮🇶":["flag_iq","iq"],"🇮🇷":["flag_ir","ir"],"🇮🇸":["flag_is","is"],"🇮🇹":["flag_it","it"],"🇯🇪":["flag_je","je"],"🇯🇲":["flag_jm","jm"],"🇯🇴":["flag_jo","jo"],"🇯🇵":["flag_jp","jp"],"🇰🇪":["flag_ke","ke"],"🇰🇬":["flag_kg","kg"],"🇰🇭":["flag_kh","kh"],"🇰🇮":["flag_ki","ki"],"🇰🇲":["flag_km","km"],"🇰🇳":["flag_kn","kn"],"🇰🇵":["flag_kp","kp"],"🇰🇷":["flag_kr","kr"],"🇰🇼":["flag_kw","kw"],"🇰🇾":["flag_ky","ky"],"🇰🇿":["flag_kz","kz"],"🇱🇦":["flag_la","la"],"🇱🇧":["flag_lb","lb"],"🇱🇨":["flag_lc","lc"],"🇱🇮":["flag_li","li"],"🇱🇰":["flag_lk","lk"],"🇱🇷":["flag_lr","lr"],"🇱🇸":["flag_ls","ls"],"🇱🇹":["flag_lt","lt"],"🇱🇺":["flag_lu","lu"],"🇱🇻":["flag_lv","lv"],"🇱🇾":["flag_ly","ly"],"🇲🇦":["flag_ma","ma"],"🇲🇨":["flag_mc","mc"],"🇲🇩":["flag_md","md"],"🇲🇪":["flag_me","me"],"🇲🇫":["flag_mf","mf"],"🇲🇬":["flag_mg","mg"],"🇲🇭":["flag_mh","mh"],"🇲🇰":["flag_mk","mk"],"🇲🇱":["flag_ml","ml"],"🇲🇲":["flag_mm","mm"],"🇲🇳":["flag_mn","mn"],"🇲🇴":["flag_mo","mo"],"🇲🇵":["flag_mp","mp"],"🇲🇶":["flag_mq","mq"],"🇲🇷":["flag_mr","mr"],"🇲🇸":["flag_ms","ms"],"🇲🇹":["flag_mt","mt"],"🇲🇺":["flag_mu","mu"],"🇲🇻":["flag_mv","mv"],"🇲🇼":["flag_mw","mw"],"🇲🇽":["flag_mx","mx"],"🇲🇾":["flag_my","my"],"🇲🇿":["flag_mz","mz"],"🇳🇦":["flag_na","na"],"🇳🇨":["flag_nc","nc"],"🇳🇪":["flag_ne","ne"],"🇳🇫":["flag_nf","nf"],"🇳🇬":["flag_ng","nigeria"],"🇳🇮":["flag_ni","ni"],"🇳🇱":["flag_nl","nl"],"🇳🇴":["flag_no","no"],"🇳🇵":["flag_np","np"],"🇳🇷":["flag_nr","nr"],"🇳🇺":["flag_nu","nu"],"🇳🇿":["flag_nz","nz"],"🇴🇲":["flag_om","om"],"🇵🇦":["flag_pa","pa"],"🇵🇪":["flag_pe","pe"],"🇵🇫":["flag_pf","pf"],"🇵🇬":["flag_pg","pg"],"🇵🇭":["flag_ph","ph"],"🇵🇰":["flag_pk","pk"],"🇵🇱":["flag_pl","pl"],"🇵🇲":["flag_pm","pm"],"🇵🇳":["flag_pn","pn"],"🇵🇷":["flag_pr","pr"],"🇵🇸":["flag_ps","ps"],"🇵🇹":["flag_pt","pt"],"🇵🇼":["flag_pw","pw"],"🇵🇾":["flag_py","py"],"🇶🇦":["flag_qa","qa"],"🇷🇪":["flag_re","re"],"🇷🇴":["flag_ro","ro"],"🇷🇸":["flag_rs","rs"],"🇷🇺":["flag_ru","ru"],"🇷🇼":["flag_rw","rw"],"🇸🇦":["flag_sa","saudi","saudiarabia"],"🇸🇧":["flag_sb","sb"],"🇸🇨":["flag_sc","sc"],"🇸🇩":["flag_sd","sd"],"🇸🇪":["flag_se","se"],"🇸🇬":["flag_sg","sg"],"🇸🇭":["flag_sh","sh"],"🇸🇮":["flag_si","si"],"🇸🇯":["flag_sj","sj"],"🇸🇰":["flag_sk","sk"],"🇸🇱":["flag_sl","sl"],"🇸🇲":["flag_sm","sm"],"🇸🇳":["flag_sn","sn"],"🇸🇴":["flag_so","so"],"🇸🇷":["flag_sr","sr"],"🇸🇸":["flag_ss","ss"],"🇸🇹":["flag_st","st"],"🇸🇻":["flag_sv","sv"],"🇸🇽":["flag_sx","sx"],"🇸🇾":["flag_sy","sy"],"🇸🇿":["flag_sz","sz"],"🇹🇦":["flag_ta","ta"],"🇹🇨":["flag_tc","tc"],"🇹🇩":["flag_td","td"],"🇹🇫":["flag_tf","tf"],"🇹🇬":["flag_tg","tg"],"🇹🇭":["flag_th","th"],"🇹🇯":["flag_tj","tj"],"🇹🇰":["flag_tk","tk"],"🇹🇱":["flag_tl","tl"],"🇹🇲":["flag_tm","turkmenistan"],"🇹🇳":["flag_tn","tn"],"🇹🇴":["flag_to","to"],"🇹🇷":["flag_tr","tr"],"🇹🇹":["flag_tt","tt"],"🇹🇻":["flag_tv","tuvalu"],"🇹🇼":["flag_tw","tw"],"🇹🇿":["flag_tz","tz"],"🇺🇦":["flag_ua","ua"],"🇺🇬":["flag_ug","ug"],"🇺🇲":["flag_um","um"],"🇺🇳":["united_nations"],"🇺🇸":["flag_us","us"],"🇺🇾":["flag_uy","uy"],"🇺🇿":["flag_uz","uz"],"🇻🇦":["flag_va","va"],"🇻🇨":["flag_vc","vc"],"🇻🇪":["flag_ve","ve"],"🇻🇬":["flag_vg","vg"],"🇻🇮":["flag_vi","vi"],"🇻🇳":["flag_vn","vn"],"🇻🇺":["flag_vu","vu"],"🇼🇫":["flag_wf","wf"],"🇼🇸":["flag_ws","ws"],"🇽🇰":["flag_xk","xk"],"🇾🇪":["flag_ye","ye"],"🇾🇹":["flag_yt","yt"],"🇿🇦":["flag_za","za"],"🇿🇲":["flag_zm","zm"],"🇿🇼":["flag_zw","zw"],"🏴󠁧󠁢󠁥󠁮󠁧󠁿":["england"],"🏴󠁧󠁢󠁳󠁣󠁴󠁿":["scotland"],"🏴󠁧󠁢󠁷󠁬󠁳󠁿":["wales"],"🇦":["regional_indicator_a"],"🇧":["regional_indicator_b"],"🇨":["regional_indicator_c"],"🇩":["regional_indicator_d"],"🇪":["regional_indicator_e"],"🇫":["regional_indicator_f"],"🇬":["regional_indicator_g"],"🇭":["regional_indicator_h"],"🇮":["regional_indicator_i"],"🇯":["regional_indicator_j"],"🇰":["regional_indicator_k"],"🇱":["regional_indicator_l"],"🇲":["regional_indicator_m"],"🇳":["regional_indicator_n"],"🇴":["regional_indicator_o"],"🇵":["regional_indicator_p"],"🇶":["regional_indicator_q"],"🇷":["regional_indicator_r"],"🇸":["regional_indicator_s"],"🇹":["regional_indicator_t"],"🇺":["regional_indicator_u"],"🇻":["regional_indicator_v"],"🇼":["regional_indicator_w"],"🇽":["regional_indicator_x"],"🇾":["regional_indicator_y"],"🇿":["regional_indicator_z"]}');
            var h, g = function (e, t, a, n) {
               return new(a || (a = Promise))((function (i, o) {
                  function s(e) {
                     try {
                        l(n.next(e))
                     } catch (e) {
                        o(e)
                     }
                  }

                  function r(e) {
                     try {
                        l(n.throw(e))
                     } catch (e) {
                        o(e)
                     }
                  }

                  function l(e) {
                     var t;
                     e.done ? i(e.value) : (t = e.value, t instanceof a ? t : new a((function (e) {
                        e(t)
                     }))).then(s, r)
                  }
                  l((n = n.apply(e, t || [])).next())
               }))
            };
            console.log(`🎉 PartyPlus Overlay (v${GM_info.script.version}): room module is running`), (() => {
               const e = $(".roomName"),
                  t = setInterval((() => {
                     e.text() && (clearInterval(t), document.title = `[${document.location.pathname.slice(1)}] ${e.text()}`)
                  }), 100);
               $(document).on("visibilitychange", (() => {
                  "visible" === document.visibilityState && (document.title = `[${document.location.pathname.slice(1)}] ${e.text()}`)
               }))
            })(), $(".tabs").append('\n   <a href="#" class="settings" title="Paramètres">⚙️</a>\n'), $(".sidebar").append('\n   <div class="settings pane" hidden></div>\n'), $(".sidebar > .pane.settings").html('\n   <div class="darkSettings darkScrollbar">\n      <fieldset>\n         <div class="setting notifications">\n            <div class="label">🔔 Notifications de bureau</div>\n            <div class="field"></div>\n         </div>\n      </fieldset>\n      <fieldset>\n         <div class="setting chat">\n            <div class="label">💬 Chat</div>\n            <div class="field"></div>\n         </div>\n      </fieldset>\n      <fieldset>\n         <div class="setting gameStats">\n            <div class="label">📊 Statistiques de partie</div>\n            <div class="field"></div>\n         </div>\n      </fieldset>\n      <fieldset>\n         <div class="setting keyboard">\n            <div class="label">⌨️ Clavier</div>\n            <div class="field"></div>\n         </div>\n      </fieldset>\n      <fieldset>\n         <div class="setting customization">\n            <div class="label">🎨 Customisation</div>\n            <div class="field"></div>\n         </div>\n      </fieldset>\n      <fieldset>\n         <div class="setting gameBackground">\n            <div class="label">🖼️ Arrière-plan du jeu</div>\n            <div class="field"></div>\n         </div>\n      </fieldset>\n      <fieldset>\n         <div class="setting streamerMode">\n            <div class="label">🎥 Mode streamer</div>\n            <div class="field"></div>\n         </div>\n      </fieldset>\n      <fieldset>\n         <div class="setting trainingMode">\n            <div class="label">🏋️ Mode entraînement</div>\n            <div class="field"></div>\n         </div>\n      </fieldset>\n      <fieldset>\n         <div class="setting other">\n            <div class="label">🔧 Autre</div>\n            <div class="field"></div>\n         </div>\n      </fieldset>\n   </div>\n'), $(".darkSettings > fieldset .label").css("background-color", "rgba(255, 255, 255, 0.1)"), $(".darkSettings > fieldset .label").each(((e, t) => {
               const a = $(t);
               a.css("cursor", "pointer"), a.next().hide(), a.on("click", (() => a.next().toggle()))
            })), $(".tabs > a").on("click", (e => {
               const t = $(e.target),
                  a = t.attr("class").split(" ")[0];
               if ("settings" !== a) return;
               const n = $(".tabs > a.active").attr("class").split(" ")[0],
                  i = $(".tabs > a.active");
               $(`.sidebar > .${n}.pane`).prop("hidden", !0), i.removeClass("active"), $(`.sidebar > .pane.${a}`).prop("hidden", !1), t.addClass("active")
            }));
            const {
               settings: m
            } = o.A;
            $(".pane.settings .notifications > .field").html(`\n   <p>\n      Recevez des notifications de bureau pour certains événements.\n   </p>\n   <div class="formGroup" title="Être notifié lorsque la partie en cours se termine.">\n      <label>\n         Fin de partie\n      </label>\n      <select id="notifyOnGameOver" data-type="number">\n         <option value="${i.mh.Always}" ${m.notifyOnGameOver===i.mh.Always&&"selected"}>\n            Toujours\n         </option>\n         <option value="${i.mh.OnlyWhenNotFocused}" ${m.notifyOnGameOver===i.mh.OnlyWhenNotFocused&&"selected"}>\n            Fenêtre inactive\n         </option>\n         <option value="${i.mh.Never}" ${m.notifyOnGameOver===i.mh.Never&&"selected"}>\n            Jamais\n         </option>\n      </select>\n   </div>\n   <div class="formGroup" title="Être notifié lorsque quelqu'un vous mentionne dans le chat.">\n      <label>\n         Mention dans le chat\n      </label>\n      <select id="notifyOnChatMention" data-type="number">\n         <option value="${i.mh.Always}" ${m.notifyOnChatMention===i.mh.Always&&"selected"}>\n            Toujours\n         </option>\n         <option value="${i.mh.OnlyWhenNotFocused}" ${m.notifyOnChatMention===i.mh.OnlyWhenNotFocused&&"selected"}>\n            Fenêtre inactive\n         </option>\n         <option value="${i.mh.Never}" ${m.notifyOnChatMention===i.mh.Never&&"selected"}>\n            Jamais\n         </option>\n      </select>\n   </div>\n`), $(".pane.settings .chat > .field").html(`\n   <p>\n      Personnalisez votre expérience de chat.\n   </p>\n   <div class="formGroup" title="Rendre les liens envoyés dans le chat cliquables.">\n      <label>\n         Liens cliquables\n      </label>\n      <select id="linkifyChat" data-type="number">\n         <option value="${i.$h.Full}" ${m.linkifyChat===i.$h.Full&&"selected"}>\n            Complets\n         </option>\n         <option value="${i.$h.Shortened}" ${m.linkifyChat===i.$h.Shortened&&"selected"}>\n            Abrégés\n         </option>\n         <option value="${i.$h.Disabled}" ${m.linkifyChat===i.$h.Disabled&&"selected"}>\n            Désactivés\n         </option>\n      </select>\n   </div>\n   <div class="formGroup" title="Modifier les mots qui déclencheront l'effet de mention.">\n      <label>Déclencheurs de mention (séparés par une virgule)</label>\n      <div class="inputGroup">\n         <input type="text" value="${m.mentionTriggers.length?m.mentionTriggers.join(", "):o.A.jklmSettings.nickname}" id="mentionTriggers" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n      <small>Insensible à la casse.</small>\n   </div>\n   <div class="formGroup" title="Modifier le format de l'horodatage des messages.">\n      <label>Format de l'horodatage</label>\n      <select id="timestampFormat" data-type="number">\n         <option value="${i.sd.Default}" ${m.timestampFormat===i.sd.Default&&"selected"}>\n            Par défaut (hh:mm)\n         </option>\n         <option value="${i.sd.Full}" ${m.timestampFormat===i.sd.Full&&"selected"}>\n            Complet (hh:mm:ss)\n         </option>\n      </select>\n      <small>\n         Les anciens messages ne seront pas affectés par le changement.\n      </small>\n   </div>\n   <div class="formGroup" title="Modifier la police d'écriture utilisée dans le chat.">\n      <label>Police d'écriture</label>\n      <select id="chatFontFamily">\n         <option value="Varela Round" ${"Varela Round"===m.chatFontFamily&&"selected"}>\n            Varela Round (par défaut)\n         </option>\n         <option value="Montserrat" ${"Montserrat"===m.chatFontFamily&&"selected"}>\n            Montserrat\n         </option>\n         <option value="Roboto" ${"Roboto"===m.chatFontFamily&&"selected"}>\n            Roboto\n         </option>\n         <option value="Open Sans" ${"Open Sans"===m.chatFontFamily&&"selected"}>\n            Open Sans\n         </option>\n         <option value="Lato" ${"Lato"===m.chatFontFamily&&"selected"}>\n            Lato\n         </option>\n         <option value="PT Sans" ${"PT Sans"===m.chatFontFamily&&"selected"}>\n            PT Sans\n         </option>\n         <option value="Nunito" ${"Nunito"===m.chatFontFamily&&"selected"}>\n            Nunito\n         </option>\n      </select>\n   </div>\n   <div class="formGroup" title="Modifier la graisse de la police d'écriture utilisée dans le chat.">\n      <label>Graisse de la police</label>\n      <select id="chatFontWeight" data-type="number">\n         <option value="${i.IT.Light}" ${m.chatFontWeight===i.IT.Light&&"selected"}>\n            Légère\n         </option>\n         <option value="${i.IT.Normal}" ${m.chatFontWeight===i.IT.Normal&&"selected"}>\n            Normale\n         </option>\n         <option value="${i.IT.Medium}" ${m.chatFontWeight===i.IT.Medium&&"selected"}>\n            Moyenne\n         </option>\n         <option value="${i.IT.SemiBold}" ${m.chatFontWeight===i.IT.SemiBold&&"selected"}>\n            Semi grasse\n         </option>\n         <option value="${i.IT.Bold}" ${m.chatFontWeight===i.IT.Bold&&"selected"}>\n            Grasse\n         </option>\n      </select>\n   </div>\n   <div class="formGroup" title="Activer les raccourcis d'émoji (ex: :fire: = 🔥)">\n      <label>\n         Raccourcis d'émoji (ex: :fire: = 🔥)\n      </label>\n      <select id="enableEmojiShortcuts" data-type="boolean">\n         <option value="1" ${m.enableEmojiShortcuts&&"selected"}>\n            Activés\n         </option>\n         <option value="0" ${!m.enableEmojiShortcuts&&"selected"}>\n            Désactivés\n         </option>\n      </select>\n   </div>\n`), $(".pane.settings .gameStats > .field").html(`\n   <p>\n      Personnalisez les statistiques de partie.\n   </p>\n   <div class="formGroup" title="Afficher ou non le tableau des statistiques de partie.">\n      <label>\n         Affichage du tableau\n      </label>\n      <select id="displayGameStatsTable" data-type="boolean">\n         <option value="1" ${m.displayGameStatsTable&&"selected"}>\n            Activé\n         </option>\n         <option value="0" ${!m.displayGameStatsTable&&"selected"}>\n            Désactivé\n         </option>\n      </select>\n   </div>\n   <div class="formGroup" title="Rendre le tableau libre et déplaçable partout sur l'écran.">\n      <label>\n         Position libre du tableau\n      </label>\n      <select id="enableGameStatsTableFreePosition" data-type="boolean">\n         <option value="1" ${m.enableGameStatsTableFreePosition&&"selected"}>\n            Activée\n         </option>\n         <option value="0" ${!m.enableGameStatsTableFreePosition&&"selected"}>\n            Désactivée\n         </option>\n      </select>\n   </div>\n   <div class="formGroup" title="Sélectionner les différentes statistiques à afficher dans le tableau.">\n      <label>\n         Statistiques à afficher\n      </label>\n      <div class="inputGroup">\n         <label for="displayWordsStat">\n            <input type="checkbox" id="displayWordsStat" ${m.displayWordsStat&&"checked"} />\n            Mots\n         </label>\n         <label for="displayAlphaStat">\n            <input type="checkbox" id="displayAlphaStat" ${m.displayAlphaStat&&"checked"} />\n            Alpha\n         </label>\n         <label for="displayHyphenatedWordsStat">\n            <input type="checkbox" id="displayHyphenatedWordsStat" ${m.displayHyphenatedWordsStat&&"checked"} />\n            Mots composés (MC)\n         </label>\n         <label for="displayLongWordsStat">\n            <input type="checkbox" id="displayLongWordsStat" ${m.displayLongWordsStat&&"checked"} />\n            Mots longs\n         </label>\n         <label for="displayLivesStat">\n            <input type="checkbox" id="displayLivesStat" ${m.displayLivesStat&&"checked"} />\n            Vies (gagnées / perdues)\n         </label>\n         <label for="displayDurationWithoutDeathStat">\n            <input type="checkbox" id="displayDurationWithoutDeathStat" ${m.displayDurationWithoutDeathStat&&"checked"} />\n            Temps passé sans mourir (SM)\n         </label>\n         <label for="displayWordsPerMinuteStat">\n            <input type="checkbox" id="displayWordsPerMinuteStat" ${m.displayWordsPerMinuteStat&&"checked"} />\n            Vitesse d'écriture\n         </label>\n         <label for="displayReactionTimeStat">\n            <input type="checkbox" id="displayReactionTimeStat" ${m.displayReactionTimeStat&&"checked"} />\n            Temps de réaction\n         </label>\n      </div>\n   </div>\n`), $(".pane.settings .keyboard > .field").html(`\n   <p>\n      Gérez les touches et raccourcis clavier.\n   </p>\n   <div class="formGroup" title="Passer son tour en utilisant '/suicide'.">\n      <label>\n         <kbd>Delete</kbd> / <kbd>Suppr.</kbd> : Passer son tour\n      </label>\n      <select id="enableSkipTurnShortcut" data-type="boolean">\n         <option value="1" ${m.enableSkipTurnShortcut&&"selected"}>\n            Activé\n         </option>\n         <option value="0" ${!m.enableSkipTurnShortcut&&"selected"}>\n            Désactivé\n         </option>\n      </select>\n   </div>\n   <div class="formGroup" title="Passer tous ses prochains tours jusqu'à ne plus avoir de vie en utilisant '/suicide'.">\n      <label>\n         <kbd>Alt</kbd> + <kbd>Delete</kbd> / <kbd>Alt</kbd> + <kbd>Suppr.</kbd> : Abandonner la partie\n      </label>\n      <select id="enableGiveUpShortcut" data-type="boolean">\n         <option value="1" ${m.enableGiveUpShortcut&&"selected"}>\n            Activé\n         </option>\n         <option value="0" ${!m.enableGiveUpShortcut&&"selected"}>\n            Désactivé\n         </option>\n      </select>\n   </div>\n   <div class="formGroup" title="Désactiver cette touche permet d'éviter de sortir malencontreusement du champ d'écriture en pleine partie.">\n      <label>\n         Touche <kbd>⭾ Tab</kbd>\n      </label>\n      <select id="enableTabKey" data-type="boolean">\n         <option value="1" ${m.enableTabKey&&"selected"}>\n            Activée\n         </option>\n         <option value="0" ${!m.enableTabKey&&"selected"}>\n            Désactivée\n         </option>\n      </select>\n   </div>\n`), $(".pane.settings .customization > .field").html(`\n   <p>\n      Customisez l'interface à votre guise.\n   </p>\n   <div class="formGroup" title="Modifier la couleur de fond de l'en-tête.">\n      <label>Fond de l'en-tête</label>\n      <div class="inputGroup">\n         <input type="color" value="${m.topbarBackgroundColor}" id="topbarBackgroundColor" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier la couleur du texte de l'en-tête.">\n      <label>Texte de l'en-tête</label>\n      <div class="inputGroup">\n         <input type="color" value="${m.topbarTextColor}" id="topbarTextColor" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier la couleur de fond de la barre latérale.">\n      <label>Fond de la barre latérale</label>\n      <div class="inputGroup">\n         <input type="color" value="${m.sidebarBackgroundColor}" id="sidebarBackgroundColor" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier la couleur des pseudos dans le chat.">\n      <label>Pseudos dans le chat</label>\n      <div class="inputGroup">\n         <input type="color" value="${m.chatNicknamesColor}" id="chatNicknamesColor" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier la couleur des messages du chat.">\n      <label>Messages du chat</label>\n      <div class="inputGroup">\n         <input type="color" value="${m.chatMessagesColor}" id="chatMessagesColor" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier la couleur des messages système du chat.">\n      <label>Messages système du chat</label>\n      <div class="inputGroup">\n         <input type="color" value="${m.chatSystemMessagesColor}" id="chatSystemMessagesColor" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier la couleur des liens cliquables du chat.">\n      <label>Liens cliquables du chat</label>\n      <div class="inputGroup">\n         <input type="color" value="${m.chatLinksColor}" id="chatLinksColor" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier la couleur des lettres restantes de l'alphabet bonus.">\n      <label>Lettres restantes de l'alphabet bonus</label>\n      <div class="inputGroup">\n         <input type="color" value="${m.remainingBonusLettersColor}" id="remainingBonusLettersColor" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier la couleur des lettres utilisées de l'alphabet bonus.">\n      <label>Lettres utilisées de l'alphabet bonus</label>\n      <div class="inputGroup">\n         <input type="color" value="${m.usedBonusLettersColor}" id="usedBonusLettersColor" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier la couleur du pseudo des joueurs présents en jeu.">\n      <label>Pseudo des joueurs présents en jeu</label>\n      <div class="inputGroup">\n         <input type="color" value="${m.presentPlayerNicknamesColor}" id="presentPlayerNicknamesColor" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier la couleur du pseudo des joueurs absents (qui ont quitté) en jeu.">\n      <label>Pseudo des joueurs absents en jeu</label>\n      <div class="inputGroup">\n         <input type="color" value="${m.absentPlayerNicknamesColor}" id="absentPlayerNicknamesColor" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier la couleur du mot du joueur actuel.">\n      <label>Mot du joueur actuel</label>\n      <div class="inputGroup">\n         <input type="color" value="${m.currentPlayerWordColor}" id="currentPlayerWordColor" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier la couleur des mots des autres joueurs.">\n      <label>Mots des autres joueurs</label>\n      <div class="inputGroup">\n         <input type="color" value="${m.otherPlayersWordColor}" id="otherPlayersWordColor" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier la couleur de la syllabe dans les mots.">\n      <label>Syllabe dans les mots</label>\n      <div class="inputGroup">\n         <input type="color" value="${m.wordSyllableColor}" id="wordSyllableColor" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier l'émoji de vie.">\n      <label>Émoji de vie</label>\n      <div class="inputGroup">\n         <input type="text" value="${m.lifeEmoji}" id="lifeEmoji" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier l'émoji de mort.">\n      <label>Émoji de mort</label>\n      <div class="inputGroup">\n         <input type="text" value="${m.deathEmoji}" id="deathEmoji" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier l'émoji de victoire.">\n      <label>Émoji de victoire (actualiser pour mettre à jour)</label>\n      <div class="inputGroup">\n         <input type="text" value="${m.winEmoji}" id="winEmoji" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier la largeur de la barre latérale.">\n      <label>Largeur de la barre latérale (pixels)</label>\n      <div class="inputGroup">\n         <input type="number" value="${m.sidebarWidth}" id="sidebarWidth" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n      <small style="color: red;" class="errorMessage"></small>\n   </div>\n`), $(".pane.settings .gameBackground > .field").html(`\n   <p>\n      Personnalisez l'arrière-plan du jeu.\n   </p>\n   <p>\n      Actualisez la page pour appliquer les changements.\n   </p>\n   <div class="formGroup" title="Sélectionner le type d'arrière-plan.">\n      <label>Type</label>\n      <select id="gameBackgroundType" data-type="number">\n         <option value="${i.D6.Gradient}" ${m.gameBackgroundType===i.D6.Gradient&&"selected"}>\n            Dégradé\n         </option>\n         <option value="${i.D6.Solid}" ${m.gameBackgroundType===i.D6.Solid&&"selected"}>\n            Couleur unie\n         </option>\n         <option value="${i.D6.OnlineImage}" ${m.gameBackgroundType===i.D6.OnlineImage&&"selected"}>\n            Image en-ligne\n         </option>\n      </select>\n   </div>\n   <div class="formGroup" title="Modifier les couleurs du dégradé de l'arrière-plan.">\n      <label>\n         Couleurs du dégradé\n      </label>\n      <div class="inputGroup">\n         <input type="color" value="${m.gradientColors[0]}" id="gradientColors" />\n         <input type="color" value="${m.gradientColors[1]}" id="gradientColors" />\n         <input type="color" value="${m.gradientColors[2]}" id="gradientColors" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier la couleur unie de l'arrière-plan.">\n      <label>\n         Couleur unie\n      </label>\n      <div class="inputGroup">\n         <input type="color" value="${m.solidColor}" id="solidColor" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Modifier l'URL de l'image de l'arrière-plan.">\n      <label>\n         URL de l'image\n      </label>\n      <div class="inputGroup">\n         <input type="text" value="${null!==(h=m.imageURL)&&void 0!==h?h:""}" id="imageURL" placeholder="https://example.com/image.jpeg" />\n         <input type="button" value="↺" title="Réinitialiser" id="reset" />\n      </div>\n   </div>\n   <div class="formGroup" title="Activer l'affichage d'une ombre interne à l'arrière-plan.">\n      <label>\n         Ombre interne\n      </label>\n      <select id="enableInnerShadow" data-type="boolean">\n         <option value="1" ${m.enableInnerShadow&&"selected"}>\n            Activée\n         </option>\n         <option value="0" ${!m.enableInnerShadow&&"selected"}>\n            Désactivée\n         </option>\n      </select>\n   </div>\n`), $(".pane.settings .streamerMode > .field").html(`\n   <p>\n      Gérer le mode streamer pour masquer des informations potentiellement sensibles.\n   </p>\n   <div class="formGroup" title="Masquer l'avatar des joueurs dans la partie (sauf le vôtre).">\n      <label>\n         Masquer les avatars en jeu\n      </label>\n      <select id="hideInGameAvatars" data-type="boolean">\n         <option value="1" ${m.hideInGameAvatars&&"selected"}>\n            Activé\n         </option>\n         <option value="0" ${!m.hideInGameAvatars&&"selected"}>\n            Désactivé\n         </option>\n      </select>\n   </div>\n   <div class="formGroup" title="Masquer le pseudo des joueurs dans la partie (sauf le vôtre).">\n      <label>\n         Masquer les pseudos en jeu\n      </label>\n      <select id="hideInGameNicknames" data-type="boolean">\n         <option value="1" ${m.hideInGameNicknames&&"selected"}>\n            Activé\n         </option>\n         <option value="0" ${!m.hideInGameNicknames&&"selected"}>\n            Désactivé\n         </option>\n      </select>\n   </div>\n`), $(".pane.settings .trainingMode > .field").html(`\n   <p>\n      Le mode entraînement permet d'évaluer sa maîtrise d'une liste de mots.\n   </p>\n   <p>\n      Pour importer une liste: fichier texte (.txt, .text), un mot par ligne.\n   </p>\n   <div class="formGroup" title="Sélectionner une liste avec laquelle s'entraîner.">\n      <label>\n         Liste sélectionnée\n      </label>\n      <select id="trainListId">\n         <option value="null" ${!m.trainListId&&"selected"}>\n            Aucune\n         </option>\n         ${m.trainLists.map((e=>`<option value="${e.id}" ${m.trainListId===e.id&&"selected"}>${e.name} (${(0,s.ZV)(e.words.length)} ${(0,s.td)(e.words.length,"mot","mots")})</option>`))}\n      </select>\n   </div>\n   <div class="formGroup" title="Sélectionner une liste avec laquelle s'entraîner.">\n      <label>\n         Importer une liste\n      </label>\n      <input type="file" accept="text/plain" id="importTrainList" />\n   </div>\n   <div class="formGroup" title="Importer une liste de mots.">\n      <label>\n         Supprimer la liste sélectionnée\n      </label>\n      <input type="button" id="deleteTrainList" value="Supprimer" />\n   </div>\n   <div class="formGroup" title="Exporter la liste de mots sélectionnée.">\n      <label>\n         Exporter la liste sélectionnée\n      </label>\n      <input type="button" id="exportTrainList" value="Exporter" />\n      <a href="#" download="" hidden class="exportTrainListAnchor"></a>\n   </div>\n   <div class="formGroup" title="Ce paramètre vous empêchera d'envoyer des mots hors de votre liste d'entraînement.">\n      <label>\n         Forcer l'usage des mots de la liste\n      </label>\n      <select id="forceTrainList" data-type="boolean">\n         <option value="1" ${m.forceTrainList&&"selected"}>\n            Activé\n         </option>\n         <option value="0" ${!m.forceTrainList&&"selected"}>\n            Désactivé\n         </option>\n      </select>\n   </div>\n   <div class="formGroup" title="Afficher les messages indiquants lorsque vous placez un mot de la liste ou hors de la liste.">\n      <label>\n         Messages\n      </label>\n      <select id="enableTrainMessages" data-type="boolean">\n         <option value="1" ${m.enableTrainMessages&&"selected"}>\n            Activés\n         </option>\n         <option value="0" ${!m.enableTrainMessages&&"selected"}>\n            Désactivés\n         </option>\n      </select>\n   </div>\n`), $(".pane.settings .other > .field").html('\n   <p>\n      Gérez les paramètres divers.\n   </p>\n   <div class="formGroup" title="Importer et affecter des paramètres exportés au préalable.">\n      <label>\n         Importer des paramètres\n      </label>\n      <input type="file" accept="application/json" id="importSettings" />\n   </div>\n   <div class="formGroup" title="Exporter les paramètres actuels pour pouvoir ensuite les réimporter.">\n      <label>\n         Exporter les paramètres\n      </label>\n      <input type="button" id="exportSettings" value="Exporter" />\n      <a href="#" download="" hidden class="exportSettingsAnchor"></a>\n   </div>\n   <div class="formGroup" title="Réinitialiser tous vos paramètres.">\n      <label>\n         Réinitialiser les paramètres\n      </label>\n      <input type="button" value="Réinitialiser" id="resetAll" />\n   </div>\n'), $('\n   <button class="home" title="Accueil">🚪</button>\n').insertAfter(".sidebarToggle").on("click", (() => window.open("https://jklm.fun/", "_blank"))), $("head").append('\n   <link rel="preconnect" href="https://fonts.googleapis.com">\n   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n   <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">\n   <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">\n   <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">\n   <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">\n   <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">\n   <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet">\n'), $(".pane.settings .setting > .field select").on("input", (e => {
                  const t = $(e.target),
                     a = t.attr("id");
                  switch (t.data("type")) {
                     case "number":
                        o.A.settings[a] = Number(t.val());
                        break;
                     case "boolean":
                        o.A.settings[a] = Boolean(Number(t.val()));
                        break;
                     default:
                        o.A.settings[a] = "null" === t.val() ? null : t.val()
                  }
                  switch (a) {
                     case "linkifyChat":
                        if ($(".pane.chat > .log > div > .text > a").each(((e, t) => {
                              const a = $(t);
                              a.replaceWith(a.prop("href"))
                           })), m.linkifyChat === i.$h.Disabled) return;
                        (0, s.cm)(document.querySelectorAll(".pane.chat > .log > div"));
                        break;
                     case "trainListId": {
                        const {
                           trainingMode: e
                        } = o.A.states;
                        if (e.correctWords = 0, e.wrongWords = 0, m.trainListId) {
                           $(".trainingModeStats").show();
                           const e = m.trainLists.find((e => e.id === m.trainListId));
                           $(".trainingModeStats .correctWords").text("0"), $(".trainingModeStats .totalWords").text(`${(0,s.ZV)(e.words.length)} ${(0,s.td)(e.words.length,"mot","mots")}`), $(".trainingModeStats .successRate").text("(100%)")
                        } else $(".trainingModeStats").hide();
                        break
                     }
                     case "chatFontFamily":
                     case "chatFontWeight":
                     case "displayGameStatsTable":
                     case "enableGameStatsTableFreePosition":
                        (0, s.PB)()
                  }
               })), $('.pane.settings .setting > .field input[type="color"]').on("input", (e => {
                  const t = $(e.target),
                     a = t.attr("id");
                  if ("gradientColors" === a) {
                     const e = document.querySelectorAll('.pane.settings .setting > .field input[type="color"]#gradientColors'),
                        t = Array.from(e).map((e => $(e).val().toString()));
                     m[a] = t
                  } else {
                     const e = t.val().toString();
                     m[a] = e, (0, s.PB)()
                  }
               })), $('.pane.settings .setting > .field input[type="text"]').on("input", (e => {
                  const t = $(e.target),
                     a = t.attr("id");
                  let n;
                  "mentionTriggers" === a && (n = t.val().toString().split(",").map((e => e.trim()))), null != n || (n = t.val().toString()), m[a] = n
               })), $('.pane.settings .setting > .field input[type="number"]').on("input", (e => {
                  const t = $(e.target),
                     a = Number(t.val()),
                     n = t.attr("id");
                  if ("sidebarWidth" === n) {
                     if (a < 180) return t.parent().next().text("Largeur minimale: 180.");
                     t.parent().next().text("")
                  }
                  m[n] = a, "sidebarWidth" === n && (0, s.PB)()
               })), $('.pane.settings .setting > .field input[type="button"]').on("click", (e => g(void 0, void 0, void 0, (function* () {
                  const t = $(e.target);
                  switch (t.attr("id")) {
                     case "reset": {
                        const e = t.prev();
                        switch (e.attr("id")) {
                           case "gradientColors": {
                              const e = Array.from(document.querySelectorAll('.pane.settings .setting > .field input[type="color"]#gradientColors')),
                                 t = n.A.DEFAULT_SETTINGS.gradientColors;
                              for (const a of e) $(a).val(t[e.indexOf(a)]);
                              m.gradientColors = t;
                              break
                           }
                           case "mentionTriggers":
                              m.mentionTriggers = [o.A.jklmSettings.nickname], e.val(m.mentionTriggers);
                              break;
                           default: {
                              const t = e.attr("id"),
                                 a = n.A.DEFAULT_SETTINGS[t];
                              m[t] = a, e.val(a), (0, s.PB)();
                              break
                           }
                        }
                        break
                     }
                     case "resetAll":
                        confirm("Vous êtes sur le point de réinitialiser tous vos paramètres. Êtes-vous sûr ?") && (m.reset(), alert("Vos paramètres ont été réinitialisés, la page va se recharger."), location.reload());
                        break;
                     case "exportSettings": {
                        const e = new Blob([JSON.stringify(m.all)], {
                              type: "application/json"
                           }),
                           t = URL.createObjectURL(e),
                           a = $(".exportSettingsAnchor");
                        a.attr("href", t), a.attr("download", "settings.json"), a[0].click(), URL.revokeObjectURL(t);
                        break
                     }
                     case "exportTrainList": {
                        if (!m.trainListId) return alert("Aucune liste sélectionnée.");
                        const e = m.trainLists.find((e => e.id === m.trainListId)),
                           t = new Blob([e.words.join("\n")], {
                              type: "text/plain"
                           }),
                           a = URL.createObjectURL(t),
                           n = $(".exportTrainListAnchor");
                        n.attr("href", a), n.attr("download", `${e.name}.txt`), n[0].click(), URL.revokeObjectURL(a);
                        break
                     }
                     case "deleteTrainList": {
                        if (!m.trainListId) return alert("Aucune liste sélectionnée.");
                        const e = m.trainLists.find((e => e.id === m.trainListId));
                        if (confirm(`Vous êtes sur le point de supprimer la liste "${e.name}" avec ${(0,s.ZV)(e.words.length)} ${(0,s.td)(e.words.length,"mot","mots")}. Êtes-vous sûr ?`)) {
                           const {
                              trainingMode: t
                           } = o.A.states;
                           t.correctWords = 0, t.wrongWords = 0, m.trainLists = m.trainLists.filter((t => t.id !== e.id)), m.trainListId = null, $("#trainListId").html(`\n               <option value="null" selected>\n                  Aucune\n               </option>\n               ${m.trainLists.map((e=>`<option value="${e.id}">${e.name} (${(0,s.ZV)(e.words.length)} ${(0,s.td)(e.words.length,"mot","mots")})</option>`))}\n            `)
                        }
                        break
                     }
                  }
               })))), $('.pane.settings .setting > .field input[type="checkbox"]').on("input", (e => {
                  const t = $(e.target),
                     a = t.attr("id"),
                     n = t.is(":checked");
                  m[a] = n, (0, s.PB)()
               })), $('.pane.settings .setting > .field input[type="file"]').on("change", (e => g(void 0, void 0, void 0, (function* () {
                  const t = $(e.target),
                     a = t.attr("id"),
                     n = t.prop("files");
                  switch (a) {
                     case "importSettings": {
                        const e = n[0];
                        if (!e) return;
                        if ("application/json" !== e.type) return alert("Le fichier doit être de type JSON, assurez-vous de bien importer celui exporté précédemment.");
                        try {
                           const t = JSON.parse(yield e.text());
                           m.all = t, alert("Vos paramètres ont été importés, la page va se recharger."), location.reload()
                        } catch (e) {
                           alert("Une erreur est survenue, assurez-vous de bien importer le fichier exporté précédemment.")
                        }
                        break
                     }
                     case "importTrainList": {
                        const e = n[0];
                        if (!e) return;
                        if ("text/plain" !== e.type) return alert("Le fichier doit être de type texte (.txt, .text).");
                        const t = yield e.text(), a = {
                           id: (0, s.DU)(8),
                           name: e.name.split(".")[0],
                           words: t.split("\n").filter((e => e)).map((e => (0, s.CR)(e.toLowerCase().trim())))
                        };
                        if (!a.words.length) return alert("Le fichier est vide ou ne contient aucun mot.");
                        m.trainLists = [...m.trainLists, a], $("#trainListId").append(`\n            <option value="${a.id}">\n               ${a.name} (${(0,s.ZV)(a.words.length)} ${(0,s.td)(a.words.length,"mot","mots")})\n            </option>\n         `);
                        break
                     }
                  }
               })))), $(".top > .info").append('\n   <span class="gameStats" style="display: none;">\n      <span>⏱️</span>\n      <span class="time">--:--:--</span>\n      <span class="words"></span>\n   </span>\n'), $(".top > .info").append('\n   <span class="trainingModeStats" style="margin-left: 10px; display: none;">\n      <span>🏋️</span>\n      <span>\n         <span class="correctWords">-</span> / <span class="totalWords">-</span>\n      </span>\n      <span class="successRate">(--%)</span>\n   </span>\n'), $(".pane.chat > .input").append('\n   <div class="emojiOptions darkScrollbar" style="display: none;"></div>\n'), $(".pane.chat > .input > textarea").on("input", (e => {
                  var t;
                  const a = $(e.target),
                     n = a.val().toString();
                  if (m.enableEmojiShortcuts) {
                     const e = n.split(/ +/gm).pop();
                     if (e.startsWith(":") && !e.endsWith(":")) {
                        const t = e.slice(1).toLowerCase(),
                           a = Object.keys(p).filter((e => p[e].find((e => e.includes(t))))).sort(((e, t) => p[e][0].length - p[t][0].length));
                        a.length ? $(".emojiOptions").html(a.map((t => `<span class="emojiOption" data-input="${e}" data-emoji="${t}">${t} :${p[t][0]}:</span>`)).join("\n")).show() : $(".emojiOptions").html("").hide()
                     } else $(".emojiOptions").html("").hide();
                     const i = null !== (t = n.match(/\:.+\:/gm)) && void 0 !== t ? t : [];
                     for (const e of i) {
                        const t = e.slice(1, -1).toLowerCase(),
                           i = Object.keys(p).find((e => p[e].find((e => t === e))));
                        i && a.val(n.replace(e, i))
                     }
                  }
               })), $(".emojiOptions").on("click", ".emojiOption", (e => {
                  const t = $(e.target),
                     a = t.data("emoji"),
                     n = t.data("input"),
                     i = $(".pane.chat > .input > textarea");
                  i.val(`${i.val().toString().slice(0,-n.length)}${a}`), i.trigger("focus"), $(".emojiOptions").html("").hide()
               })), $(".sidebar").prepend('\n   <div class="statsTableContainer darkScrollbar">\n      <table class="statsTable" style="display: none;">\n         <thead>\n            <tr>\n               <th class="nickname" title="Pseudo du joueur">Pseudo</th>\n               <th class="words" title="Nombre de mots">Mots</th>\n               <th class="alpha" title="Progression de l\'alpha">Alpha</th>\n               <th class="hyphenatedWords" title="Nombre de mots composés (avec tiret)">MC</th>\n               <th class="longWords" title="Nombre de mots longs (≥ 20 caractères)">Longs</th>\n               <th class="lives" title="Nombre de vies gagnées (+) / perdues (-)">Vies</th>\n               <th class="durationWithoutDeath" title="La durée passée sans mourir">SM</th>\n               <th class="wordsPerMinute" title="Vitesse d\'écriture en mots par minute">Écriture</th>\n               <th class="averageReactionTime" title="Temps de réaction moyen en secondes">Réac.</th>\n            </tr>\n         </thead>\n         <tbody></tbody>\n      </table>\n   </div>\n'),
               function (e, t, a, n) {
                  c || document.addEventListener(u ? "touchmove" : "mousemove", (function (e) {
                     let t = e;
                     e.touches && (t = e.touches[0]);
                     for (var a = 0; a < d.length; a++) d[a](t.clientX, t.clientY)
                  })), c = !0;
                  let i = !1,
                     o = !1,
                     s = 0,
                     r = 0,
                     l = 0,
                     p = 0;
                  t.addEventListener(u ? "touchstart" : "mousedown", (function (t) {
                     if (t.stopPropagation(), t.preventDefault(), "false" === e.dataset.dragEnabled) return;
                     let a = t;
                     t.touches && (a = t.touches[0]), i = !0, s = e.offsetLeft - a.clientX, r = e.offsetTop - a.clientY
                  })), document.addEventListener(u ? "touchend" : "mouseup", (function (t) {
                     n && o && n(0, parseInt(e.style.left), parseInt(e.style.top)), i = !1, o = !1
                  })), d.push((function (t, n) {
                     i && (o || (o = !0, a && a()), l = t + s, p = n + r, "true" === e.dataset.dragBoundary && (l = Math.min(window.innerWidth - e.offsetWidth, Math.max(0, l)), p = Math.min(window.innerHeight - e.offsetHeight, Math.max(0, p))), e.style.left = l + "px", e.style.top = p + "px")
                  }))
               }(document.querySelector(".statsTableContainer"), document.querySelector(".statsTableContainer > .statsTable"), (() => {
                  m.enableGameStatsTableFreePosition && $(".statsTableContainer").css("cursor", "grabbing")
               }), ((e, t, a) => {
                  m.enableGameStatsTableFreePosition && (m.gameStatsTablePosition = {
                     x: t,
                     y: a
                  }, $(".statsTableContainer").css("cursor", "grab"))
               })), GM_addStyle('\n   .chat.pane > .input {\n      position: relative;\n   }\n\n   .emojiOptions {\n      max-height: 400px;\n      overflow-y: auto;\n      width: 100%;\n      display: flex;\n      flex-direction: column;\n      position: absolute;\n      bottom: 54px;\n      right: 0px;\n      z-index: 999;\n      background: #131313;\n      color: white;\n   }\n\n   .emojiOptions > span {\n      cursor: pointer;\n      padding: 5px;\n   }\n\n   .emojiOptions > span:hover {\n      background: rgba(255, 255, 255, .05);\n   }\n\n   .inputGroup:has(input[type="checkbox"]) {\n      flex-direction: column;\n   }\n\n   .inputGroup > label:has(> input[type="checkbox"]) {\n      display: flex;\n      gap: .3em;\n      align-items: center;\n      cursor: pointer;\n   }\n\n   .inputGroup > label > input[type="checkbox"] {\n      width: auto;\n      height: auto;\n   }\n\n   .statsTableContainer {\n      z-index: 999;\n      overflow: auto;\n      max-height: 20%;\n   }\n\n   .statsTable {\n      border-collapse: collapse;\n      width: 100%;\n      height: 100%;\n      color: white;\n      font-size: 0.7em;\n      position: relative;\n      table-layout: auto;\n   }\n\n   .statsTable tr:nth-child(even) {\n      background: rgba(0, 0, 0, .15);\n   }\n\n   .statsTable tr.self {\n      color: #44dd44;\n   }\n\n   .statsTable tr.self.isDead {\n      color: #1b591b;\n   }\n\n   .statsTable tr.isDead {\n      color: #666;\n   }\n\n   .statsTable tr.isDead > .nickname {\n      text-decoration: line-through;\n   }\n\n   .statsTable th {\n      background: #181818;\n      position: sticky;\n      top: -1px;\n      padding: 7px 0;\n   }\n\n   .statsTable td {\n      padding: 5px;\n   }\n\n   .statsTable td.nickname {\n      max-width: 70px;\n      overflow: hidden;\n      white-space: nowrap;\n      text-overflow: ellipsis;\n   }\n\n   .statsTable th,\n   .statsTable td {\n      text-align: center;\n      border: 1px solid #333;\n   }\n\n   .formGroup:not(:last-child) {\n      margin-bottom: 10px;\n   }\n\n   kbd {\n      background-color: #333;\n      border-radius: 3px;\n      border: 1px solid #555;\n      color: #ccc;\n      font-size: 0.9em;\n      padding: 0 3px;\n      white-space: nowrap;\n      font-family: monospace;\n   }\n\n   select,\n   input[type="color"],\n   input[type="button"] {\n      cursor: pointer;\n   }\n\n   input[type="color"] {\n      height: 27px;\n      padding: .3em;\n   }\n\n   input[type="color"]::-webkit-color-swatch-wrapper {\n      padding: 0;\n   }\n\n   .inputGroup {\n      display: flex;\n      gap: .3em;\n   }\n\n   .inputGroup > input[type="button"] {\n      width: fit-content;\n      padding: 0 10px;\n      align-self: stretch;\n   }\n\n   .top > .volume > input[type="range"]::-webkit-slider-thumb {\n      background: var(--background-color);\n      border-color: rgba(0, 0, 0, .4);\n   }\n\n   .top > .volume > input[type="range"]::-moz-range-thumb {\n      background: var(--background-color);\n      border-color: rgba(0, 0, 0, .4);\n   }\n\n   .top > .volume > input[type="range"]::-ms-thumb {\n      background: var(--background-color);\n      border-color: rgba(0, 0, 0, .4);\n   }\n\n   small {\n      font-size: .9em;\n   }\n'), (0, s.PB)(), (() => {
                  for (const e of Object.keys(l)) window.addEventListener(e, l[e])
               })(), appendToChat = (e, t, a = null) => {
                  if (null != e && !e.isBroadcast && ignoredPeerIds.includes(e.peerId)) return;
                  sidebar.hidden && sidebarToggleButton.classList.add("unread"), ++chatMessageCount > maxChatMessageCount && chatLog.removeChild($(chatLog, "div:not(.newMessages)"));
                  let n = chatLog.scrollHeight - chatLog.clientHeight - chatLog.scrollTop < 10,
                     i = null !== a ? "bot-messages" : "",
                     s = $make("div", chatLog, {
                        className: null == e ? "system" : i
                     });
                  "bot-messages" === i && applyStyleProperties(s, a);
                  let r = new Date,
                     l = `0${r.getHours()}`.slice(-2) + ":" + `0${r.getMinutes()}`.slice(-2);
                  if ($make("span", s, {
                        className: "time",
                        textContent: l
                     }), $makeText(" ", s), null != e && e.isBroadcast) {
                     s.classList.add("highlight");
                     let a = $make("span", s, {
                        className: "broadcast"
                     });
                     $make("span", a, {
                        className: "author",
                        textContent: e.nickname
                     }), $makeText(": " + t, a)
                  } else {
                     if (null != e) {
                        let t = null != e.roles ? e.roles : [],
                           a = $make("span", s, {
                              className: "badges"
                           });
                        for (let e of t) {
                           let t = badgesByRole[e];
                           $make("span", a, {
                              textContent: t.icon,
                              title: t.text
                           })
                        }
                        let n = null != e.auth ? e.auth.service : "guest",
                           i = $make("a", s, {
                              className: `author ${n}`,
                              dataset: {
                                 peerId: e.peerId
                              },
                              href: "#"
                           });
                        $make("img", i, {
                           className: "service",
                           src: `/images/auth/${n}.png`,
                           alt: ""
                        }), $makeText(e.nickname, i), $setTooltip(i, getAuthTextFromProfile(e)), $makeText(": ", s)
                     }
                     $make("span", s, {
                        className: "text",
                        textContent: t
                     }), (m.mentionTriggers.length ? m.mentionTriggers : [o.A.jklmSettings.nickname]).some((e => t.toLowerCase().includes(e.toLowerCase()))) && s.classList.add("highlight")
                  }("hidden" === document.visibilityState || sidebar.hidden || chatTab.hidden) && (unreadMarkerElt.hidden && (chatLog.insertBefore(unreadMarkerElt, s), $show(unreadMarkerElt)), s.classList.contains("highlight") && (chatUnreadHighlightCount++, navigator.setAppBadge(chatUnreadHighlightCount), document.title = `(${chatUnreadHighlightCount}) ${documentTitle}`, jklmAudio.play("notification"))), n && (chatLog.scrollTop = chatLog.scrollHeight)
               }, (() => {
                  const e = new MutationObserver(((e, t) => {
                        const a = e[0];
                        if ("childList" === a.type && a.addedNodes.length) {
                           const {
                              notifyOnChatMention: e
                           } = m;
                           for (const t of a.addedNodes) {
                              const a = $(t);
                              a.hasClass("highlight") && (e === i.mh.Always || e === i.mh.OnlyWhenNotFocused && !document.hasFocus()) && GM_notification({
                                 title: "💬 Mention dans le chat",
                                 text: `${a.find(".author").text()} vous a mentionné dans le chat, cliquez ici pour y aller.`,
                                 onclick: () => window.focus(),
                                 timeout: 7e3
                              })
                           }
                           m.linkifyChat !== i.$h.Disabled && (0, s.cm)(a.addedNodes);
                           const t = e => e.toString().padStart(2, "0");
                           if (m.timestampFormat === i.sd.Full)
                              for (const e of a.addedNodes) {
                                 const a = new Date;
                                 $(e).find(".time").text(`${t(a.getHours())}:${t(a.getMinutes())}:${t(a.getSeconds())}`)
                              }(0, s.PB)()
                        }
                     })),
                     t = document.querySelector(".pane.chat > .log");
                  e.observe(t, {
                     childList: !0
                  })
               })()
         },
         84: (e, t, a) => {
            a.d(t, {
               PB: () => Tt,
               ZV: () => $t,
               qv: () => xt,
               cm: () => vt,
               td: () => St,
               DU: () => At,
               CR: () => Ct
            });
            const n = "aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4vianca6w0s2x0a2z0ure5ba0by2idu3namex3narepublic11d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2ntley5rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0cast4mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dabur3d1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3nlop4pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2o0dyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0ardian6cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6logistics9properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3ncaster6d0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2psy3ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rckmsd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2tura4vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9dnavy5lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0america6xi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0stone5umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0a1b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp2w2ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2olterskluwer11odside6rk0s2ld3w2s1tc1f3xbox3erox4finity6ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2",
               i = "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2",
               o = (e, t) => {
                  for (const a in t) e[a] = t[a];
                  return e
               },
               s = "numeric",
               r = "ascii",
               l = "alpha",
               c = "asciinumeric",
               d = "alphanumeric",
               u = "domain",
               p = "emoji",
               h = "scheme",
               g = "slashscheme",
               m = "whitespace";

            function _(e, t) {
               return e in t || (t[e] = []), t[e]
            }

            function f(e, t, a) {
               t[s] && (t[c] = !0, t[d] = !0), t[r] && (t[c] = !0, t[l] = !0), t[c] && (t[d] = !0), t[l] && (t[d] = !0), t[d] && (t[u] = !0), t[p] && (t[u] = !0);
               for (const n in t) {
                  const t = _(n, a);
                  t.indexOf(e) < 0 && t.push(e)
               }
            }

            function b(e) {
               void 0 === e && (e = null), this.j = {}, this.jr = [], this.jd = null, this.t = e
            }
            b.groups = {}, b.prototype = {
               accepts() {
                  return !!this.t
               },
               go(e) {
                  const t = this,
                     a = t.j[e];
                  if (a) return a;
                  for (let a = 0; a < t.jr.length; a++) {
                     const n = t.jr[a][0],
                        i = t.jr[a][1];
                     if (i && n.test(e)) return i
                  }
                  return t.jd
               },
               has(e, t) {
                  return void 0 === t && (t = !1), t ? e in this.j : !!this.go(e)
               },
               ta(e, t, a, n) {
                  for (let i = 0; i < e.length; i++) this.tt(e[i], t, a, n)
               },
               tr(e, t, a, n) {
                  let i;
                  return n = n || b.groups, t && t.j ? i = t : (i = new b(t), a && n && f(t, a, n)), this.jr.push([e, i]), i
               },
               ts(e, t, a, n) {
                  let i = this;
                  const o = e.length;
                  if (!o) return i;
                  for (let t = 0; t < o - 1; t++) i = i.tt(e[t]);
                  return i.tt(e[o - 1], t, a, n)
               },
               tt(e, t, a, n) {
                  n = n || b.groups;
                  const i = this;
                  if (t && t.j) return i.j[e] = t, t;
                  const s = t;
                  let r, l = i.go(e);
                  if (l ? (r = new b, o(r.j, l.j), r.jr.push.apply(r.jr, l.jr), r.jd = l.jd, r.t = l.t) : r = new b, s) {
                     if (n)
                        if (r.t && "string" == typeof r.t) {
                           const e = o(function (e, t) {
                              const a = {};
                              for (const n in t) t[n].indexOf(e) >= 0 && (a[n] = !0);
                              return a
                           }(r.t, n), a);
                           f(s, e, n)
                        } else a && f(s, a, n);
                     r.t = s
                  }
                  return i.j[e] = r, r
               }
            };
            const y = (e, t, a, n, i) => e.ta(t, a, n, i),
               w = (e, t, a, n, i) => e.tr(t, a, n, i),
               v = (e, t, a, n, i) => e.ts(t, a, n, i),
               k = (e, t, a, n, i) => e.tt(t, a, n, i),
               T = "WORD",
               x = "UWORD",
               S = "LOCALHOST",
               C = "TLD",
               A = "UTLD",
               L = "SCHEME",
               I = "SLASH_SCHEME",
               M = "NUM",
               P = "WS",
               D = "NL",
               j = "OPENBRACE",
               N = "CLOSEBRACE",
               E = "OPENBRACKET",
               G = "CLOSEBRACKET",
               W = "OPENPAREN",
               R = "CLOSEPAREN",
               V = "OPENANGLEBRACKET",
               O = "CLOSEANGLEBRACKET",
               z = "FULLWIDTHLEFTPAREN",
               F = "FULLWIDTHRIGHTPAREN",
               B = "LEFTCORNERBRACKET",
               q = "RIGHTCORNERBRACKET",
               U = "LEFTWHITECORNERBRACKET",
               H = "RIGHTWHITECORNERBRACKET",
               K = "FULLWIDTHLESSTHAN",
               Q = "FULLWIDTHGREATERTHAN",
               Z = "AMPERSAND",
               Y = "APOSTROPHE",
               J = "ASTERISK",
               X = "AT",
               ee = "BACKSLASH",
               te = "BACKTICK",
               ae = "CARET",
               ne = "COLON",
               ie = "COMMA",
               oe = "DOLLAR",
               se = "DOT",
               re = "EQUALS",
               le = "EXCLAMATION",
               ce = "HYPHEN",
               de = "PERCENT",
               ue = "PIPE",
               pe = "PLUS",
               he = "POUND",
               ge = "QUERY",
               me = "QUOTE",
               _e = "SEMI",
               fe = "SLASH",
               be = "TILDE",
               ye = "UNDERSCORE",
               we = "EMOJI",
               ve = "SYM";
            var ke = Object.freeze({
               __proto__: null,
               WORD: T,
               UWORD: x,
               LOCALHOST: S,
               TLD: C,
               UTLD: A,
               SCHEME: L,
               SLASH_SCHEME: I,
               NUM: M,
               WS: P,
               NL: D,
               OPENBRACE: j,
               CLOSEBRACE: N,
               OPENBRACKET: E,
               CLOSEBRACKET: G,
               OPENPAREN: W,
               CLOSEPAREN: R,
               OPENANGLEBRACKET: V,
               CLOSEANGLEBRACKET: O,
               FULLWIDTHLEFTPAREN: z,
               FULLWIDTHRIGHTPAREN: F,
               LEFTCORNERBRACKET: B,
               RIGHTCORNERBRACKET: q,
               LEFTWHITECORNERBRACKET: U,
               RIGHTWHITECORNERBRACKET: H,
               FULLWIDTHLESSTHAN: K,
               FULLWIDTHGREATERTHAN: Q,
               AMPERSAND: Z,
               APOSTROPHE: Y,
               ASTERISK: J,
               AT: X,
               BACKSLASH: ee,
               BACKTICK: te,
               CARET: ae,
               COLON: ne,
               COMMA: ie,
               DOLLAR: oe,
               DOT: se,
               EQUALS: re,
               EXCLAMATION: le,
               HYPHEN: ce,
               PERCENT: de,
               PIPE: ue,
               PLUS: pe,
               POUND: he,
               QUERY: ge,
               QUOTE: me,
               SEMI: _e,
               SLASH: fe,
               TILDE: be,
               UNDERSCORE: ye,
               EMOJI: we,
               SYM: ve
            });
            const Te = /[a-z]/,
               xe = /\p{L}/u,
               Se = /\p{Emoji}/u,
               Ce = /\d/,
               Ae = /\s/,
               $e = "\n",
               Le = "️",
               Ie = "‍";
            let Me = null,
               Pe = null;

            function De(e, t, a, n, i) {
               let o;
               const s = t.length;
               for (let a = 0; a < s - 1; a++) {
                  const s = t[a];
                  e.j[s] ? o = e.j[s] : (o = new b(n), o.jr = i.slice(), e.j[s] = o), e = o
               }
               return o = new b(a), o.jr = i.slice(), e.j[t[s - 1]] = o, o
            }

            function je(e) {
               const t = [],
                  a = [];
               let n = 0;
               for (; n < e.length;) {
                  let i = 0;
                  for (;
                     "0123456789".indexOf(e[n + i]) >= 0;) i++;
                  if (i > 0) {
                     t.push(a.join(""));
                     for (let t = parseInt(e.substring(n, n + i), 10); t > 0; t--) a.pop();
                     n += i
                  } else a.push(e[n]), n++
               }
               return t
            }
            const Ne = {
               defaultProtocol: "http",
               events: null,
               format: Ge,
               formatHref: Ge,
               nl2br: !1,
               tagName: "a",
               target: null,
               rel: null,
               validate: !0,
               truncate: 1 / 0,
               className: null,
               attributes: null,
               ignoreTags: [],
               render: null
            };

            function Ee(e, t) {
               void 0 === t && (t = null);
               let a = o({}, Ne);
               e && (a = o(a, e instanceof Ee ? e.o : e));
               const n = a.ignoreTags,
                  i = [];
               for (let e = 0; e < n.length; e++) i.push(n[e].toUpperCase());
               this.o = a, t && (this.defaultRender = t), this.ignoreTags = i
            }

            function Ge(e) {
               return e
            }

            function We(e, t) {
               this.t = "token", this.v = e, this.tk = t
            }

            function Re(e, t) {
               class a extends We {
                  constructor(t, a) {
                     super(t, a), this.t = e
                  }
               }
               for (const e in t) a.prototype[e] = t[e];
               return a.t = e, a
            }
            Ee.prototype = {
               o: Ne,
               ignoreTags: [],
               defaultRender: e => e,
               check(e) {
                  return this.get("validate", e.toString(), e)
               },
               get(e, t, a) {
                  const n = null != t;
                  let i = this.o[e];
                  return i ? ("object" == typeof i ? (i = a.t in i ? i[a.t] : Ne[e], "function" == typeof i && n && (i = i(t, a))) : "function" == typeof i && n && (i = i(t, a.t, a)), i) : i
               },
               getObj(e, t, a) {
                  let n = this.o[e];
                  return "function" == typeof n && null != t && (n = n(t, a.t, a)), n
               },
               render(e) {
                  const t = e.render(this);
                  return (this.get("render", null, e) || this.defaultRender)(t, e.t, e)
               }
            }, We.prototype = {
               isLink: !1,
               toString() {
                  return this.v
               },
               toHref(e) {
                  return this.toString()
               },
               toFormattedString(e) {
                  const t = this.toString(),
                     a = e.get("truncate", t, this),
                     n = e.get("format", t, this);
                  return a && n.length > a ? n.substring(0, a) + "…" : n
               },
               toFormattedHref(e) {
                  return e.get("formatHref", this.toHref(e.get("defaultProtocol")), this)
               },
               startIndex() {
                  return this.tk[0].s
               },
               endIndex() {
                  return this.tk[this.tk.length - 1].e
               },
               toObject(e) {
                  return void 0 === e && (e = Ne.defaultProtocol), {
                     type: this.t,
                     value: this.toString(),
                     isLink: this.isLink,
                     href: this.toHref(e),
                     start: this.startIndex(),
                     end: this.endIndex()
                  }
               },
               toFormattedObject(e) {
                  return {
                     type: this.t,
                     value: this.toFormattedString(e),
                     isLink: this.isLink,
                     href: this.toFormattedHref(e),
                     start: this.startIndex(),
                     end: this.endIndex()
                  }
               },
               validate(e) {
                  return e.get("validate", this.toString(), this)
               },
               render(e) {
                  const t = this,
                     a = this.toHref(e.get("defaultProtocol")),
                     n = e.get("formatHref", a, this),
                     i = e.get("tagName", a, t),
                     s = this.toFormattedString(e),
                     r = {},
                     l = e.get("className", a, t),
                     c = e.get("target", a, t),
                     d = e.get("rel", a, t),
                     u = e.getObj("attributes", a, t),
                     p = e.getObj("events", a, t);
                  return r.href = n, l && (r.class = l), c && (r.target = c), d && (r.rel = d), u && o(r, u), {
                     tagName: i,
                     attributes: r,
                     content: s,
                     eventListeners: p
                  }
               }
            };
            const Ve = Re("email", {
                  isLink: !0,
                  toHref() {
                     return "mailto:" + this.toString()
                  }
               }),
               Oe = Re("text"),
               ze = Re("nl"),
               Fe = Re("url", {
                  isLink: !0,
                  toHref(e) {
                     return void 0 === e && (e = Ne.defaultProtocol), this.hasProtocol() ? this.v : `${e}://${this.v}`
                  },
                  hasProtocol() {
                     const e = this.tk;
                     return e.length >= 2 && e[0].t !== S && e[1].t === ne
                  }
               }),
               Be = e => new b(e);

            function qe(e, t, a) {
               const n = a[0].s,
                  i = a[a.length - 1].e;
               return new e(t.slice(n, i), a)
            }
            "undefined" != typeof console && console && console.warn;
            const Ue = {
               scanner: null,
               parser: null,
               tokenQueue: [],
               pluginQueue: [],
               customSchemes: [],
               initialized: !1
            };

            function He(e) {
               return Ue.initialized || function () {
                     Ue.scanner = function (e) {
                        void 0 === e && (e = []);
                        const t = {};
                        b.groups = t;
                        const a = new b;
                        null == Me && (Me = je(n)), null == Pe && (Pe = je(i)), k(a, "'", Y), k(a, "{", j), k(a, "}", N), k(a, "[", E), k(a, "]", G), k(a, "(", W), k(a, ")", R), k(a, "<", V), k(a, ">", O), k(a, "（", z), k(a, "）", F), k(a, "「", B), k(a, "」", q), k(a, "『", U), k(a, "』", H), k(a, "＜", K), k(a, "＞", Q), k(a, "&", Z), k(a, "*", J), k(a, "@", X), k(a, "`", te), k(a, "^", ae), k(a, ":", ne), k(a, ",", ie), k(a, "$", oe), k(a, ".", se), k(a, "=", re), k(a, "!", le), k(a, "-", ce), k(a, "%", de), k(a, "|", ue), k(a, "+", pe), k(a, "#", he), k(a, "?", ge), k(a, '"', me), k(a, "/", fe), k(a, ";", _e), k(a, "~", be), k(a, "_", ye), k(a, "\\", ee);
                        const d = w(a, Ce, M, {
                           [s]: !0
                        });
                        w(d, Ce, d);
                        const _ = w(a, Te, T, {
                           [r]: !0
                        });
                        w(_, Te, _);
                        const y = w(a, xe, x, {
                           [l]: !0
                        });
                        w(y, Te), w(y, xe, y);
                        const $ = w(a, Ae, P, {
                           [m]: !0
                        });
                        k(a, $e, D, {
                           [m]: !0
                        }), k($, $e), w($, Ae, $);
                        const Ne = w(a, Se, we, {
                           [p]: !0
                        });
                        w(Ne, Se, Ne), k(Ne, Le, Ne);
                        const Ee = k(Ne, Ie);
                        w(Ee, Se, Ne);
                        const Ge = [
                              [Te, _]
                           ],
                           We = [
                              [Te, null],
                              [xe, y]
                           ];
                        for (let e = 0; e < Me.length; e++) De(a, Me[e], C, T, Ge);
                        for (let e = 0; e < Pe.length; e++) De(a, Pe[e], A, x, We);
                        f(C, {
                           tld: !0,
                           ascii: !0
                        }, t), f(A, {
                           utld: !0,
                           alpha: !0
                        }, t), De(a, "file", L, T, Ge), De(a, "mailto", L, T, Ge), De(a, "http", I, T, Ge), De(a, "https", I, T, Ge), De(a, "ftp", I, T, Ge), De(a, "ftps", I, T, Ge), f(L, {
                           scheme: !0,
                           ascii: !0
                        }, t), f(I, {
                           slashscheme: !0,
                           ascii: !0
                        }, t), e = e.sort(((e, t) => e[0] > t[0] ? 1 : -1));
                        for (let t = 0; t < e.length; t++) {
                           const n = e[t][0],
                              i = e[t][1] ? {
                                 [h]: !0
                              } : {
                                 [g]: !0
                              };
                           n.indexOf("-") >= 0 ? i[u] = !0 : Te.test(n) ? Ce.test(n) ? i[c] = !0 : i[r] = !0 : i[s] = !0, v(a, n, n, i)
                        }
                        return v(a, "localhost", S, {
                           ascii: !0
                        }), a.jd = new b(ve), {
                           start: a,
                           tokens: o({
                              groups: t
                           }, ke)
                        }
                     }(Ue.customSchemes);
                     for (let e = 0; e < Ue.tokenQueue.length; e++) Ue.tokenQueue[e][1]({
                        scanner: Ue.scanner
                     });
                     Ue.parser = function (e) {
                        let {
                           groups: t
                        } = e;
                        const a = t.domain.concat([Z, J, X, ee, te, ae, oe, re, ce, M, de, ue, pe, he, fe, ve, be, ye]),
                           n = [Y, ne, ie, se, le, ge, me, _e, V, O, j, N, G, E, W, R, z, F, B, q, U, H, K, Q],
                           i = [Z, Y, J, ee, te, ae, oe, re, ce, j, N, de, ue, pe, he, ge, fe, ve, be, ye],
                           o = Be(),
                           s = k(o, be);
                        y(s, i, s), y(s, t.domain, s);
                        const r = Be(),
                           l = Be(),
                           c = Be();
                        y(o, t.domain, r), y(o, t.scheme, l), y(o, t.slashscheme, c), y(r, i, s), y(r, t.domain, r);
                        const d = k(r, X);
                        k(s, X, d), k(l, X, d), k(c, X, d);
                        const u = k(s, se);
                        y(u, i, s), y(u, t.domain, s);
                        const p = Be();
                        y(d, t.domain, p), y(p, t.domain, p);
                        const h = k(p, se);
                        y(h, t.domain, p);
                        const g = Be(Ve);
                        y(h, t.tld, g), y(h, t.utld, g), k(d, S, g);
                        const m = k(p, ce);
                        y(m, t.domain, p), y(g, t.domain, p), k(g, se, h), k(g, ce, m);
                        const _ = k(g, ne);
                        y(_, t.numeric, Ve);
                        const f = k(r, ce),
                           b = k(r, se);
                        y(f, t.domain, r), y(b, i, s), y(b, t.domain, r);
                        const w = Be(Fe);
                        y(b, t.tld, w), y(b, t.utld, w), y(w, t.domain, r), y(w, i, s), k(w, se, b), k(w, ce, f), k(w, X, d);
                        const v = k(w, ne),
                           T = Be(Fe);
                        y(v, t.numeric, T);
                        const x = Be(Fe),
                           C = Be();
                        y(x, a, x), y(x, n, C), y(C, a, x), y(C, n, C), k(w, fe, x), k(T, fe, x);
                        const A = k(l, ne),
                           $ = k(c, ne),
                           L = k($, fe),
                           I = k(L, fe);
                        y(l, t.domain, r), k(l, se, b), k(l, ce, f), y(c, t.domain, r), k(c, se, b), k(c, ce, f), y(A, t.domain, x), k(A, fe, x), y(I, t.domain, x), y(I, a, x), k(I, fe, x);
                        const P = [
                           [j, N],
                           [E, G],
                           [W, R],
                           [V, O],
                           [z, F],
                           [B, q],
                           [U, H],
                           [K, Q]
                        ];
                        for (let e = 0; e < P.length; e++) {
                           const [t, i] = P[e], o = k(x, t);
                           k(C, t, o), k(o, i, x);
                           const s = Be(Fe);
                           y(o, a, s);
                           const r = Be();
                           y(o, n), y(s, a, s), y(s, n, r), y(r, a, s), y(r, n, r), k(s, i, x), k(r, i, x)
                        }
                        return k(o, S, w), k(o, D, ze), {
                           start: o,
                           tokens: ke
                        }
                     }(Ue.scanner.tokens);
                     for (let e = 0; e < Ue.pluginQueue.length; e++) Ue.pluginQueue[e][1]({
                        scanner: Ue.scanner,
                        parser: Ue.parser
                     });
                     Ue.initialized = !0
                  }(),
                  function (e, t, a) {
                     let n = a.length,
                        i = 0,
                        o = [],
                        s = [];
                     for (; i < n;) {
                        let r = e,
                           l = null,
                           c = null,
                           d = 0,
                           u = null,
                           p = -1;
                        for (; i < n && !(l = r.go(a[i].t));) s.push(a[i++]);
                        for (; i < n && (c = l || r.go(a[i].t));) l = null, r = c, r.accepts() ? (p = 0, u = r) : p >= 0 && p++, i++, d++;
                        if (p < 0) i -= d, i < n && (s.push(a[i]), i++);
                        else {
                           s.length > 0 && (o.push(qe(Oe, t, s)), s = []), i -= p, d -= p;
                           const e = u.t,
                              n = a.slice(i - d, i);
                           o.push(qe(e, t, n))
                        }
                     }
                     return s.length > 0 && o.push(qe(Oe, t, s)), o
                  }(Ue.parser.start, e, function (e, t) {
                     const a = function (e) {
                           const t = [],
                              a = e.length;
                           let n = 0;
                           for (; n < a;) {
                              let i, o = e.charCodeAt(n),
                                 s = o < 55296 || o > 56319 || n + 1 === a || (i = e.charCodeAt(n + 1)) < 56320 || i > 57343 ? e[n] : e.slice(n, n + 2);
                              t.push(s), n += s.length
                           }
                           return t
                        }(t.replace(/[A-Z]/g, (e => e.toLowerCase()))),
                        n = a.length,
                        i = [];
                     let o = 0,
                        s = 0;
                     for (; s < n;) {
                        let r = e,
                           l = null,
                           c = 0,
                           d = null,
                           u = -1,
                           p = -1;
                        for (; s < n && (l = r.go(a[s]));) r = l, r.accepts() ? (u = 0, p = 0, d = r) : u >= 0 && (u += a[s].length, p++), c += a[s].length, o += a[s].length, s++;
                        o -= u, s -= p, c -= u, i.push({
                           t: d.t,
                           v: t.slice(o - c, o),
                           s: o - c,
                           e: o
                        })
                     }
                     return i
                  }(Ue.scanner.start, e))
            }
            var Ke = {
                  amp: "&",
                  gt: ">",
                  lt: "<",
                  nbsp: " ",
                  quot: '"'
               },
               Qe = /^#[xX]([A-Fa-f0-9]+)$/,
               Ze = /^#([0-9]+)$/,
               Ye = /^([A-Za-z0-9]+)$/,
               Je = function () {
                  function e(e) {
                     this.named = e
                  }
                  return e.prototype.parse = function (e) {
                     if (e) {
                        var t = e.match(Qe);
                        return t ? String.fromCharCode(parseInt(t[1], 16)) : (t = e.match(Ze)) ? String.fromCharCode(parseInt(t[1], 10)) : (t = e.match(Ye)) ? this.named[t[1]] || "&" + t[1] + ";" : void 0
                     }
                  }, e
               }(),
               Xe = /[\t\n\f ]/,
               et = /[A-Za-z]/,
               tt = /\r\n?/g;

            function at(e) {
               return Xe.test(e)
            }

            function nt(e) {
               return et.test(e)
            }
            var it = function () {
                  function e(e, t, a) {
                     void 0 === a && (a = "precompile"), this.delegate = e, this.entityParser = t, this.mode = a, this.state = "beforeData", this.line = -1, this.column = -1, this.input = "", this.index = -1, this.tagNameBuffer = "", this.states = {
                        beforeData: function () {
                           var e = this.peek();
                           if ("<" !== e || this.isIgnoredEndTag()) {
                              if ("precompile" === this.mode && "\n" === e) {
                                 var t = this.tagNameBuffer.toLowerCase();
                                 "pre" !== t && "textarea" !== t || this.consume()
                              }
                              this.transitionTo("data"), this.delegate.beginData()
                           } else this.transitionTo("tagOpen"), this.markTagStart(), this.consume()
                        },
                        data: function () {
                           var e = this.peek(),
                              t = this.tagNameBuffer;
                           "<" !== e || this.isIgnoredEndTag() ? "&" === e && "script" !== t && "style" !== t ? (this.consume(), this.delegate.appendToData(this.consumeCharRef() || "&")) : (this.consume(), this.delegate.appendToData(e)) : (this.delegate.finishData(), this.transitionTo("tagOpen"), this.markTagStart(), this.consume())
                        },
                        tagOpen: function () {
                           var e = this.consume();
                           "!" === e ? this.transitionTo("markupDeclarationOpen") : "/" === e ? this.transitionTo("endTagOpen") : ("@" === e || ":" === e || nt(e)) && (this.transitionTo("tagName"), this.tagNameBuffer = "", this.delegate.beginStartTag(), this.appendToTagName(e))
                        },
                        markupDeclarationOpen: function () {
                           var e = this.consume();
                           "-" === e && "-" === this.peek() ? (this.consume(), this.transitionTo("commentStart"), this.delegate.beginComment()) : "DOCTYPE" === e.toUpperCase() + this.input.substring(this.index, this.index + 6).toUpperCase() && (this.consume(), this.consume(), this.consume(), this.consume(), this.consume(), this.consume(), this.transitionTo("doctype"), this.delegate.beginDoctype && this.delegate.beginDoctype())
                        },
                        doctype: function () {
                           at(this.consume()) && this.transitionTo("beforeDoctypeName")
                        },
                        beforeDoctypeName: function () {
                           var e = this.consume();
                           at(e) || (this.transitionTo("doctypeName"), this.delegate.appendToDoctypeName && this.delegate.appendToDoctypeName(e.toLowerCase()))
                        },
                        doctypeName: function () {
                           var e = this.consume();
                           at(e) ? this.transitionTo("afterDoctypeName") : ">" === e ? (this.delegate.endDoctype && this.delegate.endDoctype(), this.transitionTo("beforeData")) : this.delegate.appendToDoctypeName && this.delegate.appendToDoctypeName(e.toLowerCase())
                        },
                        afterDoctypeName: function () {
                           var e = this.consume();
                           if (!at(e))
                              if (">" === e) this.delegate.endDoctype && this.delegate.endDoctype(), this.transitionTo("beforeData");
                              else {
                                 var t = e.toUpperCase() + this.input.substring(this.index, this.index + 5).toUpperCase(),
                                    a = "PUBLIC" === t.toUpperCase(),
                                    n = "SYSTEM" === t.toUpperCase();
                                 (a || n) && (this.consume(), this.consume(), this.consume(), this.consume(), this.consume(), this.consume()), a ? this.transitionTo("afterDoctypePublicKeyword") : n && this.transitionTo("afterDoctypeSystemKeyword")
                              }
                        },
                        afterDoctypePublicKeyword: function () {
                           var e = this.peek();
                           at(e) ? (this.transitionTo("beforeDoctypePublicIdentifier"), this.consume()) : '"' === e ? (this.transitionTo("doctypePublicIdentifierDoubleQuoted"), this.consume()) : "'" === e ? (this.transitionTo("doctypePublicIdentifierSingleQuoted"), this.consume()) : ">" === e && (this.consume(), this.delegate.endDoctype && this.delegate.endDoctype(), this.transitionTo("beforeData"))
                        },
                        doctypePublicIdentifierDoubleQuoted: function () {
                           var e = this.consume();
                           '"' === e ? this.transitionTo("afterDoctypePublicIdentifier") : ">" === e ? (this.delegate.endDoctype && this.delegate.endDoctype(), this.transitionTo("beforeData")) : this.delegate.appendToDoctypePublicIdentifier && this.delegate.appendToDoctypePublicIdentifier(e)
                        },
                        doctypePublicIdentifierSingleQuoted: function () {
                           var e = this.consume();
                           "'" === e ? this.transitionTo("afterDoctypePublicIdentifier") : ">" === e ? (this.delegate.endDoctype && this.delegate.endDoctype(), this.transitionTo("beforeData")) : this.delegate.appendToDoctypePublicIdentifier && this.delegate.appendToDoctypePublicIdentifier(e)
                        },
                        afterDoctypePublicIdentifier: function () {
                           var e = this.consume();
                           at(e) ? this.transitionTo("betweenDoctypePublicAndSystemIdentifiers") : ">" === e ? (this.delegate.endDoctype && this.delegate.endDoctype(), this.transitionTo("beforeData")) : '"' === e ? this.transitionTo("doctypeSystemIdentifierDoubleQuoted") : "'" === e && this.transitionTo("doctypeSystemIdentifierSingleQuoted")
                        },
                        betweenDoctypePublicAndSystemIdentifiers: function () {
                           var e = this.consume();
                           at(e) || (">" === e ? (this.delegate.endDoctype && this.delegate.endDoctype(), this.transitionTo("beforeData")) : '"' === e ? this.transitionTo("doctypeSystemIdentifierDoubleQuoted") : "'" === e && this.transitionTo("doctypeSystemIdentifierSingleQuoted"))
                        },
                        doctypeSystemIdentifierDoubleQuoted: function () {
                           var e = this.consume();
                           '"' === e ? this.transitionTo("afterDoctypeSystemIdentifier") : ">" === e ? (this.delegate.endDoctype && this.delegate.endDoctype(), this.transitionTo("beforeData")) : this.delegate.appendToDoctypeSystemIdentifier && this.delegate.appendToDoctypeSystemIdentifier(e)
                        },
                        doctypeSystemIdentifierSingleQuoted: function () {
                           var e = this.consume();
                           "'" === e ? this.transitionTo("afterDoctypeSystemIdentifier") : ">" === e ? (this.delegate.endDoctype && this.delegate.endDoctype(), this.transitionTo("beforeData")) : this.delegate.appendToDoctypeSystemIdentifier && this.delegate.appendToDoctypeSystemIdentifier(e)
                        },
                        afterDoctypeSystemIdentifier: function () {
                           var e = this.consume();
                           at(e) || ">" === e && (this.delegate.endDoctype && this.delegate.endDoctype(), this.transitionTo("beforeData"))
                        },
                        commentStart: function () {
                           var e = this.consume();
                           "-" === e ? this.transitionTo("commentStartDash") : ">" === e ? (this.delegate.finishComment(), this.transitionTo("beforeData")) : (this.delegate.appendToCommentData(e), this.transitionTo("comment"))
                        },
                        commentStartDash: function () {
                           var e = this.consume();
                           "-" === e ? this.transitionTo("commentEnd") : ">" === e ? (this.delegate.finishComment(), this.transitionTo("beforeData")) : (this.delegate.appendToCommentData("-"), this.transitionTo("comment"))
                        },
                        comment: function () {
                           var e = this.consume();
                           "-" === e ? this.transitionTo("commentEndDash") : this.delegate.appendToCommentData(e)
                        },
                        commentEndDash: function () {
                           var e = this.consume();
                           "-" === e ? this.transitionTo("commentEnd") : (this.delegate.appendToCommentData("-" + e), this.transitionTo("comment"))
                        },
                        commentEnd: function () {
                           var e = this.consume();
                           ">" === e ? (this.delegate.finishComment(), this.transitionTo("beforeData")) : (this.delegate.appendToCommentData("--" + e), this.transitionTo("comment"))
                        },
                        tagName: function () {
                           var e = this.consume();
                           at(e) ? this.transitionTo("beforeAttributeName") : "/" === e ? this.transitionTo("selfClosingStartTag") : ">" === e ? (this.delegate.finishTag(), this.transitionTo("beforeData")) : this.appendToTagName(e)
                        },
                        endTagName: function () {
                           var e = this.consume();
                           at(e) ? (this.transitionTo("beforeAttributeName"), this.tagNameBuffer = "") : "/" === e ? (this.transitionTo("selfClosingStartTag"), this.tagNameBuffer = "") : ">" === e ? (this.delegate.finishTag(), this.transitionTo("beforeData"), this.tagNameBuffer = "") : this.appendToTagName(e)
                        },
                        beforeAttributeName: function () {
                           var e = this.peek();
                           at(e) ? this.consume() : "/" === e ? (this.transitionTo("selfClosingStartTag"), this.consume()) : ">" === e ? (this.consume(), this.delegate.finishTag(), this.transitionTo("beforeData")) : "=" === e ? (this.delegate.reportSyntaxError("attribute name cannot start with equals sign"), this.transitionTo("attributeName"), this.delegate.beginAttribute(), this.consume(), this.delegate.appendToAttributeName(e)) : (this.transitionTo("attributeName"), this.delegate.beginAttribute())
                        },
                        attributeName: function () {
                           var e = this.peek();
                           at(e) ? (this.transitionTo("afterAttributeName"), this.consume()) : "/" === e ? (this.delegate.beginAttributeValue(!1), this.delegate.finishAttributeValue(), this.consume(), this.transitionTo("selfClosingStartTag")) : "=" === e ? (this.transitionTo("beforeAttributeValue"), this.consume()) : ">" === e ? (this.delegate.beginAttributeValue(!1), this.delegate.finishAttributeValue(), this.consume(), this.delegate.finishTag(), this.transitionTo("beforeData")) : '"' === e || "'" === e || "<" === e ? (this.delegate.reportSyntaxError(e + " is not a valid character within attribute names"), this.consume(), this.delegate.appendToAttributeName(e)) : (this.consume(), this.delegate.appendToAttributeName(e))
                        },
                        afterAttributeName: function () {
                           var e = this.peek();
                           at(e) ? this.consume() : "/" === e ? (this.delegate.beginAttributeValue(!1), this.delegate.finishAttributeValue(), this.consume(), this.transitionTo("selfClosingStartTag")) : "=" === e ? (this.consume(), this.transitionTo("beforeAttributeValue")) : ">" === e ? (this.delegate.beginAttributeValue(!1), this.delegate.finishAttributeValue(), this.consume(), this.delegate.finishTag(), this.transitionTo("beforeData")) : (this.delegate.beginAttributeValue(!1), this.delegate.finishAttributeValue(), this.transitionTo("attributeName"), this.delegate.beginAttribute(), this.consume(), this.delegate.appendToAttributeName(e))
                        },
                        beforeAttributeValue: function () {
                           var e = this.peek();
                           at(e) ? this.consume() : '"' === e ? (this.transitionTo("attributeValueDoubleQuoted"), this.delegate.beginAttributeValue(!0), this.consume()) : "'" === e ? (this.transitionTo("attributeValueSingleQuoted"), this.delegate.beginAttributeValue(!0), this.consume()) : ">" === e ? (this.delegate.beginAttributeValue(!1), this.delegate.finishAttributeValue(), this.consume(), this.delegate.finishTag(), this.transitionTo("beforeData")) : (this.transitionTo("attributeValueUnquoted"), this.delegate.beginAttributeValue(!1), this.consume(), this.delegate.appendToAttributeValue(e))
                        },
                        attributeValueDoubleQuoted: function () {
                           var e = this.consume();
                           '"' === e ? (this.delegate.finishAttributeValue(), this.transitionTo("afterAttributeValueQuoted")) : "&" === e ? this.delegate.appendToAttributeValue(this.consumeCharRef() || "&") : this.delegate.appendToAttributeValue(e)
                        },
                        attributeValueSingleQuoted: function () {
                           var e = this.consume();
                           "'" === e ? (this.delegate.finishAttributeValue(), this.transitionTo("afterAttributeValueQuoted")) : "&" === e ? this.delegate.appendToAttributeValue(this.consumeCharRef() || "&") : this.delegate.appendToAttributeValue(e)
                        },
                        attributeValueUnquoted: function () {
                           var e = this.peek();
                           at(e) ? (this.delegate.finishAttributeValue(), this.consume(), this.transitionTo("beforeAttributeName")) : "/" === e ? (this.delegate.finishAttributeValue(), this.consume(), this.transitionTo("selfClosingStartTag")) : "&" === e ? (this.consume(), this.delegate.appendToAttributeValue(this.consumeCharRef() || "&")) : ">" === e ? (this.delegate.finishAttributeValue(), this.consume(), this.delegate.finishTag(), this.transitionTo("beforeData")) : (this.consume(), this.delegate.appendToAttributeValue(e))
                        },
                        afterAttributeValueQuoted: function () {
                           var e = this.peek();
                           at(e) ? (this.consume(), this.transitionTo("beforeAttributeName")) : "/" === e ? (this.consume(), this.transitionTo("selfClosingStartTag")) : ">" === e ? (this.consume(), this.delegate.finishTag(), this.transitionTo("beforeData")) : this.transitionTo("beforeAttributeName")
                        },
                        selfClosingStartTag: function () {
                           ">" === this.peek() ? (this.consume(), this.delegate.markTagAsSelfClosing(), this.delegate.finishTag(), this.transitionTo("beforeData")) : this.transitionTo("beforeAttributeName")
                        },
                        endTagOpen: function () {
                           var e = this.consume();
                           ("@" === e || ":" === e || nt(e)) && (this.transitionTo("endTagName"), this.tagNameBuffer = "", this.delegate.beginEndTag(), this.appendToTagName(e))
                        }
                     }, this.reset()
                  }
                  return e.prototype.reset = function () {
                     this.transitionTo("beforeData"), this.input = "", this.tagNameBuffer = "", this.index = 0, this.line = 1, this.column = 0, this.delegate.reset()
                  }, e.prototype.transitionTo = function (e) {
                     this.state = e
                  }, e.prototype.tokenize = function (e) {
                     this.reset(), this.tokenizePart(e), this.tokenizeEOF()
                  }, e.prototype.tokenizePart = function (e) {
                     for (this.input += function (e) {
                           return e.replace(tt, "\n")
                        }(e); this.index < this.input.length;) {
                        var t = this.states[this.state];
                        if (void 0 === t) throw new Error("unhandled state " + this.state);
                        t.call(this)
                     }
                  }, e.prototype.tokenizeEOF = function () {
                     this.flushData()
                  }, e.prototype.flushData = function () {
                     "data" === this.state && (this.delegate.finishData(), this.transitionTo("beforeData"))
                  }, e.prototype.peek = function () {
                     return this.input.charAt(this.index)
                  }, e.prototype.consume = function () {
                     var e = this.peek();
                     return this.index++, "\n" === e ? (this.line++, this.column = 0) : this.column++, e
                  }, e.prototype.consumeCharRef = function () {
                     var e = this.input.indexOf(";", this.index);
                     if (-1 !== e) {
                        var t = this.input.slice(this.index, e),
                           a = this.entityParser.parse(t);
                        if (a) {
                           for (var n = t.length; n;) this.consume(), n--;
                           return this.consume(), a
                        }
                     }
                  }, e.prototype.markTagStart = function () {
                     this.delegate.tagOpen()
                  }, e.prototype.appendToTagName = function (e) {
                     this.tagNameBuffer += e, this.delegate.appendToTagName(e)
                  }, e.prototype.isIgnoredEndTag = function () {
                     var e = this.tagNameBuffer;
                     return "title" === e && "</title>" !== this.input.substring(this.index, this.index + 8) || "style" === e && "</style>" !== this.input.substring(this.index, this.index + 8) || "script" === e && "<\/script>" !== this.input.substring(this.index, this.index + 9)
                  }, e
               }(),
               ot = function () {
                  function e(e, t) {
                     void 0 === t && (t = {}), this.options = t, this.token = null, this.startLine = 1, this.startColumn = 0, this.tokens = [], this.tokenizer = new it(this, e, t.mode), this._currentAttribute = void 0
                  }
                  return e.prototype.tokenize = function (e) {
                     return this.tokens = [], this.tokenizer.tokenize(e), this.tokens
                  }, e.prototype.tokenizePart = function (e) {
                     return this.tokens = [], this.tokenizer.tokenizePart(e), this.tokens
                  }, e.prototype.tokenizeEOF = function () {
                     return this.tokens = [], this.tokenizer.tokenizeEOF(), this.tokens[0]
                  }, e.prototype.reset = function () {
                     this.token = null, this.startLine = 1, this.startColumn = 0
                  }, e.prototype.current = function () {
                     var e = this.token;
                     if (null === e) throw new Error("token was unexpectedly null");
                     if (0 === arguments.length) return e;
                     for (var t = 0; t < arguments.length; t++)
                        if (e.type === arguments[t]) return e;
                     throw new Error("token type was unexpectedly " + e.type)
                  }, e.prototype.push = function (e) {
                     this.token = e, this.tokens.push(e)
                  }, e.prototype.currentAttribute = function () {
                     return this._currentAttribute
                  }, e.prototype.addLocInfo = function () {
                     this.options.loc && (this.current().loc = {
                        start: {
                           line: this.startLine,
                           column: this.startColumn
                        },
                        end: {
                           line: this.tokenizer.line,
                           column: this.tokenizer.column
                        }
                     }), this.startLine = this.tokenizer.line, this.startColumn = this.tokenizer.column
                  }, e.prototype.beginDoctype = function () {
                     this.push({
                        type: "Doctype",
                        name: ""
                     })
                  }, e.prototype.appendToDoctypeName = function (e) {
                     this.current("Doctype").name += e
                  }, e.prototype.appendToDoctypePublicIdentifier = function (e) {
                     var t = this.current("Doctype");
                     void 0 === t.publicIdentifier ? t.publicIdentifier = e : t.publicIdentifier += e
                  }, e.prototype.appendToDoctypeSystemIdentifier = function (e) {
                     var t = this.current("Doctype");
                     void 0 === t.systemIdentifier ? t.systemIdentifier = e : t.systemIdentifier += e
                  }, e.prototype.endDoctype = function () {
                     this.addLocInfo()
                  }, e.prototype.beginData = function () {
                     this.push({
                        type: "Chars",
                        chars: ""
                     })
                  }, e.prototype.appendToData = function (e) {
                     this.current("Chars").chars += e
                  }, e.prototype.finishData = function () {
                     this.addLocInfo()
                  }, e.prototype.beginComment = function () {
                     this.push({
                        type: "Comment",
                        chars: ""
                     })
                  }, e.prototype.appendToCommentData = function (e) {
                     this.current("Comment").chars += e
                  }, e.prototype.finishComment = function () {
                     this.addLocInfo()
                  }, e.prototype.tagOpen = function () {}, e.prototype.beginStartTag = function () {
                     this.push({
                        type: "StartTag",
                        tagName: "",
                        attributes: [],
                        selfClosing: !1
                     })
                  }, e.prototype.beginEndTag = function () {
                     this.push({
                        type: "EndTag",
                        tagName: ""
                     })
                  }, e.prototype.finishTag = function () {
                     this.addLocInfo()
                  }, e.prototype.markTagAsSelfClosing = function () {
                     this.current("StartTag").selfClosing = !0
                  }, e.prototype.appendToTagName = function (e) {
                     this.current("StartTag", "EndTag").tagName += e
                  }, e.prototype.beginAttribute = function () {
                     this._currentAttribute = ["", "", !1]
                  }, e.prototype.appendToAttributeName = function (e) {
                     this.currentAttribute()[0] += e
                  }, e.prototype.beginAttributeValue = function (e) {
                     this.currentAttribute()[2] = e
                  }, e.prototype.appendToAttributeValue = function (e) {
                     this.currentAttribute()[1] += e
                  }, e.prototype.finishAttributeValue = function () {
                     this.current("StartTag").attributes.push(this._currentAttribute)
                  }, e.prototype.reportSyntaxError = function (e) {
                     this.current().syntaxError = e
                  }, e
               }();
            const st = "LinkifyResult",
               rt = "StartTag",
               lt = "EndTag",
               ct = "Chars",
               dt = "Comment",
               ut = "Doctype";

            function pt(e, t) {
               void 0 === t && (t = {});
               const a = (s = e, new ot(new Je(Ke), void 0).tokenize(s)),
                  n = [],
                  i = [],
                  o = new Ee(t, mt);
               var s;
               for (let e = 0; e < a.length; e++) {
                  const t = a[e];
                  if (t.type === rt) {
                     n.push(t);
                     const i = t.tagName.toUpperCase();
                     if (!("A" === i || o.ignoreTags.indexOf(i) >= 0)) continue;
                     let s = n.length;
                     gt(i, a, ++e, n), e += n.length - s - 1
                  } else if (t.type !== ct) n.push(t);
                  else {
                     const e = ht(t.chars, o);
                     n.push.apply(n, e)
                  }
               }
               for (let e = 0; e < n.length; e++) {
                  const t = n[e];
                  switch (t.type) {
                     case st:
                        i.push(t.rendered);
                        break;
                     case rt: {
                        let e = "<" + t.tagName;
                        t.attributes.length > 0 && (e += " " + bt(t.attributes).join(" ")), t.selfClosing && (e += " /"), e += ">", i.push(e);
                        break
                     }
                     case lt:
                        i.push(`</${t.tagName}>`);
                        break;
                     case ct:
                        i.push(_t(t.chars));
                        break;
                     case dt:
                        i.push(`\x3c!--${_t(t.chars)}--\x3e`);
                        break;
                     case ut: {
                        let e = `<!DOCTYPE ${t.name}`;
                        t.publicIdentifier && (e += ` PUBLIC "${t.publicIdentifier}"`), t.systemIdentifier && (e += ` "${t.systemIdentifier}"`), e += ">", i.push(e);
                        break
                     }
                  }
               }
               return i.join("")
            }

            function ht(e, t) {
               const a = He(e),
                  n = [];
               for (let e = 0; e < a.length; e++) {
                  const i = a[e];
                  "nl" === i.t && t.get("nl2br") ? n.push({
                     type: rt,
                     tagName: "br",
                     attributes: [],
                     selfClosing: !0
                  }) : i.isLink && t.check(i) ? n.push({
                     type: st,
                     rendered: t.render(i)
                  }) : n.push({
                     type: ct,
                     chars: i.toString()
                  })
               }
               return n
            }

            function gt(e, t, a, n) {
               let i = 1;
               for (; a < t.length && i > 0;) {
                  let o = t[a];
                  o.type === rt && o.tagName.toUpperCase() === e ? i++ : o.type === lt && o.tagName.toUpperCase() === e && i--, n.push(o), a++
               }
               return n
            }

            function mt(e) {
               let {
                  tagName: t,
                  attributes: a,
                  content: n
               } = e;
               return `<${t} ${function(e){const t=[];for(const a in e){const n=e[a]+"";t.push(`${a}="${ft(n)}"`)}return t.join(" ")}(a)}>${_t(n)}</${t}>`
            }

            function _t(e) {
               return e.replace(/</g, "&lt;").replace(/>/g, "&gt;")
            }

            function ft(e) {
               return e.replace(/"/g, "&quot;")
            }

            function bt(e) {
               const t = [];
               for (let a = 0; a < e.length; a++) {
                  const n = e[a][0],
                     i = e[a][1] + "";
                  t.push(`${n}="${ft(i)}"`)
               }
               return t
            }
            var yt = a(980),
               wt = a(101);

            function vt(e) {
               for (const t of e) {
                  const e = $(t).children(".text");
                  e.html(pt(e.html(), {
                     format: e => {
                        const {
                           href: t,
                           hostname: a,
                           pathname: n
                        } = new URL(e);
                        return yt.A.settings.linkifyChat === wt.$h.Full ? t : `${a}${"/"===n?"":n}`
                     },
                     attributes: e => ({
                        title: e,
                        target: "_blank"
                     }),
                     validate: (e, t) => "url" === t
                  }))
               }
               Tt()
            }
            var kt = a(921);

            function Tt() {
               const e = xt(),
                  {
                     settings: t
                  } = yt.A;
               switch (e) {
                  case "room": {
                     const e = $(".top");
                     e.css("background-color", t.topbarBackgroundColor), e.css("--background-color", t.topbarBackgroundColor), e.css("color", t.topbarTextColor);
                     const a = $(".sidebar");
                     a.css("background-color", t.sidebarBackgroundColor), a.css("width", `${t.sidebarWidth}px`);
                     const n = a.find("> .statsTableContainer");
                     n.css("background-color", t.sidebarBackgroundColor), n.css("position", t.enableGameStatsTableFreePosition ? "absolute" : ""), n.css("cursor", t.enableGameStatsTableFreePosition ? "grab" : ""), n.css("top", t.gameStatsTablePosition.y), n.css("left", t.gameStatsTablePosition.x);
                     const i = n.find("> .statsTable");
                     n.css("display", t.displayGameStatsTable ? "block" : "none"), i.find(".words").css("display", t.displayWordsStat ? "table-cell" : "none"), i.find(".alpha").css("display", t.displayAlphaStat ? "table-cell" : "none"), i.find(".hyphenatedWords").css("display", t.displayHyphenatedWordsStat ? "table-cell" : "none"), i.find(".longWords").css("display", t.displayLongWordsStat ? "table-cell" : "none"), i.find(".lives").css("display", t.displayLivesStat ? "table-cell" : "none"), i.find(".durationWithoutDeath").css("display", t.displayDurationWithoutDeathStat ? "table-cell" : "none"), i.find(".wordsPerMinute").css("display", t.displayWordsPerMinuteStat ? "table-cell" : "none"), i.find(".averageReactionTime").css("display", t.displayReactionTimeStat ? "table-cell" : "none");
                     const o = a.find("> .chat .log");
                     o.css("font-family", t.chatFontFamily), o.css("font-weight", t.chatFontWeight), o.css("color", t.chatMessagesColor), o.find("> div .author").css("color", t.chatNicknamesColor), o.find("> div.system").css("color", t.chatSystemMessagesColor), o.find("> div .text > a").css("color", t.chatLinksColor);
                     break
                  }
                  case "game": {
                     $(".medal").text(t.winEmoji);
                     const {
                        gameBackgroundType: e,
                        gradientColors: a,
                        solidColor: n,
                        imageURL: i
                     } = t, o = [`radial-gradient(ellipse, ${a[0]}, ${a[1]} 70%, ${a[2]}), ${kt.A.DEFAULT_SETTINGS.solidColor}`, `${n}`, `url("${null!=i?i:""}") no-repeat center / cover`];
                     $(".page").css("background", o[e]), t.enableInnerShadow || $(".page").css("box-shadow", "none");
                     break
                  }
               }
            }

            function xt() {
               const {
                  href: e
               } = location;
               return /https:\/\/jklm.fun\/[A-Z]{4}/.test(e) || /https?:\/\/.\.jklm\.macadelic\.me\/[A-Z]{4}/.test(e) ? "room" : /https:\/\/(falcon|phoenix)\.jklm\.fun\/games\/bombparty\//.test(e) || /https?:\/\/.\.jklm\.macadelic\.me\/games\/bombparty\//.test(e) ? "game" : void 0
            }

            function St(e, t, a) {
               return e <= 1 ? t : a
            }

            function Ct(e) {
               let t = "";
               for (const a of e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split("")) t += "abcdefghijklmnopqrstuvwxyz-'".includes(a) ? a : "";
               return t
            }

            function At(e) {
               let t = "";
               for (let a = 0; a < e; a++) t += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62 * Math.random()));
               return t
            }

            function $t(e) {
               const {
                  format: t
               } = new Intl.NumberFormat("fr-FR");
               return t(e)
            }
         }
      },
      o = {};

   function s(e) {
      var t = o[e];
      if (void 0 !== t) return t.exports;
      var a = o[e] = {
         exports: {}
      };
      return i[e](a, a.exports, s), a.exports
   }
   s.d = (e, t) => {
      for (var a in t) s.o(t, a) && !s.o(e, a) && Object.defineProperty(e, a, {
         enumerable: !0,
         get: t[a]
      })
   }, s.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), s.r = e => {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
         value: "Module"
      }), Object.defineProperty(e, "__esModule", {
         value: !0
      })
   }, e = s(921), t = s(980), a = s(84), n = function (e, t, a, n) {
      return new(a || (a = Promise))((function (i, o) {
         function s(e) {
            try {
               l(n.next(e))
            } catch (e) {
               o(e)
            }
         }

         function r(e) {
            try {
               l(n.throw(e))
            } catch (e) {
               o(e)
            }
         }

         function l(e) {
            var t;
            e.done ? i(e.value) : (t = e.value, t instanceof a ? t : new a((function (e) {
               e(t)
            }))).then(s, r)
         }
         l((n = n.apply(e, t || [])).next())
      }))
   }, t.A.settings = new class {
      constructor() {
         var t;
         for (const a of this._keys) this._setValue(a, null !== (t = this._getValue(a)) && void 0 !== t ? t : e.A.DEFAULT_SETTINGS[a])
      }
      get _keys() {
         return Object.keys(e.A.DEFAULT_SETTINGS)
      }
      _getKey(e) {
         return `partyplus_settings-${e}`
      }
      _setValue(e, t) {
         GM_setValue(this._getKey(e), t)
      }
      _getValue(e) {
         return GM_getValue(this._getKey(e))
      }
      get all() {
         const e = {};
         for (const t of this._keys) e[t] = this._getValue(t);
         return e
      }
      set all(e) {
         for (const t of this._keys) this._setValue(t, e[t])
      }
      reset() {
         for (const t of this._keys) this._setValue(t, e.A.DEFAULT_SETTINGS[t])
      }
      get notifyOnGameOver() {
         return this._getValue("notifyOnGameOver")
      }
      set notifyOnGameOver(e) {
         this._setValue("notifyOnGameOver", e)
      }
      get notifyOnChatMention() {
         return this._getValue("notifyOnChatMention")
      }
      set notifyOnChatMention(e) {
         this._setValue("notifyOnChatMention", e)
      }
      get linkifyChat() {
         return this._getValue("linkifyChat")
      }
      set linkifyChat(e) {
         this._setValue("linkifyChat", e)
      }
      get mentionTriggers() {
         return this._getValue("mentionTriggers")
      }
      set mentionTriggers(e) {
         this._setValue("mentionTriggers", e)
      }
      get timestampFormat() {
         return this._getValue("timestampFormat")
      }
      set timestampFormat(e) {
         this._setValue("timestampFormat", e)
      }
      get chatFontFamily() {
         return this._getValue("chatFontFamily")
      }
      set chatFontFamily(e) {
         this._setValue("chatFontFamily", e)
      }
      get chatFontWeight() {
         return this._getValue("chatFontWeight")
      }
      get enableEmojiShortcuts() {
         return this._getValue("enableEmojiShortcuts")
      }
      set enableEmojiShortcuts(e) {
         this._setValue("enableEmojiShortcuts", e)
      }
      get displayGameStatsTable() {
         return this._getValue("displayGameStatsTable")
      }
      set displayGameStatsTable(e) {
         this._setValue("displayGameStatsTable", e)
      }
      get enableGameStatsTableFreePosition() {
         return this._getValue("enableGameStatsTableFreePosition")
      }
      set enableGameStatsTableFreePosition(e) {
         this._setValue("enableGameStatsTableFreePosition", e)
      }
      get gameStatsTablePosition() {
         return this._getValue("gameStatsTablePosition")
      }
      set gameStatsTablePosition(e) {
         this._setValue("gameStatsTablePosition", e)
      }
      get displayWordsStat() {
         return this._getValue("displayWordsStat")
      }
      set displayWordsStat(e) {
         this._setValue("displayWordsStat", e)
      }
      get displayAlphaStat() {
         return this._getValue("displayAlphaStat")
      }
      set displayAlphaStat(e) {
         this._setValue("displayAlphaStat", e)
      }
      get displayHyphenatedWordsStat() {
         return this._getValue("displayHyphenatedWordsStat")
      }
      set displayHyphenatedWordsStat(e) {
         this._setValue("displayHyphenatedWordsStat", e)
      }
      get displayLongWordsStat() {
         return this._getValue("displayLongWordsStat")
      }
      set displayLongWordsStat(e) {
         this._setValue("displayLongWordsStat", e)
      }
      get displayLivesStat() {
         return this._getValue("displayLivesStat")
      }
      set displayLivesStat(e) {
         this._setValue("displayLivesStat", e)
      }
      get displayDurationWithoutDeathStat() {
         return this._getValue("displayDurationWithoutDeathStat")
      }
      set displayDurationWithoutDeathStat(e) {
         this._setValue("displayDurationWithoutDeathStat", e)
      }
      get displayWordsPerMinuteStat() {
         return this._getValue("displayWordsPerMinuteStat")
      }
      set displayWordsPerMinuteStat(e) {
         this._setValue("displayWordsPerMinuteStat", e)
      }
      get displayReactionTimeStat() {
         return this._getValue("displayReactionTimeStat")
      }
      set displayReactionTimeStat(e) {
         this._setValue("displayReactionTimeStat", e)
      }
      set chatFontWeight(e) {
         this._setValue("chatFontWeight", e)
      }
      get enableSkipTurnShortcut() {
         return this._getValue("enableSkipTurnShortcut")
      }
      set enableSkipTurnShortcut(e) {
         this._setValue("enableSkipTurnShortcut", e)
      }
      get enableGiveUpShortcut() {
         return this._getValue("enableGiveUpShortcut")
      }
      set enableGiveUpShortcut(e) {
         this._setValue("enableGiveUpShortcut", e)
      }
      get enableTabKey() {
         return this._getValue("enableTabKey")
      }
      set enableTabKey(e) {
         this._setValue("enableTabKey", e)
      }
      get topbarBackgroundColor() {
         return this._getValue("topbarBackgroundColor")
      }
      set topbarBackgroundColor(e) {
         this._setValue("topbarBackgroundColor", e)
      }
      get topbarTextColor() {
         return this._getValue("topbarTextColor")
      }
      set topbarTextColor(e) {
         this._setValue("topbarTextColor", e)
      }
      get sidebarBackgroundColor() {
         return this._getValue("sidebarBackgroundColor")
      }
      set sidebarBackgroundColor(e) {
         this._setValue("sidebarBackgroundColor", e)
      }
      get chatNicknamesColor() {
         return this._getValue("chatNicknamesColor")
      }
      set chatNicknamesColor(e) {
         this._setValue("chatNicknamesColor", e)
      }
      get chatMessagesColor() {
         return this._getValue("chatMessagesColor")
      }
      set chatMessagesColor(e) {
         this._setValue("chatMessagesColor", e)
      }
      get chatSystemMessagesColor() {
         return this._getValue("chatSystemMessagesColor")
      }
      set chatSystemMessagesColor(e) {
         this._setValue("chatSystemMessagesColor", e)
      }
      get chatLinksColor() {
         return this._getValue("chatLinksColor")
      }
      set chatLinksColor(e) {
         this._setValue("chatLinksColor", e)
      }
      get remainingBonusLettersColor() {
         return this._getValue("remainingBonusLettersColor")
      }
      set remainingBonusLettersColor(e) {
         this._setValue("remainingBonusLettersColor", e)
      }
      get usedBonusLettersColor() {
         return this._getValue("usedBonusLettersColor")
      }
      set usedBonusLettersColor(e) {
         this._setValue("usedBonusLettersColor", e)
      }
      get presentPlayerNicknamesColor() {
         return this._getValue("presentPlayerNicknamesColor")
      }
      set presentPlayerNicknamesColor(e) {
         this._setValue("presentPlayerNicknamesColor", e)
      }
      get absentPlayerNicknamesColor() {
         return this._getValue("absentPlayerNicknamesColor")
      }
      set absentPlayerNicknamesColor(e) {
         this._setValue("absentPlayerNicknamesColor", e)
      }
      get currentPlayerWordColor() {
         return this._getValue("currentPlayerWordColor")
      }
      set currentPlayerWordColor(e) {
         this._setValue("currentPlayerWordColor", e)
      }
      get otherPlayersWordColor() {
         return this._getValue("otherPlayersWordColor")
      }
      set otherPlayersWordColor(e) {
         this._setValue("otherPlayersWordColor", e)
      }
      get wordSyllableColor() {
         return this._getValue("wordSyllableColor")
      }
      set wordSyllableColor(e) {
         this._setValue("wordSyllableColor", e)
      }
      get lifeEmoji() {
         return this._getValue("lifeEmoji")
      }
      set lifeEmoji(e) {
         this._setValue("lifeEmoji", e)
      }
      get deathEmoji() {
         return this._getValue("deathEmoji")
      }
      set deathEmoji(e) {
         this._setValue("deathEmoji", e)
      }
      get winEmoji() {
         return this._getValue("winEmoji")
      }
      set winEmoji(e) {
         this._setValue("winEmoji", e)
      }
      get sidebarWidth() {
         return this._getValue("sidebarWidth")
      }
      set sidebarWidth(e) {
         this._setValue("sidebarWidth", e)
      }
      get gameBackgroundType() {
         return this._getValue("gameBackgroundType")
      }
      set gameBackgroundType(e) {
         this._setValue("gameBackgroundType", e)
      }
      get gradientColors() {
         return this._getValue("gradientColors")
      }
      set gradientColors(e) {
         this._setValue("gradientColors", e)
      }
      get solidColor() {
         return this._getValue("solidColor")
      }
      set solidColor(e) {
         this._setValue("solidColor", e)
      }
      get imageURL() {
         return this._getValue("imageURL")
      }
      set imageURL(e) {
         this._setValue("imageURL", e)
      }
      get enableInnerShadow() {
         return this._getValue("enableInnerShadow")
      }
      set enableInnerShadow(e) {
         this._setValue("enableInnerShadow", e)
      }
      get hideInGameAvatars() {
         return this._getValue("hideInGameAvatars")
      }
      set hideInGameAvatars(e) {
         this._setValue("hideInGameAvatars", e)
      }
      get hideInGameNicknames() {
         return this._getValue("hideInGameNicknames")
      }
      set hideInGameNicknames(e) {
         this._setValue("hideInGameNicknames", e)
      }
      get trainListId() {
         return this._getValue("trainListId")
      }
      set trainListId(e) {
         this._setValue("trainListId", e)
      }
      get trainLists() {
         return this._getValue("trainLists")
      }
      set trainLists(e) {
         this._setValue("trainLists", e)
      }
      get forceTrainList() {
         return this._getValue("forceTrainList")
      }
      set forceTrainList(e) {
         this._setValue("forceTrainList", e)
      }
      get enableTrainMessages() {
         return this._getValue("enableTrainMessages")
      }
      set enableTrainMessages(e) {
         this._setValue("enableTrainMessages", e)
      }
   }, n(void 0, void 0, void 0, (function* () {
      switch ((0, a.qv)()) {
         case "room":
            yield new Promise((e => {
               const a = setInterval((() => {
                  socket && settings && (clearInterval(a), t.A.socket = socket, t.A.jklmSettings = settings, e())
               }), 100)
            })), s(421);
            break;
         case "game":
            yield new Promise((e => {
               const a = setInterval((() => {
                  socket && (clearInterval(a), t.A.socket = socket, e())
               }), 100)
            })), s(667)
      }
   }))
})();